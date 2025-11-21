import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')
    const category = searchParams.get('category') // tech 或 life

    const where: Record<string, unknown> = {
      published: true,
    }

    // 分类筛选
    if (category === 'tech' || category === 'life') {
      if (category === 'tech') {
        // tech分类：查询category为'tech'或null的文章（null默认为tech）
        where.OR = [
          { category: 'tech' },
          { category: null },
        ]
      } else {
        // life分类：只查询category为'life'的文章
        where.category = 'life'
      }
    }

    // 标签筛选
    if (tag) {
      where.tags = {
        some: {
          tag: {
            slug: tag,
          },
        },
      }
    }

    // 搜索筛选 - 需要与category条件合并
    if (search) {
      const searchConditions = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ]

      // 如果已经有category的OR条件，需要用AND合并
      if (where.OR && Array.isArray(where.OR) && where.OR.length > 0 && where.OR[0].category !== undefined) {
        const categoryOr = where.OR
        delete where.OR
        where.AND = [
          { OR: categoryOr },
          { OR: searchConditions },
        ]
      } else {
        // 没有category条件，直接设置search的OR
        where.OR = searchConditions
      }
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          date: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where }),
    ])

    // 转换数据格式以匹配前端期望的格式
    const formattedPosts = posts.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      date: post.date.toISOString(),
      summary: post.summary || '',
      category: post.category || 'tech',
      tags: post.tags.map((pt) => ({
        name: pt.tag.name,
        slug: pt.tag.slug,
      })),
      content: post.content,
      author: post.author,
    }))

    return NextResponse.json({
      posts: formattedPosts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error: unknown) {
    console.error('Error fetching posts:', error)
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
    })
    return NextResponse.json(
      {
        error: 'Failed to fetch posts',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}

