'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ThemeToggle'

interface User {
  id: string
  email: string
  name: string | null
  role: string
}

interface ProfilePost {
  id: string
  slug: string
  title: string
  date: string
  published: boolean
  summary: string | null
  author: {
    id: string
  }
}

interface MeResponse {
  user: User
}

interface AdminPostsResponse {
  posts: ProfilePost[]
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<ProfilePost[]>([])
  const [postsLoading, setPostsLoading] = useState(false)

  const fetchMyPosts = useCallback(async (currentUser: User) => {
    const token = localStorage.getItem('token')

    if (!token) {
      return
    }

    setPostsLoading(true)
    try {
      const response = await fetch('/api/admin/posts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json() as AdminPostsResponse
        const myPosts = data.posts.filter(post => post.author.id === currentUser.id || currentUser.role === 'admin')

        setPosts(myPosts)
      }
    } catch {
      // 错误已静默处理
    } finally {
      setPostsLoading(false)
    }
  }, [])

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token')

    if (!token) {
      router.push('/login')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/login')
        return
      }

      const data = await response.json() as MeResponse

      setUser(data.user)
      void fetchMyPosts(data.user)
    } catch {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }, [fetchMyPosts, router])

  useEffect(() => {
    void checkAuth()
  }, [checkAuth])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.dispatchEvent(new Event('auth-change'))
    router.push('/')
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('确定要删除这篇文章吗？')) {
      return
    }

    const token = localStorage.getItem('token')

    if (!token || !user) {
      return
    }

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        void fetchMyPosts(user)
      } else {
        alert('删除失败')
      }
    } catch {
      alert('删除失败')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-white">加载中...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,transparent_280px)] dark:bg-none">
      <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-white dark:hover:text-gray-300"
          >
            ← 返回首页
          </Link>
          <ThemeToggle />
        </div>

        <div className="mb-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-100 bg-[linear-gradient(135deg,#2563eb_0%,#3b82f6_45%,#60a5fa_100%)] px-6 py-8 text-white md:px-8">
            <p className="mb-2 text-sm font-medium text-blue-100">Account Center</p>
            <h1 className="text-3xl font-bold md:text-4xl">个人中心</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-50/90 md:text-base">
              管理你的账号信息、文章内容与发布状态，让写作与维护更加高效。
            </p>
          </div>

          <div className="grid gap-5 px-6 py-8 md:grid-cols-3 md:px-8">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900/40">
              <div className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">邮箱</div>
              <div className="break-all text-base font-semibold text-gray-900 dark:text-white">{user.email}</div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900/40">
              <div className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">姓名</div>
              <div className="text-base font-semibold text-gray-900 dark:text-white">{user.name || '未设置'}</div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900/40">
              <div className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">角色</div>
              <div className="text-base font-semibold text-gray-900 dark:text-white">{user.role === 'admin' ? '管理员' : '作者'}</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 px-6 pb-8 md:px-8">
            <Link
              href="/admin/posts/new"
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              写文章
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-xl bg-gray-100 px-5 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              退出登录
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-gray-700 dark:bg-gray-800 md:p-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">我的文章</h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">共 {posts.length} 篇，可继续编辑、发布或删除。</p>
            </div>
          </div>

          {postsLoading ? (
            <div className="py-12 text-center text-gray-600 dark:text-white">加载中...</div>
          ) : !posts.length ? (
            <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-center text-gray-600 dark:border-gray-600 dark:text-white">
              还没有文章，
              <Link href="/admin/posts/new" className="text-blue-600 dark:text-blue-400">立即创建</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map(post => (
                <div
                  key={post.id}
                  className="rounded-2xl border border-gray-200 p-5 transition-shadow hover:shadow-md dark:border-gray-700"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          {post.title}
                        </Link>
                      </h3>
                      <p className="mb-3 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>{new Date(post.date).toLocaleDateString('zh-CN')}</span>
                        {post.published ? (
                          <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                            已发布
                          </span>
                        ) : (
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                            草稿
                          </span>
                        )}
                      </p>
                      {post.summary ? (
                        <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">{post.summary}</p>
                      ) : null}
                    </div>
                    <div className="flex gap-2 md:ml-4">
                      <Link
                        href={`/admin/posts/edit/${post.id}`}
                        className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-800 transition-colors hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
                      >
                        编辑
                      </Link>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-800 transition-colors hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

