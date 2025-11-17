'use client'

import { Breadcrumb } from 'antd'
import { HomeOutlined, BookOutlined } from '@ant-design/icons'
import { LinkTransition } from '@/lib/link-transition'
import { useTranslation } from '@/hooks/useTranslation'

interface BreadcrumbNavProps {
  items?: Array<{
    title: string
    href?: string
  }>
}

export default function BreadcrumbNav({ items = [] }: BreadcrumbNavProps) {
  const { t } = useTranslation()

  const breadcrumbItems = [
    {
      title: (
        <LinkTransition href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: 'var(--foreground)',
        }}>
          <HomeOutlined />
          <span>{t('nav.home')}</span>
        </LinkTransition>
      ),
    },
    {
      title: (
        <LinkTransition href="/blog" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: 'var(--foreground)',
        }}>
          <BookOutlined />
          <span>{t('nav.blog')}</span>
        </LinkTransition>
      ),
    },
    ...items.map((item) => ({
      title: item.href ? (
        <LinkTransition href={item.href} style={{ color: 'var(--foreground)' }}>
          {item.title}
        </LinkTransition>
      ) : (
        <span style={{ color: 'var(--foreground)' }}>{item.title}</span>
      ),
    })),
  ]

  return (
    <Breadcrumb
      items={breadcrumbItems}
      style={{
        color: 'var(--foreground)',
        margin: 0,
      }}
    />
  )
}

