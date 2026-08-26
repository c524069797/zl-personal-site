import { NextRequest, NextResponse } from 'next/server'
import { getAllBlogListPosts, toPublicBlogListPost } from '@/lib/posts'

// 获取最新文章（按发布时间排序）
export async function GET(request: NextRequest) {
  try {


    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')

    const posts = (await getAllBlogListPosts())
      .slice(0, limit)
      .map(toPublicBlogListPost)

    return NextResponse.json(
      { posts },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
        },
      }
    )
  } catch (error: unknown) {
    console.error('Error fetching latest posts:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      {
        error: 'Failed to fetch latest posts',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}
