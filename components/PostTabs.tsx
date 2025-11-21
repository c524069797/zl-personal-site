'use client'

import { useState, useEffect } from 'react'
import { Tabs, List, Card, Tag, Space, Typography, Empty } from 'antd'
import { CalendarOutlined, MessageOutlined, FireOutlined, ClockCircleOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import PostCoverImage from '@/components/PostCoverImage'

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
      // 错误已静默处理
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
                <Link
                  href={`/blog/${post.slug}`}
                  style={{
                    display: 'block',
                    transition: 'all 0.2s',
                  }}
                  onClick={(e) => {
                    const target = e.currentTarget
                    target.style.opacity = '0.7'
                    target.style.transform = 'scale(0.98)'
                    setTimeout(() => {
                      target.style.opacity = '1'
                      target.style.transform = 'scale(1)'
                    }, 200)
                  }}
                >
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
              <div style={{ width: '100%', display: 'flex', gap: '16px' }}>
                <div style={{
                  width: '120px',
                  height: '80px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}>
                  <PostCoverImage
                    title={post.title}
                    summary={post.summary}
                    height={80}
                    gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <Link
                    href={`/blog/${post.slug}`}
                    style={{
                      display: 'block',
                      transition: 'all 0.2s',
                    }}
                    onClick={(e) => {
                      const target = e.currentTarget
                      target.style.opacity = '0.7'
                      target.style.transform = 'scale(0.98)'
                      setTimeout(() => {
                        target.style.opacity = '1'
                        target.style.transform = 'scale(1)'
                      }, 200)
                    }}
                  >
                    <Title
                      level={4}
                      style={{
                        marginBottom: '8px',
                        color: 'var(--foreground)',
                        fontSize: '16px',
                        cursor: 'pointer',
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
                        <Link key={tag.slug} href={`/blog?tag=${tag.slug}`}>
                          <Tag
                            style={{
                              background: 'var(--background)',
                              border: '1px solid var(--border)',
                              color: 'var(--foreground)',
                              fontSize: '12px',
                              cursor: 'pointer',
                            }}
                          >
                            {tag.name}
                          </Tag>
                        </Link>
                      ))}
                    </Space>
                  )}
                </div>
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

