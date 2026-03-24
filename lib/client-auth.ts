/**
 * 客户端认证工具函数
 */

export interface User {
  id: string
  email: string
  name: string | null
  role: string
}

export function getToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  return localStorage.getItem('token')
}

export function getUser(): User | null {
  if (typeof window === 'undefined') {
    return null
  }
  const userStr = localStorage.getItem('user')

  if (!userStr) {
    return null
  }
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function isAdmin(): boolean {
  return getUser()?.role === 'admin'
}

export function isAuthenticated(): boolean {
  return !!getToken()
}

export function getAuthHeaders(): HeadersInit {
  const token = getToken()

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function fetchCurrentUser(): Promise<User | null> {
  try {
    const token = getToken()

    if (!token) {
      return null
    }

    const response = await fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return null
    }

    const data = await response.json() as { user: User }

    return data.user
  } catch {
    return null
  }
}
