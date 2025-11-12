import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
  } catch (error) {
    console.error('获取评论错误:', error)
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

    // 创建评论（默认需要审核）
    const comment = await prisma.comment.create({
      data: {
        author,
        email: email || null,
        website: website || null,
        content,
        postId: post.id,
        approved: false, // 默认需要审核
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
  } catch (error) {
    console.error('创建评论错误:', error)
    return NextResponse.json(
      { error: '评论提交失败' },
      { status: 500 }
    )
  }
}

