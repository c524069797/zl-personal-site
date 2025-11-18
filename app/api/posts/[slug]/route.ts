import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // findUnique 只能使用唯一字段，所以先查找 slug，再检查 published
    const post = await prisma.post.findUnique({
      where: {
        slug,
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

    // 检查文章是否存在且已发布
    if (!post || !post.published) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // 转换数据格式
    const formattedPost = {
      id: post.id,
      slug: post.slug,
      title: post.title,
      date: post.date.toISOString(),
      summary: post.summary || '',
      tags: post.tags.map((pt) => ({
        name: pt.tag.name,
        slug: pt.tag.slug,
      })),
      content: post.content,
      author: post.author,
    }

    return NextResponse.json(formattedPost)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

