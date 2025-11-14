import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // 确保数据库连接
    await prisma.$connect()

    const body = await request.json()
    const { email, password, name } = body

    // 验证输入
    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码不能为空' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: '密码长度至少为 6 位' },
        { status: 400 }
      )
    }

    // 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 400 }
      )
    }

    // 直接存储明文密码（不加密）
    // 创建用户
    const user = await prisma.user.create({
      data: {
        email,
        password: password,
        name: name || null,
        role: 'author', // 默认角色为作者
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    })

    // 生成 token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    return NextResponse.json({
      user,
      token,
      message: '注册成功',
    })
  } catch (error: any) {
    // 返回更详细的错误信息用于调试
    return NextResponse.json(
      {
        error: '注册失败，请稍后重试',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

