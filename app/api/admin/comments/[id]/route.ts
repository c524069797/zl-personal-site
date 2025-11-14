import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/middleware'

// 审批评论
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult.error) {
      return authResult.error
    }

    const { id } = await params
    const body = await request.json()
    const { approved } = body

    if (typeof approved !== 'boolean') {
      return NextResponse.json(
        { error: 'approved 参数必须是布尔值' },
        { status: 400 }
      )
    }

    const comment = await prisma.comment.update({
      where: { id },
      data: { approved },
      include: {
        post: {
          select: {
            id: true,
            slug: true,
            title: true,
          },
        },
      },
    })

    return NextResponse.json({
      comment,
      message: approved ? '评论已通过审核' : '评论已拒绝',
    })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: '评论不存在' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: '审批评论失败' },
      { status: 500 }
    )
  }
}

// 删除评论
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(request)
    if (authResult.error) {
      return authResult.error
    }

    const { id } = await params

    await prisma.comment.delete({
      where: { id },
    })

    return NextResponse.json({
      message: '评论已删除',
    })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: '评论不存在' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: '删除评论失败' },
      { status: 500 }
    )
  }
}

