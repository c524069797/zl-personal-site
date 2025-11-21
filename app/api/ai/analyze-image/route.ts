// AI分析标题并返回合适的图片类型
import { NextRequest, NextResponse } from 'next/server'
import { askQuestion } from '@/lib/openai'

export const maxDuration = 30
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { title, summary } = await request.json()

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const prompt = `请分析以下博客文章标题，判断应该使用什么类型的图片。

文章标题：${title}
${summary ? `文章摘要：${summary.substring(0, 200)}` : ''}

请根据标题内容，从以下类型中选择最合适的一个：
1. vue - 如果标题包含Vue相关技术
2. react - 如果标题包含React相关技术
3. meeting - 如果标题包含表达、沟通、会议、交流、团队协作等关键词
4. security - 如果标题包含安全、防护、XSS、CSRF等关键词
5. code - 如果标题包含代码、编程、开发等技术关键词
6. book - 如果标题包含学习、习惯、提升、成长等关键词
7. default - 其他情况

请只返回类型名称（如：vue、meeting、code等），不要返回其他内容。`

    const response = await askQuestion(
      prompt,
      [],
      'deepseek'
    )

    // 提取图片类型
    let imageType = 'default'
    const answer = response.answer.toLowerCase().trim()

    if (answer.includes('vue')) {
      imageType = 'vue'
    } else if (answer.includes('react')) {
      imageType = 'react'
    } else if (answer.includes('meeting') || answer.includes('表达') || answer.includes('沟通') || answer.includes('交流')) {
      imageType = 'meeting'
    } else if (answer.includes('security') || answer.includes('安全') || answer.includes('防护')) {
      imageType = 'security'
    } else if (answer.includes('code') || answer.includes('代码') || answer.includes('编程')) {
      imageType = 'code'
    } else if (answer.includes('book') || answer.includes('学习') || answer.includes('习惯') || answer.includes('提升')) {
      imageType = 'book'
    }

    return NextResponse.json({
      imageType,
      title,
    })
  } catch (error: unknown) {
    console.error('AI analyze image error:', error)
    const errorMessage = error instanceof Error ? error.message : '分析失败'
    return NextResponse.json(
      {
        error: errorMessage,
        imageType: 'default', // 失败时返回默认类型
      },
      { status: 500 }
    )
  }
}

