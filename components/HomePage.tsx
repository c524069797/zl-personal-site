'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, Tag, Space, Typography, Button, Empty, Row, Col } from 'antd'
import {
  CalendarOutlined,
  MessageOutlined,
  FileTextOutlined,
  BookOutlined,
  RightOutlined,
  DownloadOutlined,
  GithubOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  CodeOutlined,
  HeartOutlined
} from '@ant-design/icons'
import { formatDate } from '@/lib/utils'
import PostCoverImage from '@/components/PostCoverImage'
import { useTranslation } from '@/hooks/useTranslation'
import { categorizeBlog } from '@/lib/blog-category'

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

export default function HomePage() {
  const { t } = useTranslation()
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
        fetch('/api/posts/latest?limit=3'),
        fetch('/api/posts/hot?limit=3'),
      ])

      if (latestRes.ok) {
        const latestData = await latestRes.json()
        setLatestPosts(latestData.posts || [])
      }

      if (hotRes.ok) {
        const hotData = await hotRes.json()
        setHotPosts(hotData.posts || [])
      }
    } catch {
      // 错误已静默处理
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Hero Section */}
      <div style={{
        backgroundImage: 'url(/ai-front.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '60px 16px',
        textAlign: 'center',
        marginBottom: '60px',
        position: 'relative',
      }}
      className="hero-section"
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.85)',
          zIndex: 0,
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
        <Title level={1} style={{
          fontSize: '48px',
          fontWeight: 700,
          marginBottom: '16px',
          background: 'linear-gradient(90deg, #2563eb, #1e40af)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          padding: '0 8px',
          wordBreak: 'break-word',
        }}
        className="hero-title"
        >
          {t('home.hero.title')}
        </Title>
        <Paragraph style={{
          fontSize: '18px',
          color: 'var(--foreground)',
          opacity: 0.8,
          maxWidth: '700px',
          margin: '0 auto 32px',
          padding: '0 8px',
          wordBreak: 'break-word',
        }}
        className="hero-description"
        >
          {t('home.hero.description')}
        </Paragraph>
        <Space 
          size="large" 
          style={{ 
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
          className="hero-buttons"
        >
          <Link href="/blog" style={{ width: '100%', maxWidth: '280px', minWidth: '200px' }}>
            <Button
              type="primary"
              size="large"
              icon={<BookOutlined />}
              block
              style={{
                height: '50px',
                padding: '0 20px',
                fontSize: '16px',
                borderRadius: '50px',
                whiteSpace: 'nowrap',
              }}
            >
              {t('common.browseBlog')}
            </Button>
          </Link>
          <Link href="/resume" style={{ width: '100%', maxWidth: '280px', minWidth: '200px' }}>
            <Button
              size="large"
              icon={<FileTextOutlined />}
              block
              style={{
                height: '50px',
                padding: '0 20px',
                fontSize: '16px',
                borderRadius: '50px',
                border: '2px solid #2563eb',
                color: '#2563eb',
                whiteSpace: 'nowrap',
              }}
            >
              {t('common.viewResume')}
            </Button>
          </Link>
        </Space>
        </div>
      </div>

      {/* Main Content */}
      <Row gutter={[32, 32]}>
        {/* Articles Section */}
        <Col xs={24} lg={16}>
          {/* Latest Posts */}
          <section style={{ marginBottom: '48px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
            }}>
              <Title level={3} style={{
                fontSize: '28px',
                fontWeight: 600,
                margin: 0,
                position: 'relative',
                paddingBottom: '16px',
              }}>
                {t('home.latestPosts')}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '50px',
                  height: '4px',
                  background: 'linear-gradient(90deg, #2563eb, #dbeafe)',
                  borderRadius: '2px',
                }} />
              </Title>
              <Link href="/blog" style={{
                color: '#2563eb',
                fontWeight: 600,
                textDecoration: 'none',
              }}>
                {t('common.viewAll')} <RightOutlined />
              </Link>
            </div>
            <div>
              {loading ? (
                [1, 2, 3].map((i) => (
                  <Card key={i} loading style={{ marginBottom: '24px', borderRadius: '12px' }} />
                ))
              ) : latestPosts.length > 0 ? (
                latestPosts.map((post) => {
                  const categoryInfo = categorizeBlog(post.title, post.summary)
                  return (
                    <Card
                      key={post.id}
                      style={{
                        marginBottom: '24px',
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
                        transition: 'all 0.3s',
                      }}
                      styles={{ body: { padding: '24px' } }}
                    >
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{
                          width: '120px',
                          height: '90px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          flexShrink: 0,
                        }}>
                          <PostCoverImage
                            title={post.title}
                            summary={post.summary}
                            height={90}
                            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Space style={{ marginBottom: '12px', fontSize: '12px', color: 'var(--foreground)', opacity: 0.6 }} wrap>
                            <Tag color={categoryInfo.color} style={{ margin: 0 }}>
                              {categoryInfo.label}
                            </Tag>
                            <CalendarOutlined />
                            <span>{formatDate(post.date)}</span>
                            <MessageOutlined style={{ marginLeft: '12px' }} />
                            <span>{post.commentCount} {t('common.comments')}</span>
                          </Space>
                          <Link
                            href={`/blog/${post.slug}`}
                            style={{
                              display: 'block',
                              transition: 'all 0.2s',
                              marginBottom: '8px',
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
                            <Title level={4} style={{
                              fontSize: '18px',
                              fontWeight: 600,
                              marginBottom: '8px',
                              color: 'var(--foreground)',
                              cursor: 'pointer',
                            }}>
                              {post.title}
                            </Title>
                          </Link>
                          <Paragraph
                            ellipsis={{ rows: 2 }}
                            style={{
                              color: 'var(--foreground)',
                              opacity: 0.7,
                              marginBottom: '12px',
                              fontSize: '14px',
                              lineHeight: 1.6,
                            }}
                          >
                            {post.summary}
                          </Paragraph>
                          <Link
                            href={`/blog/${post.slug}`}
                            style={{
                              color: '#2563eb',
                              fontWeight: 500,
                              textDecoration: 'none',
                              transition: 'all 0.2s',
                              display: 'inline-block',
                              fontSize: '14px',
                            }}
                            onClick={(e) => {
                              const target = e.currentTarget
                              target.style.opacity = '0.7'
                              target.style.transform = 'scale(0.95)'
                              setTimeout(() => {
                                target.style.opacity = '1'
                                target.style.transform = 'scale(1)'
                              }, 200)
                            }}
                          >
                            {t('common.readMore')} <RightOutlined />
                          </Link>
                        </div>
                      </div>
                    </Card>
                  )
                })
              ) : (
                <Empty description={t('common.noPosts')} />
              )}
            </div>
          </section>

          {/* Hot Posts */}
          <section>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
            }}>
              <Title level={3} style={{
                fontSize: '28px',
                fontWeight: 600,
                margin: 0,
                position: 'relative',
                paddingBottom: '16px',
              }}>
                {t('home.hotPosts')}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '50px',
                  height: '4px',
                  background: 'linear-gradient(90deg, #2563eb, #dbeafe)',
                  borderRadius: '2px',
                }} />
              </Title>
              <Link href="/blog" style={{
                color: '#2563eb',
                fontWeight: 600,
                textDecoration: 'none',
              }}>
                {t('common.viewAll')} <RightOutlined />
              </Link>
            </div>
            <div>
              {loading ? (
                [1, 2, 3].map((i) => (
                  <Card key={i} loading style={{ marginBottom: '24px', borderRadius: '12px' }} />
                ))
              ) : hotPosts.length > 0 ? (
                hotPosts.map((post) => {
                  const categoryInfo = categorizeBlog(post.title, post.summary)
                  return (
                    <Card
                      key={post.id}
                      style={{
                        marginBottom: '24px',
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
                        transition: 'all 0.3s',
                      }}
                      styles={{ body: { padding: '24px' } }}
                    >
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{
                          width: '120px',
                          height: '90px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          flexShrink: 0,
                        }}>
                          <PostCoverImage
                            title={post.title}
                            summary={post.summary}
                            height={90}
                            gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Space style={{ marginBottom: '12px', fontSize: '12px', color: 'var(--foreground)', opacity: 0.6 }} wrap>
                            <Tag color={categoryInfo.color} style={{ margin: 0 }}>
                              {categoryInfo.label}
                            </Tag>
                            <CalendarOutlined />
                            <span>{formatDate(post.date)}</span>
                            <MessageOutlined style={{ marginLeft: '12px' }} />
                            <span>{post.commentCount} {t('common.comments')}</span>
                          </Space>
                          <Link
                            href={`/blog/${post.slug}`}
                            style={{
                              display: 'block',
                              transition: 'all 0.2s',
                              marginBottom: '8px',
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
                            <Title level={4} style={{
                              fontSize: '18px',
                              fontWeight: 600,
                              marginBottom: '8px',
                              color: 'var(--foreground)',
                              cursor: 'pointer',
                            }}>
                              {post.title}
                            </Title>
                          </Link>
                          <Paragraph
                            ellipsis={{ rows: 2 }}
                            style={{
                              color: 'var(--foreground)',
                              opacity: 0.7,
                              marginBottom: '12px',
                              fontSize: '14px',
                              lineHeight: 1.6,
                            }}
                          >
                            {post.summary}
                          </Paragraph>
                          <Link
                            href={`/blog/${post.slug}`}
                            style={{
                              color: '#2563eb',
                              fontWeight: 500,
                              textDecoration: 'none',
                              transition: 'all 0.2s',
                              display: 'inline-block',
                              fontSize: '14px',
                            }}
                            onClick={(e) => {
                              const target = e.currentTarget
                              target.style.opacity = '0.7'
                              target.style.transform = 'scale(0.95)'
                              setTimeout(() => {
                                target.style.opacity = '1'
                                target.style.transform = 'scale(1)'
                              }, 200)
                            }}
                          >
                            {t('common.readMore')} <RightOutlined />
                          </Link>
                        </div>
                      </div>
                    </Card>
                  )
                })
              ) : (
                <Empty description={t('common.noPosts')} />
              )}
            </div>
          </section>
        </Col>

        {/* Sidebar */}
        <Col xs={24} lg={8}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Resume Card */}
            <Card
              style={{
                background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                borderRadius: '12px',
                border: 'none',
                color: 'white',
                textAlign: 'center',
              }}
              styles={{ body: { padding: '40px 24px' } }}
            >
              <FileTextOutlined style={{ fontSize: '48px', marginBottom: '24px', color: 'white' }} />
              <Title level={4} style={{ color: 'white', marginBottom: '12px' }}>
                {t('home.resumeCard.title')}
              </Title>
              <Paragraph style={{ color: 'white', opacity: 0.9, marginBottom: '24px' }}>
                {t('home.resumeCard.description')}
              </Paragraph>
              <Link href="/resume">
                <Button
                  type="primary"
                  size="large"
                  icon={<DownloadOutlined />}
                  style={{
                    background: 'white',
                    color: '#2563eb',
                    border: 'none',
                    height: '44px',
                    borderRadius: '50px',
                    fontWeight: 600,
                  }}
                >
                  {t('common.downloadResume')}
                </Button>
              </Link>
            </Card>

            {/* Blog Categories */}
            <Card
              title={<Title level={4} style={{ margin: 0 }}>{t('home.categories')}</Title>}
              style={{ borderRadius: '12px' }}
            >
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <div>
                  <Link href="/blog?category=tech" style={{ display: 'block', width: '100%' }}>
                    <Button
                      block
                      style={{
                        height: '44px',
                        borderRadius: '50px',
                        border: '2px solid #1890ff',
                        color: '#1890ff',
                        background: '#e6f7ff',
                      }}
                    >
                      <CodeOutlined /> 技术博客
                    </Button>
                  </Link>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--foreground)',
                    opacity: 0.6,
                    marginTop: '8px',
                    paddingLeft: '4px',
                  }}>
                    探索最新技术文章、开发技巧和行业趋势
                  </div>
                </div>
                <div>
                  <Link href="/blog?category=life" style={{ display: 'block', width: '100%' }}>
                    <Button
                      block
                      style={{
                        height: '44px',
                        borderRadius: '50px',
                        border: '2px solid #52c41a',
                        color: '#52c41a',
                        background: '#f6ffed',
                      }}
                    >
                      <HeartOutlined /> 生活记录
                    </Button>
                  </Link>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--foreground)',
                    opacity: 0.6,
                    marginTop: '8px',
                    paddingLeft: '4px',
                  }}>
                    提高自己的社会化技能或记录自己的生活感想
                  </div>
                </div>
              </Space>
            </Card>

            {/* About Me */}
            <Card
              style={{ borderRadius: '12px', textAlign: 'center' }}
              styles={{ body: { padding: '32px 24px' } }}
            >
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                margin: '0 auto 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                color: 'white',
              }}>
                陈
              </div>
              <Title level={4} style={{ marginBottom: '12px' }}>{t('home.aboutMe.name')}</Title>
              <Paragraph style={{ color: 'var(--foreground)', opacity: 0.8, marginBottom: '24px' }}>
                {t('home.aboutMe.description')}
              </Paragraph>
              <Space size="middle">
                <Button
                  type="text"
                  icon={<GithubOutlined />}
                  style={{ fontSize: '20px' }}
                />
                <Button
                  type="text"
                  icon={<LinkedinOutlined />}
                  style={{ fontSize: '20px' }}
                />
                <Button
                  type="text"
                  icon={<TwitterOutlined />}
                  style={{ fontSize: '20px' }}
                />
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  )
}

