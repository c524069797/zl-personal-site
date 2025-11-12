import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware'

// 获取单篇文章
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth(request)

  if (authResult.error) {
    return authResult.error
  }

  try {
    const { id } = await params

    const post = await prisma.post.findUnique({
      where: { id },
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

    if (!post) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      )
    }

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
    })
  } catch (error) {
    console.error('获取文章错误:', error)
    return NextResponse.json(
      { error: '获取文章失败' },
      { status: 500 }
    )
  }
}

// 更新文章
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth(request)

  if (authResult.error) {
    return authResult.error
  }

  try {
    const { id } = await params
    const body = await request.json()
    const { title, content, summary, slug, tags, published, date } = body

    // 验证输入
    if (!title || !content) {
      return NextResponse.json(
        { error: '标题和内容不能为空' },
        { status: 400 }
      )
    }

    // 检查文章是否存在
    const existingPost = await prisma.post.findUnique({
      where: { id },
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      )
    }

    // 检查权限（只能编辑自己的文章，除非是管理员）
    if (existingPost.authorId !== authResult.user!.id && authResult.user!.role !== 'admin') {
      return NextResponse.json(
        { error: '无权编辑此文章' },
        { status: 403 }
      )
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

    // 更新文章
    // 先删除旧的标签关联
    await prisma.postTag.deleteMany({
      where: { postId: id },
    })

    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        summary: summary || null,
        slug: slug || existingPost.slug,
        published: published !== undefined ? published : existingPost.published,
        date: date ? new Date(date) : existingPost.date,
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
      message: '文章更新成功',
    })
  } catch (error) {
    console.error('更新文章错误:', error)
    return NextResponse.json(
      { error: '更新文章失败' },
      { status: 500 }
    )
  }
}

// 删除文章
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth(request)

  if (authResult.error) {
    return authResult.error
  }

  try {
    const { id } = await params

    // 检查文章是否存在
    const existingPost = await prisma.post.findUnique({
      where: { id },
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      )
    }

    // 检查权限（只能删除自己的文章，除非是管理员）
    if (existingPost.authorId !== authResult.user!.id && authResult.user!.role !== 'admin') {
      return NextResponse.json(
        { error: '无权删除此文章' },
        { status: 403 }
      )
    }

    await prisma.post.delete({
      where: { id },
    })

    return NextResponse.json({
      message: '文章删除成功',
    })
  } catch (error) {
    console.error('删除文章错误:', error)
    return NextResponse.json(
      { error: '删除文章失败' },
      { status: 500 }
    )
  }
}

