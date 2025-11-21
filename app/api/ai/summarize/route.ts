// AI摘要生成API

import { NextRequest, NextResponse } from 'next/server'
import { generateSummary } from '@/lib/openai'
import { prisma } from '@/lib/prisma'

// 设置路由配置以增加超时时间
export const maxDuration = 60 // 60秒超时
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { postId, force, provider = 'deepseek' } = await request.json()

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
    }

    // 添加超时控制
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out after 50 seconds.')), 50000)
    })

    const postPromise = prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        title: true,
        content: true,
        aiSummary: true,
        aiKeywords: true,
        aiSummaryAt: true,
      },
    })

    const post = await Promise.race([postPromise, timeoutPromise]) as Awaited<typeof postPromise> | null

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // 如果已有摘要且未过期（7天内）且不是强制重新生成，直接返回
    if (!force && post.aiSummary && post.aiKeywords && post.aiSummaryAt) {
      const daysSinceSummary = (Date.now() - post.aiSummaryAt.getTime()) / (1000 * 60 * 60 * 24)
      if (daysSinceSummary < 7) {
        return NextResponse.json({
          summary: post.aiSummary,
          keywords: post.aiKeywords.split(',').map((k: string) => k.trim()),
        })
      }
    }

    // 生成新摘要（添加超时控制）
    const generateSummaryPromise = generateSummary(post.title, post.content, provider)
    const { summary, keywords } = await Promise.race([
      generateSummaryPromise,
      timeoutPromise,
    ]) as { summary: string; keywords: string[] }

    // 保存到数据库
    await prisma.post.update({
      where: { id: postId },
      data: {
        aiSummary: summary,
        aiKeywords: keywords.join(', '),
        aiSummaryAt: new Date(),
      },
    })

    return NextResponse.json({
      summary,
      keywords,
    })
  } catch (error: unknown) {
    const errorObj = error instanceof Error ? error : new Error(String(error))
    console.error('AI summarize error:', errorObj)
    console.error('Error details:', {
      message: errorObj.message,
      stack: errorObj.stack,
      name: errorObj.name,
    })

    // 处理超时错误
    if (error.message?.includes('timed out') || error.message?.includes('timeout')) {
      return NextResponse.json(
        {
          error: '请求超时。可能是OpenAI API响应较慢，请稍后重试。如果问题持续，请检查网络连接和OpenAI API状态。',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        },
        { status: 504 }
      )
    }

    // 处理OpenAI API错误
    if (error.message?.includes('OpenAI') || error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        {
          error: 'OpenAI API连接失败。请检查网络连接和API密钥配置。',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        },
        { status: 503 }
      )
    }

    return NextResponse.json(
      {
        error: error.message || '生成摘要失败，请稍后重试。',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}

