'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, Tag, Space, Typography, Input, Row, Col, Pagination, Empty } from 'antd'
import {
  MessageOutlined,
  SearchOutlined,
  FolderOutlined,
  TagsOutlined,
  FireOutlined
} from '@ant-design/icons'
import { formatDate } from '@/lib/utils'
import PostCoverImage from '@/components/PostCoverImage'

const { Title, Paragraph, Text } = Typography
const { Search } = Input

interface Post {
  id: string
  slug: string
  title: string
  date: string
  summary: string
  tags: Array<{ name: string; slug: string }>
  commentCount: number
}

interface Tag {
  id: string
  name: string
  slug: string
  count: number
}

export default function BlogListNew() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [posts, setPosts] = useState<Post[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [hotPosts, setHotPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const pageSize = 10

  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1')
    const tag = searchParams.get('tag') || null
    const search = searchParams.get('search') || ''

    setCurrentPage(page)
    setSelectedTag(tag)
    setSearchKeyword(search)
    fetchData(page, tag, search)
  }, [searchParams])

  const fetchData = async (page: number, tag: string | null, search: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', pageSize.toString())
      if (tag) params.append('tag', tag)
      if (search) params.append('search', search)

      const [postsRes, tagsRes, hotRes] = await Promise.all([
        fetch(`/api/posts?${params.toString()}`),
        fetch('/api/tags'),
        fetch('/api/posts/hot?limit=4'),
      ])

      if (postsRes.ok) {
        const postsData = await postsRes.json()
        setPosts(postsData.posts || [])
        setTotal(postsData.total || 0)
      }

      if (tagsRes.ok) {
        const tagsData = await tagsRes.json()
        setTags(tagsData.tags || [])
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

  const handleSearch = (value: string) => {
    const params = new URLSearchParams()
    if (value) params.append('search', value)
    if (selectedTag) params.append('tag', selectedTag)
    params.append('page', '1')
    router.push(`/blog?${params.toString()}`)
  }

  const handleTagClick = (tagSlug: string) => {
    const params = new URLSearchParams()
    params.append('tag', tagSlug)
    if (searchKeyword) params.append('search', searchKeyword)
    params.append('page', '1')
    router.push(`/blog?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams()
    if (selectedTag) params.append('tag', selectedTag)
    if (searchKeyword) params.append('search', searchKeyword)
    params.append('page', page.toString())
    router.push(`/blog?${params.toString()}`)
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(120deg, #e0f7ff, #f0f9ff)',
        padding: '40px 0 30px',
        marginBottom: '32px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <Title level={1} style={{
            fontSize: '28px',
            fontWeight: 700,
            marginBottom: '8px',
            color: 'var(--foreground)',
          }}>
            技术博客
          </Title>
          <Paragraph style={{
            fontSize: '16px',
            color: 'var(--foreground)',
            opacity: 0.7,
            maxWidth: '800px',
          }}>
            探索最新技术文章、开发技巧和行业趋势，提升您的开发技能
          </Paragraph>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 40px' }}>
        <Row gutter={[24, 24]}>
          {/* Blog List */}
          <Col xs={24} lg={16}>
            {loading ? (
              [1, 2, 3].map((i) => (
                <Card key={i} loading style={{ marginBottom: '24px', borderRadius: '6px' }} />
              ))
            ) : posts.length > 0 ? (
              <>
                {posts.map((post) => (
                  <Card
                    key={post.id}
                    style={{
                      marginBottom: '24px',
                      borderRadius: '6px',
                      border: 'none',
                      boxShadow: '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.3s',
                    }}
                    styles={{ body: { padding: '24px' } }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px',
                    }}>
                      {post.tags && post.tags.length > 0 && (
                        <Tag
                          color="blue"
                          style={{
                            fontSize: '12px',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontWeight: 500,
                          }}
                        >
                          {post.tags[0].name}
                        </Tag>
                      )}
                      <Text style={{ fontSize: '13px', color: 'var(--foreground)', opacity: 0.6 }}>
                        {formatDate(post.date)}
                      </Text>
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <Title level={3} style={{
                        fontSize: '20px',
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
                        marginBottom: '20px',
                        fontSize: '15px',
                        lineHeight: 1.7,
                      }}
                    >
                      {post.summary}
                    </Paragraph>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '16px',
                      borderTop: '1px solid var(--border)',
                    }}>
                      <Space wrap size="small">
                        {post.tags && post.tags.map((tag) => (
                          <Tag
                            key={tag.slug}
                            style={{
                              fontSize: '12px',
                              padding: '3px 10px',
                              background: 'var(--background)',
                              borderRadius: '4px',
                              color: 'var(--foreground)',
                              border: '1px solid var(--border)',
                              cursor: 'pointer',
                            }}
                            onClick={() => handleTagClick(tag.slug)}
                          >
                            {tag.name}
                          </Tag>
                        ))}
                      </Space>
                      <Space size="large" style={{ fontSize: '13px', color: 'var(--foreground)', opacity: 0.6 }}>
                        <Space size="small">
                          <MessageOutlined />
                          <span>{post.commentCount || 0}</span>
                        </Space>
                      </Space>
                    </div>
                  </Card>
                ))}

                {/* Pagination */}
                {total > pageSize && (
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
                    <Pagination
                      current={currentPage}
                      total={total}
                      pageSize={pageSize}
                      onChange={handlePageChange}
                      showSizeChanger={false}
                      showQuickJumper
                      showTotal={(total) => `共 ${total} 条`}
                    />
                  </div>
                )}
              </>
            ) : (
              <Card>
                <Empty description="暂无文章" />
              </Card>
            )}
          </Col>

          {/* Sidebar */}
          <Col xs={24} lg={8}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* Search */}
              <Card style={{ borderRadius: '6px', border: 'none', boxShadow: '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)' }}>
                <Search
                  placeholder="搜索文章..."
                  allowClear
                  enterButton={<SearchOutlined />}
                  size="large"
                  onSearch={handleSearch}
                  defaultValue={searchKeyword}
                />
              </Card>

              {/* Categories */}
              <Card
                title={
                  <Space>
                    <FolderOutlined />
                    <span>文章分类</span>
                  </Space>
                }
                style={{ borderRadius: '6px', border: 'none', boxShadow: '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)' }}
              >
                <div style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {tags.slice(0, 6).map((tag) => (
                    <div
                      key={tag.id}
                      style={{
                        padding: '10px 0',
                        borderBottom: '1px solid var(--border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleTagClick(tag.slug)}
                    >
                      <Text
                        style={{
                          color: selectedTag === tag.slug ? '#1890ff' : 'var(--foreground)',
                          opacity: selectedTag === tag.slug ? 1 : 0.7,
                        }}
                      >
                        {tag.name}
                      </Text>
                      <Text style={{ fontSize: '13px', color: 'var(--foreground)', opacity: 0.5 }}>
                        {tag.count}
                      </Text>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Tag Cloud */}
              <Card
                title={
                  <Space>
                    <TagsOutlined />
                    <span>热门标签</span>
                  </Space>
                }
                style={{ borderRadius: '6px', border: 'none', boxShadow: '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)' }}
              >
                <Space wrap size="small">
                  {tags.map((tag) => (
                    <Tag
                      key={tag.id}
                      style={{
                        fontSize: '12px',
                        padding: '3px 10px',
                        background: 'var(--background)',
                        borderRadius: '4px',
                        color: 'var(--foreground)',
                        border: '1px solid var(--border)',
                        cursor: 'pointer',
                        marginBottom: '8px',
                      }}
                      onClick={() => handleTagClick(tag.slug)}
                    >
                      {tag.name}
                    </Tag>
                  ))}
                </Space>
              </Card>

              {/* Hot Posts */}
              <Card
                title={
                  <Space>
                    <FireOutlined />
                    <span>热门文章</span>
                  </Space>
                }
                style={{ borderRadius: '6px', border: 'none', boxShadow: '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)' }}
              >
                {hotPosts.map((post) => (
                  <div
                    key={post.id}
                    style={{
                      display: 'flex',
                      gap: '15px',
                      padding: '12px 0',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    <div style={{
                      width: '80px',
                      height: '60px',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      flexShrink: 0,
                    }}>
                      <PostCoverImage
                        title={post.title}
                        summary={post.summary}
                        height={60}
                        gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <Link href={`/blog/${post.slug}`}>
                        <Title level={5} style={{
                          fontSize: '14px',
                          fontWeight: 500,
                          marginBottom: '5px',
                          color: 'var(--foreground)',
                          cursor: 'pointer',
                        }}>
                          {post.title}
                        </Title>
                      </Link>
                      <Space size="small" style={{ fontSize: '12px', color: 'var(--foreground)', opacity: 0.5 }}>
                        <MessageOutlined />
                        <span>{post.commentCount || 0}</span>
                      </Space>
                    </div>
                  </div>
                ))}
              </Card>
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  )
}

