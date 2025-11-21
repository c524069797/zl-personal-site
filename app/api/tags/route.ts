import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取所有标签及其文章数量
export async function GET() {
  try {
    // 确保数据库连接
    await prisma.$connect()

    const tags = await prisma.tag.findMany({
      include: {
        posts: {
          include: {
            post: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    const formattedTags = tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      count: tag.posts.filter((pt) => pt.post.published).length,
    }))

    return NextResponse.json({
      tags: formattedTags,
    })
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
  } finally {
    await prisma.$disconnect().catch(() => {
      // 忽略断开连接错误
    })
  }
}

