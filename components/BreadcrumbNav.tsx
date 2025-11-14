'use client'

import Link from 'next/link'
import { Breadcrumb } from 'antd'
import { HomeOutlined, BookOutlined } from '@ant-design/icons'

interface BreadcrumbNavProps {
  items?: Array<{
    title: string
    href?: string
  }>
}

export default function BreadcrumbNav({ items = [] }: BreadcrumbNavProps) {
  const breadcrumbItems = [
    {
      title: (
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <HomeOutlined />
          <span>首页</span>
        </Link>
      ),
    },
    {
      title: (
        <Link href="/blog" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <BookOutlined />
          <span>博客</span>
        </Link>
      ),
    },
    ...items.map((item) => ({
      title: item.href ? (
        <Link href={item.href}>{item.title}</Link>
      ) : (
        <span>{item.title}</span>
      ),
    })),
  ]

  return (
    <Breadcrumb
      items={breadcrumbItems}
      style={{
        marginBottom: '24px',
        padding: '12px 0',
      }}
    />
  )
}

