'use client'

import Link from 'next/link'
import { Layout, Menu } from 'antd'
import { BookOutlined, FileTextOutlined } from '@ant-design/icons'
import { ThemeToggle } from './ThemeToggle'

const { Header } = Layout

export default function Navigation() {
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
        <ThemeToggle />
      </div>
    </Header>
  )
}

