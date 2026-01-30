// RAG智能问答API - 基于关键词搜索博客内容

import { NextRequest, NextResponse } from 'next/server'
import { askQuestion } from '@/lib/openai'
import { prisma } from '@/lib/prisma'

export const maxDuration = 60
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    await prisma.$connect()

    const { question } = await request.json()

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      )
    }

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out.')), 50000)
    })

    // 从问题中提取关键词（简单分词）
    const keywords = question
      .replace(/[？?！!。，,、\s]+/g, ' ')
      .split(' ')
      .filter(w => w.length >= 2)
      .slice(0, 5)

    // 搜索包含关键词的文章
    let posts = await prisma.post.findMany({
      where: {
        published: true,
        OR: keywords.length ? keywords.map(keyword => ({
          OR: [
            { title: { contains: keyword, mode: 'insensitive' as const } },
            { content: { contains: keyword, mode: 'insensitive' as const } },
          ]
        })) : undefined,
      },
      select: {
        id: true,
        slug: true,
        title: true,
        content: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    // 如果搜索不到，取最新文章
    if (!posts.length) {
      posts = await prisma.post.findMany({
        where: { published: true },
        select: { id: true, slug: true, title: true, content: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      })
    }

    if (!posts.length) {
      return NextResponse.json({
        answer: '抱歉，博客中还没有文章内容。',
        sources: [],
      })
    }

    const context = posts.map(post => ({
      title: post.title,
      content: post.content.substring(0, 1500),
      slug: post.slug,
    }))

    const askQuestionPromise = askQuestion(question, context)
    const result = await Promise.race([askQuestionPromise, timeoutPromise]) as { answer: string; sources: Array<{ title: string; slug: string }> }

    return NextResponse.json(result)
  } catch (error: unknown) {
    const errorObj = error instanceof Error ? error : new Error(String(error))
    console.error('RAG ask error:', errorObj)

    if (errorObj.message === 'Request timed out.') {
      return NextResponse.json({ error: '请求超时，请稍后重试。' }, { status: 504 })
    }

    return NextResponse.json(
      { error: errorObj.message || '处理问题时出现错误，请稍后重试。' },
      { status: 500 }
    )
  }
}
