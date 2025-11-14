'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, Tag, Space, Typography, Button, Empty, Row, Col } from 'antd'
import {
  CalendarOutlined,
  MessageOutlined,
  EyeOutlined,
  FileTextOutlined,
  BookOutlined,
  RightOutlined,
  DownloadOutlined,
  GithubOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  DribbbleOutlined
} from '@ant-design/icons'
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

export default function HomePage() {
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
    } catch (error) {
      console.error('获取文章失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(120deg, var(--background), var(--border))',
        padding: '80px 24px',
        textAlign: 'center',
        marginBottom: '60px',
      }}>
        <Title level={1} style={{
          fontSize: '48px',
          fontWeight: 700,
          marginBottom: '16px',
          background: 'linear-gradient(90deg, #2563eb, #1e40af)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          创造数字体验，设计美好未来
        </Title>
        <Paragraph style={{
          fontSize: '18px',
          color: 'var(--foreground)',
          opacity: 0.8,
          maxWidth: '700px',
          margin: '0 auto 32px',
        }}>
          我是一名专注的前端开发者，致力于打造直观、美观和高效的界面解决方案。在这里您可以找到我的技术见解、开发经验和最新作品。
        </Paragraph>
        <Space size="large">
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
              浏览博客
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
              查看简历
            </Button>
          </Link>
        </Space>
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
                最新文章
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
                查看全部 <RightOutlined />
              </Link>
            </div>
            <Row gutter={[24, 24]}>
              {loading ? (
                [1, 2, 3].map((i) => (
                  <Col xs={24} sm={12} md={8} key={i}>
                    <Card loading style={{ borderRadius: '12px' }} />
                  </Col>
                ))
              ) : latestPosts.length > 0 ? (
                latestPosts.map((post) => (
                  <Col xs={24} sm={12} md={8} key={post.id}>
                    <Card
                      hoverable
                      style={{
                        borderRadius: '12px',
                        overflow: 'hidden',
                        height: '100%',
                        transition: 'all 0.3s',
                      }}
                      styles={{ body: { padding: 0 } }}
                      cover={
                        <div style={{
                          height: '180px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '48px',
                        }}>
                          <BookOutlined />
                        </div>
                      }
                    >
                      <div style={{ padding: '20px' }}>
                        <Space style={{ marginBottom: '12px', fontSize: '12px', color: 'var(--foreground)', opacity: 0.6 }}>
                          <CalendarOutlined />
                          <span>{formatDate(post.date)}</span>
                          <MessageOutlined style={{ marginLeft: '12px' }} />
                          <span>{post.commentCount} 条评论</span>
                        </Space>
                        <Link href={`/blog/${post.slug}`}>
                          <Title level={4} style={{
                            fontSize: '18px',
                            fontWeight: 600,
                            marginBottom: '12px',
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
                          }}
                        >
                          {post.summary}
                        </Paragraph>
                        <Link href={`/blog/${post.slug}`} style={{
                          color: '#2563eb',
                          fontWeight: 500,
                          textDecoration: 'none',
                        }}>
                          阅读全文 <RightOutlined />
                        </Link>
                      </div>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col span={24}>
                  <Empty description="暂无文章" />
                </Col>
              )}
            </Row>
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
                热门文章
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
                查看全部 <RightOutlined />
              </Link>
            </div>
            <Row gutter={[24, 24]}>
              {loading ? (
                [1, 2, 3].map((i) => (
                  <Col xs={24} sm={12} md={8} key={i}>
                    <Card loading style={{ borderRadius: '12px' }} />
                  </Col>
                ))
              ) : hotPosts.length > 0 ? (
                hotPosts.map((post) => (
                  <Col xs={24} sm={12} md={8} key={post.id}>
                    <Card
                      hoverable
                      style={{
                        borderRadius: '12px',
                        overflow: 'hidden',
                        height: '100%',
                        transition: 'all 0.3s',
                      }}
                      styles={{ body: { padding: 0 } }}
                      cover={
                        <div style={{
                          height: '180px',
                          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '48px',
                        }}>
                          <BookOutlined />
                        </div>
                      }
                    >
                      <div style={{ padding: '20px' }}>
                        <Space style={{ marginBottom: '12px', fontSize: '12px', color: 'var(--foreground)', opacity: 0.6 }}>
                          <CalendarOutlined />
                          <span>{formatDate(post.date)}</span>
                          <MessageOutlined style={{ marginLeft: '12px' }} />
                          <span>{post.commentCount} 条评论</span>
                        </Space>
                        <Link href={`/blog/${post.slug}`}>
                          <Title level={4} style={{
                            fontSize: '18px',
                            fontWeight: 600,
                            marginBottom: '12px',
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
                          }}
                        >
                          {post.summary}
                        </Paragraph>
                        <Link href={`/blog/${post.slug}`} style={{
                          color: '#2563eb',
                          fontWeight: 500,
                          textDecoration: 'none',
                        }}>
                          阅读全文 <RightOutlined />
                        </Link>
                      </div>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col span={24}>
                  <Empty description="暂无文章" />
                </Col>
              )}
            </Row>
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
                我的专业简历
              </Title>
              <Paragraph style={{ color: 'white', opacity: 0.9, marginBottom: '24px' }}>
                获取完全版本简历，包括工作履历、专业技能和项目经历。
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
                  下载简历PDF
                </Button>
              </Link>
            </Card>

            {/* Blog Categories */}
            <Card
              title={<Title level={4} style={{ margin: 0 }}>博客分类</Title>}
              style={{ borderRadius: '12px' }}
            >
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <Link href="/blog" style={{ display: 'block', width: '100%' }}>
                  <Button
                    block
                    style={{
                      height: '44px',
                      borderRadius: '50px',
                      border: '2px solid #2563eb',
                      color: '#2563eb',
                    }}
                  >
                    <BookOutlined /> 前端开发
                  </Button>
                </Link>
                <Link href="/blog" style={{ display: 'block', width: '100%' }}>
                  <Button
                    block
                    style={{
                      height: '44px',
                      borderRadius: '50px',
                      border: '2px solid #2563eb',
                      color: '#2563eb',
                    }}
                  >
                    <BookOutlined /> React
                  </Button>
                </Link>
                <Link href="/blog" style={{ display: 'block', width: '100%' }}>
                  <Button
                    block
                    style={{
                      height: '44px',
                      borderRadius: '50px',
                      border: '2px solid #2563eb',
                      color: '#2563eb',
                    }}
                  >
                    <BookOutlined /> Next.js
                  </Button>
                </Link>
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
              <Title level={4} style={{ marginBottom: '12px' }}>陈灼</Title>
              <Paragraph style={{ color: 'var(--foreground)', opacity: 0.8, marginBottom: '24px' }}>
                前端开发工程师 | 拥有5年行业经验，专注于创建直观美观的数字体验。
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

