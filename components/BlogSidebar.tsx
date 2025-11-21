'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, Avatar, Space, Typography, Empty } from 'antd'
import {
  GithubOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  MailOutlined,
} from '@ant-design/icons'
import { formatDate } from '@/lib/utils'
import PostCoverImage from '@/components/PostCoverImage'
import { useTranslation } from '@/hooks/useTranslation'

const { Title, Text } = Typography

interface Post {
  id: string
  slug: string
  title: string
  date: string
  commentCount: number
  summary?: string
}

interface Tag {
  id: string
  name: string
  slug: string
  count: number
}

interface Author {
  id: string
  name: string | null
  email?: string
}

interface BlogSidebarProps {
  author?: Author
  excludeSlug?: string
}

export default function BlogSidebar({ author, excludeSlug }: BlogSidebarProps) {
  const { t } = useTranslation()
  const [popularPosts, setPopularPosts] = useState<Post[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSidebarData()
  }, [excludeSlug])

  const fetchSidebarData = async () => {
    setLoading(true)
    try {
      const [hotRes, tagsRes] = await Promise.all([
        fetch('/api/posts/hot?limit=3'),
        fetch('/api/tags'),
      ])

      if (hotRes.ok) {
        const hotData = await hotRes.json()
        // 排除当前文章
        const filteredPosts = (hotData.posts || []).filter(
          (post: Post) => post.slug !== excludeSlug
        )
        setPopularPosts(filteredPosts.slice(0, 3))
      }

      if (tagsRes.ok) {
        const tagsData = await tagsRes.json()
        // 只显示有文章数的标签，并按数量排序
        const sortedTags = (tagsData.tags || [])
          .filter((tag: Tag) => tag.count > 0)
          .sort((a: Tag, b: Tag) => b.count - a.count)
          .slice(0, 9)
        setTags(sortedTags)
      }
    } catch (error) {
      // 错误已静默处理
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ width: '100%' }}>
      {/* 作者信息卡片 */}
      {author && (
        <Card
          style={{
            marginBottom: '24px',
            borderRadius: '8px',
            textAlign: 'center',
          }}
          styles={{ body: { padding: '24px' } }}
        >
          <Avatar
            size={80}
            style={{
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontSize: '32px',
            }}
          >
            {author.name?.charAt(0) || 'U'}
          </Avatar>
          <Title level={4} style={{ marginBottom: '8px' }}>
            {author.name || '未知用户'}
          </Title>
          <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
            前端开发工程师 | React专家 | 技术博主
          </Text>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              marginBottom: '24px',
              padding: '16px 0',
              borderTop: '1px solid var(--border)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>
                128
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{t('blog.posts')}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>
                24K
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{t('blog.followers')}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>
                3.6K
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{t('blog.favorites')}</div>
            </div>
          </div>

          <Space size="large" style={{ justifyContent: 'center' }}>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-secondary)', fontSize: '20px' }}
            >
              <GithubOutlined />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-secondary)', fontSize: '20px' }}
            >
              <TwitterOutlined />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-secondary)', fontSize: '20px' }}
            >
              <LinkedinOutlined />
            </a>
            <a
              href={`mailto:${author.email || ''}`}
              style={{ color: 'var(--text-secondary)', fontSize: '20px' }}
            >
              <MailOutlined />
            </a>
          </Space>
        </Card>
      )}

      {/* 推荐文章 */}
      <Card
        title={<Title level={4} style={{ margin: 0 }}>{t('blog.recommendedPosts')}</Title>}
        style={{ marginBottom: '24px', borderRadius: '8px' }}
        loading={loading}
      >
        {popularPosts.length > 0 ? (
          <div>
            {popularPosts.map((post) => (
              <div
                key={post.id}
                style={{
                  display: 'flex',
                  padding: '16px 0',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <div
                  style={{
                    width: '80px',
                    height: '60px',
                    borderRadius: '4px',
                    marginRight: '12px',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  <PostCoverImage
                    title={post.title}
                    summary={post.summary || ''}
                    height={60}
                    gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link href={`/blog/${post.slug}`}>
                    <Text
                      strong
                      style={{
                        display: 'block',
                        marginBottom: '4px',
                        color: 'var(--foreground)',
                        cursor: 'pointer',
                        wordBreak: 'break-word',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        lineHeight: '1.5',
                      }}
                      ellipsis={{ 
                        tooltip: post.title,
                        rows: 2 
                      }}
                    >
                      {post.title}
                    </Text>
                  </Link>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {formatDate(post.date)} · {post.commentCount} 条评论
                  </Text>
                </div>
              </div>
            ))}
          </div>
        ) : (
                  <Empty description={t('blog.noRecommendedPosts')} />
        )}
      </Card>

      {/* 热门标签 */}
      <Card
        title={<Title level={4} style={{ margin: 0 }}>{t('blog.hotTags')}</Title>}
        style={{ borderRadius: '8px' }}
        loading={loading}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          {tags.length > 0 ? (
            tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/blog?tag=${tag.slug}`}
                style={{
                  background: 'var(--background-light)',
                  color: 'var(--text-secondary)',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  textDecoration: 'none',
                  transition: 'all 0.3s',
                  display: 'inline-block',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--primary-color)'
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--background-light)'
                  e.currentTarget.style.color = 'var(--text-secondary)'
                }}
              >
                {tag.name}
              </Link>
            ))
          ) : (
            <Empty description={t('blog.noTags')} />
          )}
        </div>
      </Card>
    </div>
  )
}

