'use client'

import { Layout, Space, Button, Drawer } from 'antd'
import { BookOutlined, FileTextOutlined, SettingOutlined, RobotOutlined, MenuOutlined } from '@ant-design/icons'
import { ThemeToggle } from './ThemeToggle'
import BreadcrumbNav from './BreadcrumbNav'
import { LinkTransition } from '@/lib/link-transition'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useTranslation } from '@/hooks/useTranslation'
import { useState } from 'react'
import type { BreadcrumbItem } from '@/types'

const { Header } = Layout

interface NavigationProps {
  breadcrumbItems?: BreadcrumbItem[]
}

const Navigation = ({ breadcrumbItems }: NavigationProps) => {
  const { t } = useTranslation()
  const [drawerVisible, setDrawerVisible] = useState(false)

  const navItems = [
    { href: '/blog', icon: <BookOutlined />, label: t('nav.blog') },
    { href: '/ai-chat', icon: <RobotOutlined />, label: t('nav.aiChat') },
    { href: '/resume', icon: <FileTextOutlined />, label: t('nav.resume') },
    { href: '/admin', icon: <SettingOutlined />, label: t('nav.admin') },
  ]

  return (
    <Header className="nav-header flex items-center justify-between !px-6 !h-16 sticky top-0 z-[1000]">
      <div className="flex items-center gap-6 flex-1 min-w-0">
        <LinkTransition
          href="/"
          className="nav-logo text-xl font-bold no-underline whitespace-nowrap"
        >
          {t('site.name')}
        </LinkTransition>
        {breadcrumbItems?.length ? (
          <div className="nav-breadcrumb hidden md:block flex-1 min-w-0">
            <BreadcrumbNav items={breadcrumbItems} />
          </div>
        ) : null}
      </div>

      {/* Desktop Menu */}
      <div className="nav-links hidden md:flex items-center gap-4 shrink-0">
        <Space size="middle" className="nav-menu">
          {navItems.map(item => (
            <LinkTransition
              key={item.href}
              href={item.href}
              className="nav-link group no-underline flex items-center gap-1.5"
            >
              <span className="transition-transform duration-200 group-hover:scale-110">{item.icon}</span>
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
          icon={<MenuOutlined className="text-xl" />}
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
        <div className="flex flex-col">
          {navItems.map(item => (
            <LinkTransition
              key={item.href}
              href={item.href}
              className="nav-link px-6 py-4 flex items-center gap-3 text-lg"
              onClick={() => setDrawerVisible(false)}
              style={{ borderBottom: '1px solid var(--border)' }}
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

export default Navigation
