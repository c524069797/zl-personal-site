import { NextRequest, NextResponse } from 'next/server'
import { getAllBlogListPosts, toPublicBlogListPost } from '@/lib/posts'

// 获取最热文章（按评论数量排序）
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')

    const posts = [...(await getAllBlogListPosts())]
      .sort((a, b) => {
        const commentDiff = b.commentCount - a.commentCount
        if (commentDiff !== 0) return commentDiff
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })
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
    console.error('Error fetching hot posts:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      {
        error: 'Failed to fetch hot posts',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}
