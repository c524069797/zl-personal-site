/**
 * 客户端认证工具函数
 */

export interface User {
  id: string
  email: string
  name: string | null
  role: string
}

// 获取存储的 token
export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

// 获取存储的用户信息
export function getUser(): User | null {
  if (typeof window === 'undefined') return null
  const userStr = localStorage.getItem('user')
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

// 检查是否是管理员
export function isAdmin(): boolean {
  const user = getUser()
  return user?.role === 'admin'
}

// 检查是否已登录
export function isAuthenticated(): boolean {
  return !!getToken()
}

// 获取认证请求头
export function getAuthHeaders(): HeadersInit {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

// 获取当前用户信息（从 API）
export async function fetchCurrentUser(): Promise<User | null> {
  try {
    const token = getToken()
    if (!token) return null

    const response = await fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      // Token 无效，清除本地存储
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return null
    }

    const data = await response.json()
    return data.user
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return null
  }
}

