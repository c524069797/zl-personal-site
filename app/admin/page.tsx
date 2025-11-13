'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Layout, Tabs, message, Button } from 'antd'
import { CommentOutlined, FileTextOutlined, LogoutOutlined } from '@ant-design/icons'
import Navigation from '@/components/Navigation'
import CommentManagement from '@/components/admin/CommentManagement'
import PostManagement from '@/components/admin/PostManagement'
import { isAdmin, isAuthenticated, fetchCurrentUser } from '@/lib/client-auth'

const { Content } = Layout
const { TabPane } = Tabs

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    // 触发自定义事件，通知导航栏更新
    window.dispatchEvent(new Event('auth-change'))
    message.success('已退出登录')
    router.push('/')
  }

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        message.warning('请先登录')
        router.push('/login')
        return
      }

      const user = await fetchCurrentUser()
      if (!user) {
        message.error('登录已过期，请重新登录')
        router.push('/login')
        return
      }

      if (!isAdmin()) {
        message.error('需要管理员权限')
        router.push('/')
        return
      }

      setIsAuthorized(true)
      setLoading(false)
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <>
        <Navigation />
        <Layout className="min-h-screen">
          <Content style={{ padding: '50px 24px', textAlign: 'center' }}>
            <div>加载中...</div>
          </Content>
        </Layout>
      </>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return (
    <>
      <Navigation />
      <Layout className="min-h-screen">
        <Content style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', width: '100%', background: 'var(--background)' }}>
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              退出登录
            </Button>
          </div>
          <Tabs defaultActiveKey="comments" size="large">
            <TabPane
              tab={
                <span>
                  <CommentOutlined />
                  评论管理
                </span>
              }
              key="comments"
            >
              <CommentManagement />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <FileTextOutlined />
                  文章管理
                </span>
              }
              key="posts"
            >
              <PostManagement />
            </TabPane>
          </Tabs>
        </Content>
      </Layout>
    </>
  )
}

