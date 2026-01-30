'use client'

import { Layout, Space, Button, Drawer } from 'antd'
import { BookOutlined, FileTextOutlined, SettingOutlined, RobotOutlined, MenuOutlined } from '@ant-design/icons'
import { ThemeToggle } from './ThemeToggle'
import BreadcrumbNav from './BreadcrumbNav'
import { LinkTransition } from '@/lib/link-transition'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useTranslation } from '@/hooks/useTranslation'
import { useState } from 'react'

const { Header } = Layout

interface NavigationProps {
  breadcrumbItems?: Array<{
    title: string
    href?: string
  }>
}
export default function Navigation({ breadcrumbItems }: NavigationProps) {
  const { t } = useTranslation()
  const [drawerVisible, setDrawerVisible] = useState(false)

  // Navigation items to avoid duplication
  const navItems = [
    { href: '/blog', icon: <BookOutlined />, label: t('nav.blog') },
    { href: '/ai-chat', icon: <RobotOutlined />, label: t('nav.aiChat') },
    { href: '/resume', icon: <FileTextOutlined />, label: t('nav.resume') },
    { href: '/admin', icon: <SettingOutlined />, label: t('nav.admin') },
  ]

  return (
    <Header 
      className="nav-header"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--background)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px',
        height: '64px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1, minWidth: 0 }}>
        <LinkTransition
          href="/"
          className="nav-logo"
          style={{
            color: 'var(--foreground)',
            fontSize: '20px',
            fontWeight: 'bold',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {t('site.name')}
        </LinkTransition>
        {breadcrumbItems && breadcrumbItems.length > 0 && (
          <div className="nav-breadcrumb hidden md:block" style={{ flex: 1, minWidth: 0 }}>
            <BreadcrumbNav items={breadcrumbItems} />
          </div>
        )}
      </div>

      {/* Desktop Menu */}
      <div className="nav-links hidden md:flex" style={{ alignItems: 'center', gap: '16px' }}>
        <Space size="middle" className="nav-menu">
          {navItems.map(item => (
            <LinkTransition key={item.href} href={item.href} className="nav-link" style={{
              color: 'var(--foreground)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              {item.icon}
              <span className="nav-link-text">{item.label}</span>
            </LinkTransition>
          ))}
        </Space>
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center gap-4">
        <ThemeToggle />
        <Button 
          type="text" 
          icon={<MenuOutlined style={{ fontSize: '20px' }} />} 
          onClick={() => setDrawerVisible(true)}
        />
      </div>

      {/* Mobile Drawer */}
      <Drawer
        title={t('site.name')}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={280}
        styles={{ body: { padding: 0 } }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {navItems.map(item => (
            <LinkTransition 
              key={item.href} 
              href={item.href} 
              className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 text-lg"
              onClick={() => setDrawerVisible(false)}
              style={{ color: 'var(--foreground)' }}
            >
              {item.icon}
              <span>{item.label}</span>
            </LinkTransition>
          ))}
          <div className="px-6 py-4">
            <LanguageSwitcher />
          </div>
        </div>
      </Drawer>
    </Header>
  )
}

