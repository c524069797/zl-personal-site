import { NextResponse } from 'next/server'
import { getBlogPageData } from '@/lib/posts'

// 获取分类统计信息
export async function GET() {
  try {
    const { categories } = await getBlogPageData()

    return NextResponse.json(
      {
        categories,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching categories:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: 'Failed to fetch categories', details: errorMessage },
      { status: 500 }
    )
  }
}
