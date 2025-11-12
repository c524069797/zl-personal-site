import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware'

// 获取所有文章（管理员）
export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request)

  if (authResult.error) {
    return authResult.error
  }

  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')

    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ]
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

    const formattedPosts = posts.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      summary: post.summary,
      date: post.date.toISOString(),
      published: post.published,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      tags: post.tags.map((pt) => ({
        id: pt.tag.id,
        name: pt.tag.name,
        slug: pt.tag.slug,
      })),
      author: post.author,
    }))

    return NextResponse.json({
      posts: formattedPosts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('获取文章列表错误:', error)
    return NextResponse.json(
      { error: '获取文章列表失败' },
      { status: 500 }
    )
  }
}

// 创建文章
export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request)

  if (authResult.error) {
    return authResult.error
  }

  try {
    const body = await request.json()
    const { title, content, summary, slug, tags, published, date } = body

    // 验证输入
    if (!title || !content) {
      return NextResponse.json(
        { error: '标题和内容不能为空' },
        { status: 400 }
      )
    }

    // 生成 slug（如果没有提供）
    let postSlug = slug || title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // 检查 slug 是否已存在
    const existingPost = await prisma.post.findUnique({
      where: { slug: postSlug },
    })

    if (existingPost) {
      postSlug = `${postSlug}-${Date.now()}`
    }

    // 处理标签
    const tagConnections = await Promise.all(
      (tags || []).map(async (tagName: string) => {
        const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-')
        const tag = await prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: {
            name: tagName,
            slug: tagSlug,
          },
        })
        return { id: tag.id }
      })
    )

    // 创建文章
    const post = await prisma.post.create({
      data: {
        title,
        content,
        summary: summary || null,
        slug: postSlug,
        published: published || false,
        date: date ? new Date(date) : new Date(),
        authorId: authResult.user!.id,
        tags: {
          create: tagConnections.map((tag) => ({
            tagId: tag.id,
          })),
        },
      },
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
    })

    return NextResponse.json({
      post: {
        id: post.id,
        slug: post.slug,
        title: post.title,
        content: post.content,
        summary: post.summary,
        date: post.date.toISOString(),
        published: post.published,
        tags: post.tags.map((pt) => ({
          id: pt.tag.id,
          name: pt.tag.name,
          slug: pt.tag.slug,
        })),
        author: post.author,
      },
      message: '文章创建成功',
    }, { status: 201 })
  } catch (error) {
    console.error('创建文章错误:', error)
    return NextResponse.json(
      { error: '创建文章失败' },
      { status: 500 }
    )
  }
}

