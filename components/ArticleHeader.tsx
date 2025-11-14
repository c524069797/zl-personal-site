'use client'

import Link from 'next/link'
import { Avatar, Space, Typography, Tag } from 'antd'
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import { formatDate } from '@/lib/utils'

const { Title } = Typography

interface Author {
  id: string
  name: string | null
  email?: string
}

interface ArticleHeaderProps {
  title: string
  date: string
  tags?: Array<{ name: string; slug: string }>
  author?: Author
  readingTime: number
}

export default function ArticleHeader({
  title,
  date,
  tags,
  author,
  readingTime,
}: ArticleHeaderProps) {
  return (
    <div style={{ marginBottom: '32px' }}>
      {tags && tags.length > 0 && (
        <div style={{ marginBottom: '8px' }}>
          <Tag color="blue" style={{ marginBottom: '8px' }}>
            {tags[0].name}
          </Tag>
        </div>
      )}

      <Title level={1} style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        marginBottom: '16px',
        lineHeight: '1.3',
        color: 'var(--foreground)',
      }}>
        {title}
      </Title>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        color: 'var(--text-secondary)',
        fontSize: '14px',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        {author && (
          <>
            <Avatar
              size={40}
              style={{
                marginRight: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              {author.name?.charAt(0) || 'U'}
            </Avatar>
            <span style={{ fontWeight: 500, marginRight: '24px' }}>
              {author.name || '未知作者'}
            </span>
          </>
        )}

        <Space>
          <CalendarOutlined />
          <span>{formatDate(date)}</span>
        </Space>

        <Space>
          <ClockCircleOutlined />
          <span>{readingTime}分钟阅读</span>
        </Space>

        <Space>
          <EyeOutlined />
          <span>2456</span>
        </Space>
      </div>

      {tags && tags.length > 0 && (
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}>
          {tags.map((tag) => (
            <Link
              key={tag.slug}
              href={`/blog?tag=${tag.slug}`}
              style={{
                background: 'var(--background-light)',
                color: 'var(--text-secondary)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '14px',
                textDecoration: 'none',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#1890ff'
                e.currentTarget.style.color = '#fff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--background-light)'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
            >
              {tag.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

