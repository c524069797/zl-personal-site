import { NextRequest, NextResponse } from 'next/server'
import { getAllBlogListPosts, toPublicBlogListPost } from '@/lib/posts'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')
    const category = searchParams.get('category') // tech 或 life
    const selectedCategory = category === 'tech' || category === 'life' ? category : null

    const allPosts = await getAllBlogListPosts()
    const filteredPosts = allPosts.filter((post) => {
      const matchesCategory =
        !selectedCategory ||
        (selectedCategory === 'tech' && post.category !== 'life') ||
        (selectedCategory === 'life' && post.category === 'life')
      const matchesTag = !tag || post.tags.some((postTag) => postTag.slug === tag)
      const normalizedSearch = search?.toLowerCase()
      const matchesSearch =
        !normalizedSearch ||
        post.title.toLowerCase().includes(normalizedSearch) ||
        post.summary.toLowerCase().includes(normalizedSearch) ||
        post.searchText?.toLowerCase().includes(normalizedSearch)

      return matchesCategory && matchesTag && matchesSearch
    })
    const total = filteredPosts.length
    const posts = filteredPosts
      .slice((page - 1) * limit, page * limit)
      .map(toPublicBlogListPost)

    return NextResponse.json(
      {
        posts,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
        },
      }
    )
  } catch (error: unknown) {
    const errorObj = error instanceof Error ? error : new Error(String(error))
    const errorWithCode = error as { code?: string }
    console.error('Error fetching posts:', errorObj)
    console.error('Error details:', {
      message: errorObj.message,
      code: errorWithCode.code,
      stack: errorObj.stack,
    })
    return NextResponse.json(
      {
        error: 'Failed to fetch posts',
        details: process.env.NODE_ENV === 'development' ? errorObj.message : undefined,
      },
      { status: 500 }
    )
  }
}
