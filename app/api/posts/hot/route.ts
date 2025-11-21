import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取最热文章（按评论数量排序）
export async function GET(request: NextRequest) {
  try {
    // 确保数据库连接
    await prisma.$connect()

    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')

    // 获取所有已发布的文章及其评论数量
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            comments: {
              where: {
                approved: true,
              },
            },
          },
        },
      },
    })

    // 按评论数量排序，然后按日期排序
    const sortedPosts = posts
      .sort((a, b) => {
        const commentDiff = b._count.comments - a._count.comments
        if (commentDiff !== 0) return commentDiff
        return b.date.getTime() - a.date.getTime()
      })
      .slice(0, limit)

    const formattedPosts = sortedPosts.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      date: post.date.toISOString(),
      summary: post.summary || '',
      tags: post.tags.map((pt) => ({
        name: pt.tag.name,
        slug: pt.tag.slug,
      })),
      commentCount: post._count.comments,
    }))

    return NextResponse.json({
      posts: formattedPosts,
    })
  } catch (error: unknown) {
    console.error('Error fetching hot posts:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch hot posts',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

