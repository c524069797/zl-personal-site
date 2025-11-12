'use client'

import { useState, useEffect } from 'react'
import { Tabs, List, Card, Tag, Space, Typography, Empty } from 'antd'
import { CalendarOutlined, MessageOutlined, FireOutlined, ClockCircleOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

const { Title, Paragraph } = Typography

interface Post {
  id: string
  slug: string
  title: string
  date: string
  summary: string
  tags: Array<{ name: string; slug: string }>
  commentCount: number
}

export default function PostTabs() {
  const [latestPosts, setLatestPosts] = useState<Post[]>([])
  const [hotPosts, setHotPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const [latestRes, hotRes] = await Promise.all([
        fetch('/api/posts/latest?limit=10'),
        fetch('/api/posts/hot?limit=10'),
      ])

      if (latestRes.ok) {
        const latestData = await latestRes.json()
        setLatestPosts(latestData.posts || [])
      }

      if (hotRes.ok) {
        const hotData = await hotRes.json()
        setHotPosts(hotData.posts || [])
      }
    } catch (error) {
      console.error('获取文章失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabItems = [
    {
      key: 'latest',
      label: (
        <span>
          <ClockCircleOutlined /> 最新文章
        </span>
      ),
      children: (
        <List
          loading={loading}
          dataSource={latestPosts}
          locale={{ emptyText: <Empty description="暂无文章" /> }}
          renderItem={(post) => (
            <List.Item style={{ padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: '100%' }}>
                <Link href={`/blog/${post.slug}`}>
                  <Title
                    level={4}
                    style={{
                      marginBottom: '8px',
                      color: 'var(--foreground)',
                      fontSize: '16px',
                    }}
                  >
                    {post.title}
                  </Title>
                </Link>
                <Space style={{ marginBottom: '8px' }} size="middle">
                  <Space size="small">
                    <CalendarOutlined style={{ color: 'var(--foreground)', opacity: 0.6 }} />
                    <span style={{ color: 'var(--foreground)', opacity: 0.6, fontSize: '12px' }}>
                      {formatDate(post.date)}
                    </span>
                  </Space>
                  <Space size="small">
                    <MessageOutlined style={{ color: 'var(--foreground)', opacity: 0.6 }} />
                    <span style={{ color: 'var(--foreground)', opacity: 0.6, fontSize: '12px' }}>
                      {post.commentCount} 条评论
                    </span>
                  </Space>
                </Space>
                {post.summary && (
                  <Paragraph
                    ellipsis={{ rows: 2, expandable: false }}
                    style={{
                      color: 'var(--foreground)',
                      opacity: 0.8,
                      marginBottom: '8px',
                      fontSize: '14px',
                    }}
                  >
                    {post.summary}
                  </Paragraph>
                )}
                {post.tags && post.tags.length > 0 && (
                  <Space wrap size="small">
                    {post.tags.map((tag) => (
                      <Tag
                        key={tag.slug}
                        style={{
                          background: 'var(--background)',
                          border: '1px solid var(--border)',
                          color: 'var(--foreground)',
                          fontSize: '12px',
                        }}
                      >
                        {tag.name}
                      </Tag>
                    ))}
                  </Space>
                )}
              </div>
            </List.Item>
          )}
        />
      ),
    },
    {
      key: 'hot',
      label: (
        <span>
          <FireOutlined /> 最热文章
        </span>
      ),
      children: (
        <List
          loading={loading}
          dataSource={hotPosts}
          locale={{ emptyText: <Empty description="暂无文章" /> }}
          renderItem={(post) => (
            <List.Item style={{ padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: '100%' }}>
                <Link href={`/blog/${post.slug}`}>
                  <Title
                    level={4}
                    style={{
                      marginBottom: '8px',
                      color: 'var(--foreground)',
                      fontSize: '16px',
                    }}
                  >
                    {post.title}
                  </Title>
                </Link>
                <Space style={{ marginBottom: '8px' }} size="middle">
                  <Space size="small">
                    <CalendarOutlined style={{ color: 'var(--foreground)', opacity: 0.6 }} />
                    <span style={{ color: 'var(--foreground)', opacity: 0.6, fontSize: '12px' }}>
                      {formatDate(post.date)}
                    </span>
                  </Space>
                  <Space size="small">
                    <MessageOutlined style={{ color: 'var(--foreground)', opacity: 0.6 }} />
                    <span style={{ color: 'var(--foreground)', opacity: 0.6, fontSize: '12px' }}>
                      {post.commentCount} 条评论
                    </span>
                  </Space>
                </Space>
                {post.summary && (
                  <Paragraph
                    ellipsis={{ rows: 2, expandable: false }}
                    style={{
                      color: 'var(--foreground)',
                      opacity: 0.8,
                      marginBottom: '8px',
                      fontSize: '14px',
                    }}
                  >
                    {post.summary}
                  </Paragraph>
                )}
                {post.tags && post.tags.length > 0 && (
                  <Space wrap size="small">
                    {post.tags.map((tag) => (
                      <Tag
                        key={tag.slug}
                        style={{
                          background: 'var(--background)',
                          border: '1px solid var(--border)',
                          color: 'var(--foreground)',
                          fontSize: '12px',
                        }}
                      >
                        {tag.name}
                      </Tag>
                    ))}
                  </Space>
                )}
              </div>
            </List.Item>
          )}
        />
      ),
    },
  ]

  return (
    <div style={{ marginTop: '60px', width: '100%' }}>
      <Tabs
        defaultActiveKey="latest"
        items={tabItems}
        size="large"
        style={{
          color: 'var(--foreground)',
        }}
      />
    </div>
  )
}

