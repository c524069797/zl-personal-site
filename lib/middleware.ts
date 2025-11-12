import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from './auth'

// 认证中间件
export async function requireAuth(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')

  if (!token) {
    return {
      error: NextResponse.json(
        { error: '未授权，请先登录' },
        { status: 401 }
      ),
      user: null,
    }
  }

  const user = await getCurrentUser(token)

  if (!user) {
    return {
      error: NextResponse.json(
        { error: '无效的 token' },
        { status: 401 }
      ),
      user: null,
    }
  }

  return { error: null, user }
}

// 管理员权限检查
export async function requireAdmin(request: NextRequest) {
  const authResult = await requireAuth(request)

  if (authResult.error) {
    return authResult
  }

  if (authResult.user?.role !== 'admin') {
    return {
      error: NextResponse.json(
        { error: '需要管理员权限' },
        { status: 403 }
      ),
      user: null,
    }
  }

  return authResult
}

