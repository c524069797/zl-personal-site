'use client'

import { useEffect, useState } from 'react'
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
  HeartOutlined,
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

  const renderPostCard = (post: Post, gradient: string) => {
    const categoryInfo = categorizeBlog(post.title, post.summary)

    return (
      <Col key={post.id} xs={24} md={12} xl={8} style={{ display: 'flex' }}>
        <Card
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)',
            overflow: 'hidden',
          }}
          styles={{
            body: {
              padding: 0,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            },
          }}
        >
          <div style={{ padding: '24px 24px 0' }}>
            <div style={{ borderRadius: '14px', overflow: 'hidden' }}>
              <PostCoverImage
                title={post.title}
                summary={post.summary}
                height={180}
                gradient={gradient}
              />
            </div>
          </div>
          <div
            style={{
              padding: '16px 24px 24px',
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              minHeight: 0,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                marginBottom: '16px',
                flexWrap: 'wrap',
              }}
            >
              <Tag color={categoryInfo.color} style={{ margin: 0 }}>
                {categoryInfo.label}
              </Tag>
              <Space size="small" style={{ fontSize: '13px', color: 'var(--foreground)', opacity: 0.6 }}>
                <CalendarOutlined />
                <span>{formatDate(post.date)}</span>
              </Space>
            </div>
            <Link
              href={`/blog/${post.slug}`}
              style={{
                display: 'block',
                transition: 'all 0.2s',
                marginBottom: '12px',
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
                  fontSize: 'clamp(20px, 2.2vw, 24px)',
                  fontWeight: 700,
                  margin: 0,
                  color: 'var(--foreground)',
                  cursor: 'pointer',
                  lineHeight: 1.35,
                  minHeight: 'calc(1.35em * 2)',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 2,
                  overflow: 'hidden',
                }}
              >
                {post.title}
              </Title>
            </Link>
            <Paragraph
              ellipsis={{ rows: 3 }}
              style={{
                color: 'var(--foreground)',
                opacity: 0.72,
                marginBottom: '20px',
                fontSize: '15px',
                lineHeight: 1.8,
                flex: 1,
                minHeight: 'calc(1.8em * 3)',
              }}
            >
              {post.summary}
            </Paragraph>
            <div
              style={{
                marginTop: 'auto',
                paddingTop: '16px',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              <Link
                href={`/blog/${post.slug}`}
                style={{
                  color: '#2563eb',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
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
                {t('common.readMore')}
                <RightOutlined />
              </Link>
              <Space size="small" style={{ fontSize: '13px', color: 'var(--foreground)', opacity: 0.6 }}>
                <MessageOutlined />
                <span>{post.commentCount} {t('common.comments')}</span>
              </Space>
            </div>
          </div>
        </Card>
      </Col>
    )
  }

  const renderLoadingCards = () => (
    <Row gutter={[24, 24]}>
      {[1, 2, 3].map((item) => (
        <Col key={item} xs={24} md={12} xl={8} style={{ display: 'flex' }}>
          <Card loading style={{ width: '100%', borderRadius: '16px' }} />
        </Col>
      ))}
    </Row>
  )

  return (
    <div style={{ width: '100%' }}>
      <section style={{ background: 'linear-gradient(120deg, var(--background), var(--border))' }}>
        <div className="page-container hero-section" style={{ textAlign: 'center' }}>
          <Title level={1} style={{
            fontSize: 'clamp(36px, 6vw, 48px)',
            fontWeight: 700,
            marginBottom: '16px',
            background: 'linear-gradient(90deg, #2563eb, #1e40af)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            {t('home.hero.title')}
          </Title>
          <Paragraph style={{
            fontSize: '18px',
            color: 'var(--foreground)',
            opacity: 0.8,
            maxWidth: '700px',
            margin: '0 auto 32px',
          }}>
            {t('home.hero.description')}
          </Paragraph>
          <Space size="large" wrap style={{ justifyContent: 'center' }}>
            <Link href="/blog">
              <Button
                type="primary"
                size="large"
                icon={<BookOutlined />}
                style={{
                  height: '50px',
                  padding: '0 32px',
                  fontSize: '16px',
                  borderRadius: '50px',
                }}
              >
                {t('common.browseBlog')}
              </Button>
            </Link>
            <Link href="/resume">
              <Button
                size="large"
                icon={<FileTextOutlined />}
                style={{
                  height: '50px',
                  padding: '0 32px',
                  fontSize: '16px',
                  borderRadius: '50px',
                  border: '2px solid #2563eb',
                  color: '#2563eb',
                }}
              >
                {t('common.viewResume')}
              </Button>
            </Link>
          </Space>
        </div>
      </section>

      <div className="page-container" style={{ paddingBottom: '56px', paddingTop: '40px' }}>
        <Row gutter={[32, 32]}>
          <Col xs={24} lg={16}>
            <section style={{ marginBottom: '48px' }}>
              <div className="section-title-row">
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
                <Link href="/blog" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
                  {t('common.viewAll')} <RightOutlined />
                </Link>
              </div>
              {loading ? renderLoadingCards() : latestPosts.length ? (
                <Row gutter={[24, 24]}>
                  {latestPosts.map(post => renderPostCard(post, 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'))}
                </Row>
              ) : (
                <Empty description={t('common.noPosts')} />
              )}
            </section>

            <section>
              <div className="section-title-row">
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
                <Link href="/blog" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
                  {t('common.viewAll')} <RightOutlined />
                </Link>
              </div>
              {loading ? renderLoadingCards() : hotPosts.length ? (
                <Row gutter={[24, 24]}>
                  {hotPosts.map(post => renderPostCard(post, 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'))}
                </Row>
              ) : (
                <Empty description={t('common.noPosts')} />
              )}
            </section>
          </Col>

          <Col xs={24} lg={8}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
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
                    <div style={{ fontSize: '12px', color: 'var(--foreground)', opacity: 0.6, marginTop: '8px', paddingLeft: '4px' }}>
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
                    <div style={{ fontSize: '12px', color: 'var(--foreground)', opacity: 0.6, marginTop: '8px', paddingLeft: '4px' }}>
                      提高自己的社会化技能或记录自己的生活感想
                    </div>
                  </div>
                </Space>
              </Card>

              <Card style={{ borderRadius: '12px', textAlign: 'center' }} styles={{ body: { padding: '32px 24px' } }}>
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
                  <Button type="text" icon={<GithubOutlined />} style={{ fontSize: '20px' }} />
                  <Button type="text" icon={<LinkedinOutlined />} style={{ fontSize: '20px' }} />
                  <Button type="text" icon={<TwitterOutlined />} style={{ fontSize: '20px' }} />
                </Space>
              </Card>
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  )
}
