'use client'

import { Layout, Space } from 'antd'
import { BookOutlined, FileTextOutlined, SettingOutlined } from '@ant-design/icons'
import { ThemeToggle } from './ThemeToggle'
import BreadcrumbNav from './BreadcrumbNav'
import { LinkTransition } from '@/lib/link-transition'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useTranslation } from '@/hooks/useTranslation'

const { Header } = Layout

interface NavigationProps {
  breadcrumbItems?: Array<{
    title: string
    href?: string
  }>
}

export default function Navigation({ breadcrumbItems }: NavigationProps) {
  const { t } = useTranslation()

  return (
    <Header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'var(--background)',
      borderBottom: '1px solid var(--border)',
      padding: '0 24px',
      flexWrap: 'wrap',
      gap: '12px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        flex: 1,
        minWidth: 0,
      }}>
        <LinkTransition
          href="/"
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
          <div style={{ flex: 1, minWidth: 0 }}>
            <BreadcrumbNav items={breadcrumbItems} />
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Space size="large">
          <LinkTransition href="/blog" style={{
            color: 'var(--foreground)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <BookOutlined />
            <span>{t('nav.blog')}</span>
          </LinkTransition>
          <LinkTransition href="/resume" style={{
            color: 'var(--foreground)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <FileTextOutlined />
            <span>{t('nav.resume')}</span>
          </LinkTransition>
          <LinkTransition href="/admin" style={{
            color: 'var(--foreground)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <SettingOutlined />
            <span>{t('nav.admin')}</span>
          </LinkTransition>
        </Space>
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </Header>
  )
}

