'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Layout, Tabs, message } from 'antd'
import { CommentOutlined, FileTextOutlined } from '@ant-design/icons'
import Navigation from '@/components/Navigation'
import CommentManagement from '@/components/admin/CommentManagement'
import PostManagement from '@/components/admin/PostManagement'
import { isAdmin, isAuthenticated, fetchCurrentUser } from '@/lib/client-auth'
import { useTranslation } from '@/hooks/useTranslation'

const { Content } = Layout
const { TabPane } = Tabs

export default function AdminPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        message.warning(t('admin.messages.loginRequired'))
        router.push('/login')
        return
      }

      const user = await fetchCurrentUser()
      if (!user) {
        message.error(t('admin.messages.loginExpired'))
        router.push('/login')
        return
      }

      if (!isAdmin()) {
        message.error(t('admin.messages.adminRequired'))
        router.push('/')
        return
      }

      setIsAuthorized(true)
      setLoading(false)
    }

    checkAuth()
  }, [router, t])

  if (loading) {
    return (
      <>
        <Navigation />
        <Layout className="min-h-screen">
          <Content style={{ padding: '50px 24px', textAlign: 'center' }}>
            <div>{t('admin.messages.loading')}</div>
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
          <Tabs defaultActiveKey="comments" size="large">
            <TabPane
              tab={
                <span>
                  <CommentOutlined />
                  {t('admin.commentManagement')}
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
                  {t('admin.postManagement')}
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

