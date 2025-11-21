// RAG智能问答API

import { NextRequest, NextResponse } from 'next/server'
import { generateEmbedding, askQuestion } from '@/lib/openai'
import { searchVectors } from '@/lib/qdrant'
import { prisma } from '@/lib/prisma'

// 设置路由配置以增加超时时间
export const maxDuration = 60 // 60秒超时（Vercel Pro计划支持，免费版最多10秒）
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { question, provider = 'deepseek' } = await request.json()

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      )
    }

    // 添加超时控制
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out.')), 50000) // 50秒超时
    })

    // 生成问题的向量
    const queryVectorPromise = generateEmbedding(question)
    const queryVector = await Promise.race([queryVectorPromise, timeoutPromise]) as number[]

    // 搜索相似的文章块
    const searchResultsPromise = searchVectors(queryVector, 5, 0.7)
    const searchResults = await Promise.race([searchResultsPromise, timeoutPromise]) as Array<Record<string, unknown>>

    if (searchResults.length === 0) {
      return NextResponse.json({
        answer: '抱歉，我没有找到相关的文章内容来回答您的问题。',
        sources: [],
      })
    }

    // 获取文章ID并去重
    const postIds = [
      ...new Set(searchResults.map((r) => {
        const payload = r.payload as { postId?: string } | undefined
        return payload?.postId
      }).filter((id): id is string => Boolean(id))),
    ]

    // 从数据库获取完整文章信息
    const posts = await prisma.post.findMany({
      where: {
        id: { in: postIds },
        published: true,
      },
      select: {
        id: true,
        slug: true,
        title: true,
        content: true,
      },
    })

    // 构建上下文（使用搜索到的块，去重）
    const contextMap = new Map<string, { title: string; content: string; slug: string }>()

    for (const result of searchResults) {
      const payload = result.payload as { postId?: string; content?: string } | undefined
      const postId = payload?.postId
      if (!postId) continue
      
      const post = posts.find((p) => p.id === postId)

      if (post && !contextMap.has(postId)) {
        contextMap.set(postId, {
          title: post.title,
          content: payload?.content || post.content.substring(0, 500),
          slug: post.slug,
        })
      }
    }

    const context = Array.from(contextMap.values())

    if (context.length === 0) {
      return NextResponse.json({
        answer: '抱歉，我没有找到相关的文章内容来回答您的问题。',
        sources: [],
      })
    }

    // 使用LLM生成答案（添加超时控制）
    const askQuestionPromise = askQuestion(question, context, provider)
    const result = await Promise.race([askQuestionPromise, timeoutPromise]) as { answer: string; sources: Array<{ title: string; slug: string }> }

    return NextResponse.json(result)
  } catch (error: unknown) {
    const errorObj = error instanceof Error ? error : new Error(String(error))
    console.error('RAG ask error:', errorObj)

    // 处理超时错误
    if (errorObj.message === 'Request timed out.') {
      return NextResponse.json(
        { error: '请求超时，请稍后重试。如果问题持续，可能是OpenAI API响应较慢或Qdrant服务未启动。' },
        { status: 504 }
      )
    }

    // 处理Qdrant连接错误
    if (errorObj.message?.includes('ECONNREFUSED') || errorObj.message?.includes('Qdrant')) {
      return NextResponse.json(
        { error: '向量数据库连接失败，请确保Qdrant服务正在运行。' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: errorObj.message || '处理问题时出现错误，请稍后重试。' },
      { status: 500 }
    )
  }
}

