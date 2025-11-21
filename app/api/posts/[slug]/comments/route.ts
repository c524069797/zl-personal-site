import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { moderateComment } from '@/lib/openai'

// 获取文章评论
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // 查找文章
    const post = await prisma.post.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!post) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      )
    }

    // 获取已审核的评论
    const comments = await prisma.comment.findMany({
      where: {
        postId: post.id,
        approved: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ comments })
  } catch {
    return NextResponse.json(
      { error: '获取评论失败' },
      { status: 500 }
    )
  }
}

// 创建评论（游客）
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // 检查数据库连接
    await prisma.$connect()

    const { slug } = await params
    const body = await request.json()
    const { author, email, website, content } = body

    // 验证输入
    if (!author || !content) {
      return NextResponse.json(
        { error: '姓名和评论内容不能为空' },
        { status: 400 }
      )
    }

    // 查找文章
    const post = await prisma.post.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!post) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      )
    }

    // AI审核评论（默认使用deepseek）
    let aiCheckResult
    try {
      aiCheckResult = await moderateComment(content, 'deepseek')
    } catch (error) {
      console.error('AI moderation failed:', error)
      // AI审核失败不影响评论创建，继续使用默认审核流程
    }

    // 创建评论
    // 如果AI判断不是垃圾且无攻击性，可以自动通过
    const shouldAutoApprove =
      aiCheckResult &&
      !aiCheckResult.isSpam &&
      !aiCheckResult.isToxic &&
      aiCheckResult.spamScore < 0.3 &&
      aiCheckResult.toxicScore < 0.3

    const comment = await prisma.comment.create({
      data: {
        author,
        email: email || null,
        website: website || null,
        content,
        postId: post.id,
        approved: shouldAutoApprove || false,
        aiChecked: !!aiCheckResult,
        aiSpamScore: aiCheckResult?.spamScore || null,
        aiToxicScore: aiCheckResult?.toxicScore || null,
        aiAutoReply: aiCheckResult?.autoReply || null,
        aiCheckedAt: aiCheckResult ? new Date() : null,
      },
    })

    return NextResponse.json({
      comment: {
        id: comment.id,
        author: comment.author,
        email: comment.email,
        website: comment.website,
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
      },
      message: '评论已提交，等待审核',
    }, { status: 201 })
  } catch (error: unknown) {
    const errorWithCode = error as { code?: string; message?: string }
    // 检查是否是数据库连接错误
    if (errorWithCode.code === 'P1001' || errorWithCode.message?.includes('Can\'t reach database')) {
      return NextResponse.json(
        {
          error: '数据库连接失败，请检查数据库配置',
          details: process.env.NODE_ENV === 'development' ? errorWithCode.message : undefined
        },
        { status: 500 }
      )
    }

    // 返回更详细的错误信息
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      {
        error: '评论提交失败',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}

