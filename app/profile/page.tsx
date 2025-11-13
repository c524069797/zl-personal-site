'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ThemeToggle'

interface User {
  id: string
  email: string
  name: string | null
  role: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<any[]>([])
  const [postsLoading, setPostsLoading] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('token')

    if (!token) {
      router.push('/login')
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

      const data = await response.json()
      setUser(data.user)
    } catch (error) {
      console.error('获取用户信息失败:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchMyPosts = async () => {
    const token = localStorage.getItem('token')
    if (!token || !user) return

    setPostsLoading(true)
    try {
      const response = await fetch('/api/admin/posts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        // 只显示当前用户的文章
        const myPosts = data.posts.filter((post: any) =>
          post.author.id === user.id || user.role === 'admin'
        )
        setPosts(myPosts)
      }
    } catch (error) {
      console.error('获取文章列表失败:', error)
    } finally {
      setPostsLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchMyPosts()
    }
  }, [user])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    // 触发自定义事件，通知导航栏更新
    window.dispatchEvent(new Event('auth-change'))
    router.push('/')
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('确定要删除这篇文章吗？')) {
      return
    }

    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        // 刷新文章列表
        fetchMyPosts()
      } else {
        alert('删除失败')
      }
    } catch (error) {
      console.error('删除文章失败:', error)
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
    <div className="min-h-screen">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="mb-8">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-300"
          >
            ← 返回首页
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            个人中心
          </h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                邮箱
              </label>
              <p className="text-gray-900 dark:text-white">{user.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                姓名
              </label>
              <p className="text-gray-900 dark:text-white">
                {user.name || '未设置'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                角色
              </label>
              <p className="text-gray-900 dark:text-white">
                {user.role === 'admin' ? '管理员' : '作者'}
              </p>
            </div>

            <div className="pt-4 flex gap-4">
              <Link
                href="/admin/posts/new"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                写文章
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            我的文章
          </h2>

          {postsLoading ? (
            <div className="text-center py-8 text-gray-600 dark:text-white">
              加载中...
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8 text-gray-600 dark:text-white">
              还没有文章，<Link href="/admin/posts/new" className="text-blue-600 dark:text-blue-400">立即创建</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {new Date(post.date).toLocaleDateString('zh-CN')}
                        {post.published ? (
                          <span className="ml-2 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs">
                            已发布
                          </span>
                        ) : (
                          <span className="ml-2 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-xs">
                            草稿
                          </span>
                        )}
                      </p>
                      {post.summary && (
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          {post.summary}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Link
                        href={`/admin/posts/edit/${post.id}`}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm hover:bg-blue-200 dark:hover:bg-blue-800"
                      >
                        编辑
                      </Link>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded text-sm hover:bg-red-200 dark:hover:bg-red-800"
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

