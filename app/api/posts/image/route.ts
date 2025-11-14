import { NextRequest, NextResponse } from 'next/server'
import { getPostCoverImage, extractKeywords } from '@/lib/image-utils'

/**
 * 获取文章封面图片
 * GET /api/posts/image?title=文章标题&summary=文章摘要
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const title = searchParams.get('title') || ''
    const summary = searchParams.get('summary') || ''

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    // 生成图片URL
    const imageUrl = getPostCoverImage(title, summary || undefined)
    const keywords = extractKeywords(title)

    return NextResponse.json({
      imageUrl,
      keywords,
      title,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate image URL' },
      { status: 500 }
    )
  }
}

