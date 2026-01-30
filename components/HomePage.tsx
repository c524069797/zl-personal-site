'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, Tag, Space, Typography, Button, Empty, Row, Col } from 'antd'
import {
  CalendarOutlined,
  MessageOutlined,
  FileTextOutlined,
  BookOutlined,
  RightOutlined,
  GithubOutlined,
  TwitterOutlined,
  CodeOutlined,
  HeartOutlined,
  MailOutlined,
  ClockCircleOutlined
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
  readingTime?: number
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
      {/* Hero Section with Animated Background */}
      <div 
        className="hero-section hero-animated-bg"
        style={{
          padding: '60px 16px',
          textAlign: 'center',
          marginBottom: '60px',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '16px',
        }}
      >
        {/* Animated background layers */}
        <div className="hero-bg-layer hero-bg-gradient" />
        <div className="hero-bg-layer hero-bg-particles" />
        <div className="hero-bg-layer hero-bg-grid" />
        <div className="hero-bg-layer hero-bg-overlay" />
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
              <Title level={3} className="section-title" style={{
                fontSize: '28px',
                fontWeight: 600,
                margin: 0,
                position: 'relative',
                paddingBottom: '16px',
              }}>
                {t('home.latestPosts')}
                <div className="section-title-decoration" style={{
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
                            {post.readingTime ? (
                              <>
                                <ClockCircleOutlined style={{ marginLeft: '12px' }} />
                                <span>{post.readingTime} {t('common.minRead', '分钟阅读')}</span>
                              </>
                            ) : null}
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
              <Title level={3} className="section-title" style={{
                fontSize: '28px',
                fontWeight: 600,
                margin: 0,
                position: 'relative',
                paddingBottom: '16px',
              }}>
                {t('home.hotPosts')}
                <div className="section-title-decoration" style={{
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
            {/* About Me Card */}
            <Card
              style={{ borderRadius: '12px', textAlign: 'center' }}
              styles={{ body: { padding: '32px 24px' } }}
            >
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                margin: '0 auto 24px',
                overflow: 'hidden',
                background: 'var(--background)',
                border: '3px solid #2563eb',
              }}>
                <Image
                  src="/my-profile.png"
                  alt="陈灼"
                  width={120}
                  height={120}
                  style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                  }}
                />
              </div>
              <Title level={4} style={{ marginBottom: '8px' }}>陈灼 (Jack Chen)</Title>
              <Paragraph style={{ color: 'var(--foreground)', opacity: 0.7, marginBottom: '16px', fontSize: '14px' }}>
                热爱学习的前端，全栈40% | 一名篮球爱好者
              </Paragraph>
              <Space size="middle" style={{ marginBottom: '20px' }}>
                <a
                  href="https://github.com/c524069797"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'var(--foreground)',
                    fontSize: '22px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--background-light)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#1890ff'
                    e.currentTarget.style.transform = 'scale(1.1)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'var(--foreground)'
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  <GithubOutlined />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'var(--foreground)',
                    fontSize: '22px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--background-light)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#1890ff'
                    e.currentTarget.style.transform = 'scale(1.1)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'var(--foreground)'
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  <TwitterOutlined />
                </a>
                <a
                  href="mailto:chenzhuo995@gmail.com"
                  style={{
                    color: 'var(--foreground)',
                    fontSize: '22px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--background-light)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#1890ff'
                    e.currentTarget.style.transform = 'scale(1.1)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'var(--foreground)'
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  <MailOutlined />
                </a>
              </Space>
              <Link href="/resume">
                <Button
                  type="primary"
                  size="large"
                  icon={<FileTextOutlined />}
                  block
                  style={{
                    height: '44px',
                    borderRadius: '50px',
                    fontWeight: 600,
                  }}
                >
                  {t('common.viewResume')}
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


          </Space>
        </Col>
      </Row>
    </div>
  )
}

