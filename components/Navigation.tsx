'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Layout, Menu, Button } from 'antd'
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
      // 先检查本地存储的用户信息
      const localUser = getUser()
      if (localUser && localUser.role === 'admin') {
        setShowAdmin(true)
        return
      }
      setShowAdmin(false)
    }

    // 立即检查一次
    checkAdmin()

    // 监听自定义事件（登录/登出时触发）
    const handleAuthChange = () => {
      checkAdmin()
    }
    window.addEventListener('auth-change', handleAuthChange)

    // 监听 localStorage 变化（跨标签页）
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

  const menuItems = [
    {
      key: 'blog',
      icon: <BookOutlined />,
      label: <Link href="/blog">博客</Link>,
    },
    {
      key: 'resume',
      icon: <FileTextOutlined />,
      label: <Link href="/resume">简历</Link>,
    },
    ...(showAdmin
      ? [
          {
            key: 'admin',
            icon: <SettingOutlined />,
            label: <Link href="/admin">管理</Link>,
          },
        ]
      : []),
  ]

  return (
    <Header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'var(--background)',
      borderBottom: '1px solid var(--border)',
    }}>
      <Link href="/" style={{ color: 'var(--foreground)', fontSize: '20px', fontWeight: 'bold' }}>
        陈灼的网络日志
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Menu
          mode="horizontal"
          items={menuItems}
          style={{
            flex: 1,
            minWidth: 0,
            background: 'transparent',
            border: 'none',
          }}
        />
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

