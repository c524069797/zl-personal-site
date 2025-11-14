'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Layout, Button, Space } from 'antd'
import { BookOutlined, FileTextOutlined, SettingOutlined, LoginOutlined } from '@ant-design/icons'
import { ThemeToggle } from './ThemeToggle'
import AdminLogin from './AdminLogin'
import { isAdmin, isAuthenticated, getUser } from '@/lib/client-auth'

const { Header } = Layout

export default function Navigation() {
  const [showAdmin, setShowAdmin] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  useEffect(() => {
    const checkAdmin = () => {
      const localUser = getUser()
      if (localUser && localUser.role === 'admin') {
        setShowAdmin(true)
        return
      }
      setShowAdmin(false)
    }

    checkAdmin()

    const handleAuthChange = () => {
      checkAdmin()
    }
    window.addEventListener('auth-change', handleAuthChange)

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' || e.key === 'token') {
        checkAdmin()
      }
    }
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('auth-change', handleAuthChange)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return (
    <Header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'var(--background)',
      borderBottom: '1px solid var(--border)',
      padding: '0 24px',
    }}>
      <Link href="/" style={{ color: 'var(--foreground)', fontSize: '20px', fontWeight: 'bold', textDecoration: 'none' }}>
        陈灼的网络日志
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Space size="large">
          <Link href="/blog" style={{
            color: 'var(--foreground)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <BookOutlined />
            <span>博客</span>
          </Link>
          <Link href="/resume" style={{
            color: 'var(--foreground)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <FileTextOutlined />
            <span>简历</span>
          </Link>
          {showAdmin && (
            <Link href="/admin" style={{
              color: 'var(--foreground)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <SettingOutlined />
              <span>管理</span>
            </Link>
          )}
        </Space>
        {!showAdmin && (
          <Button
            type="primary"
            icon={<LoginOutlined />}
            onClick={() => setLoginModalOpen(true)}
          >
            登录
          </Button>
        )}
        <ThemeToggle />
      </div>
      <AdminLogin open={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </Header>
  )
}

