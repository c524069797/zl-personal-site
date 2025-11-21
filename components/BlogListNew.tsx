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
import { useTranslation } from '@/hooks/useTranslation'

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

interface Category {
  id: string
  name: string
  slug: string
  count: number
  color: string
}

export default function BlogListNew() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [posts, setPosts] = useState<Post[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [hotPosts, setHotPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const pageSize = 10

  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1')
    const tag = searchParams.get('tag') || null
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || null

    setCurrentPage(page)
    setSelectedTag(tag)
    setSelectedCategory(category)
    setSearchKeyword(search)
    fetchData(page, tag, search, category)
  }, [searchParams])

  const fetchData = async (page: number, tag: string | null, search: string, category: string | null) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', pageSize.toString())
      if (tag) params.append('tag', tag)
      if (search) params.append('search', search)
      if (category) params.append('category', category)

      const [postsRes, tagsRes, categoriesRes, hotRes] = await Promise.all([
        fetch(`/api/posts?${params.toString()}`),
        fetch('/api/tags'),
        fetch('/api/categories'),
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

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        setCategories(categoriesData.categories || [])
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

  const handleSearch = (value: string) => {
    const params = new URLSearchParams()
    if (value) params.append('search', value)
    if (selectedTag) params.append('tag', selectedTag)
    const category = searchParams.get('category')
    if (category) params.append('category', category)
    params.append('page', '1')
    router.push(`/blog?${params.toString()}`)
  }

  const handleTagClick = (tagSlug: string) => {
    const params = new URLSearchParams()
    params.append('tag', tagSlug)
    if (searchKeyword) params.append('search', searchKeyword)
    const category = searchParams.get('category')
    if (category) params.append('category', category)
    params.append('page', '1')
    router.push(`/blog?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams()
    if (selectedTag) params.append('tag', selectedTag)
    if (searchKeyword) params.append('search', searchKeyword)
    const category = searchParams.get('category')
    if (category) params.append('category', category)
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
            {(() => {
              const category = searchParams.get('category')
              if (category === 'tech') return '技术博客'
              if (category === 'life') return '生活记录'
              return t('blog.title')
            })()}
          </Title>
          <Paragraph style={{
            fontSize: '16px',
            color: 'var(--foreground)',
            opacity: 0.7,
            maxWidth: '800px',
          }}>
            {(() => {
              const category = searchParams.get('category')
              if (category === 'tech') return '探索最新技术文章、开发技巧和行业趋势，提升您的开发技能'
              if (category === 'life') return '提高自己的社会化技能或记录自己的生活感想'
              return t('blog.description')
            })()}
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
                <Empty description={t('common.noPosts')} />
              </Card>
            )}
          </Col>

          {/* Sidebar */}
          <Col xs={24} lg={8}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* Search */}
              <Card style={{ borderRadius: '6px', border: 'none', boxShadow: '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)' }}>
                <Search
                  placeholder={t('blog.search')}
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
                    <span>{t('blog.categories')}</span>
                  </Space>
                }
                style={{ borderRadius: '6px', border: 'none', boxShadow: '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)' }}
                loading={loading}
              >
                <div style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <div
                        key={category.id}
                        style={{
                          padding: '10px 0',
                          borderBottom: '1px solid var(--border)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onClick={() => {
                          const params = new URLSearchParams()
                          params.append('category', category.slug)
                          if (selectedTag) params.append('tag', selectedTag)
                          if (searchKeyword) params.append('search', searchKeyword)
                          params.append('page', '1')
                          router.push(`/blog?${params.toString()}`)
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--background-light)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent'
                        }}
                      >
                        <Text
                          style={{
                            color: selectedCategory === category.slug ? category.color : 'var(--foreground)',
                            opacity: selectedCategory === category.slug ? 1 : 0.7,
                            fontWeight: selectedCategory === category.slug ? 500 : 400,
                          }}
                        >
                          {category.name}
                        </Text>
                        <Text style={{ fontSize: '13px', color: 'var(--foreground)', opacity: 0.5 }}>
                          {category.count}
                        </Text>
                      </div>
                    ))
                  ) : (
                    <Empty description="暂无分类" style={{ padding: '20px 0' }} />
                  )}
                </div>
              </Card>

              {/* Tag Cloud */}
              <Card
                title={
                  <Space>
                    <TagsOutlined />
                    <span>{t('blog.hotTags')}</span>
                  </Space>
                }
                style={{ borderRadius: '6px', border: 'none', boxShadow: '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)' }}
                loading={loading}
              >
                {tags.length > 0 ? (
                  <Space wrap size="small">
                    {tags.map((tag) => (
                      <Tag
                        key={tag.id}
                        style={{
                          fontSize: '12px',
                          padding: '3px 10px',
                          background: selectedTag === tag.slug ? '#1890ff' : 'var(--background)',
                          borderRadius: '4px',
                          color: selectedTag === tag.slug ? '#fff' : 'var(--foreground)',
                          border: selectedTag === tag.slug ? '1px solid #1890ff' : '1px solid var(--border)',
                          cursor: 'pointer',
                          marginBottom: '8px',
                          transition: 'all 0.2s',
                        }}
                        onClick={() => handleTagClick(tag.slug)}
                        onMouseEnter={(e) => {
                          if (selectedTag !== tag.slug) {
                            e.currentTarget.style.background = 'var(--background-light)'
                            e.currentTarget.style.borderColor = '#1890ff'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedTag !== tag.slug) {
                            e.currentTarget.style.background = 'var(--background)'
                            e.currentTarget.style.borderColor = 'var(--border)'
                          }
                        }}
                      >
                        {tag.name} ({tag.count})
                      </Tag>
                    ))}
                  </Space>
                ) : (
                  <Empty description="暂无标签" style={{ padding: '20px 0' }} />
                )}
              </Card>

              {/* Hot Posts */}
              <Card
                title={
                  <Space>
                    <FireOutlined />
                    <span>{t('home.hotPosts')}</span>
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

