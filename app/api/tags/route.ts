import { NextResponse } from 'next/server'
import { getBlogPageData } from '@/lib/posts'

// 获取所有标签及其文章数量
export async function GET() {
  try {
    const { tags: formattedTags } = await getBlogPageData()

    return NextResponse.json(
      { tags: formattedTags },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching tags:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      {
        error: 'Failed to fetch tags',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}
