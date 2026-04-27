'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, Tag, Space, Typography, Input, Row, Col, Pagination, Empty } from 'antd'
import {
  MessageOutlined,
  SearchOutlined,
  FolderOutlined,
  TagsOutlined,
  FireOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import { formatDate } from '@/lib/utils'
import PostCoverImage from '@/components/PostCoverImage'
import { useTranslation } from '@/hooks/useTranslation'

const { Title, Text } = Typography
const { Search } = Input

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

// 模块级缓存：sidebar 数据（tags、categories、hotPosts）只请求一次
// 即使组件重新挂载，也不会重复请求
let cachedTags: Tag[] | null = null
let cachedCategories: Category[] | null = null
let cachedHotPosts: Post[] | null = null
let sidebarCacheLoaded = false

export default function BlogListNew() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const [posts, setPosts] = useState<Post[]>([])
  const [tags, setTags] = useState<Tag[]>(cachedTags || [])
  const [categories, setCategories] = useState<Category[]>(cachedCategories || [])
  const [hotPosts, setHotPosts] = useState<Post[]>(cachedHotPosts || [])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showAllTags, setShowAllTags] = useState(false)

  const pageSize = 10

  // Static sidebar data: only fetch once globally
  const [sidebarLoaded, setSidebarLoaded] = useState(sidebarCacheLoaded)

  useEffect(() => {
    if (sidebarCacheLoaded) return

    const fetchSidebarData = async () => {
      try {
        const [tagsRes, categoriesRes, hotRes] = await Promise.all([
          fetch('/api/tags'),
          fetch('/api/categories'),
          fetch('/api/posts/hot?limit=4'),
        ])

        if (tagsRes.ok) {
          const tagsData = await tagsRes.json()
          const sortedTags = (tagsData.tags || [])
            .filter((tag: Tag) => tag.count > 0)
            .sort((a: Tag, b: Tag) => b.count - a.count)
          cachedTags = sortedTags
          setTags(sortedTags)
        }

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json()
          const cats = categoriesData.categories || []
          cachedCategories = cats
          setCategories(cats)
        }

        if (hotRes.ok) {
          const hotData = await hotRes.json()
          const hots = hotData.posts || []
          cachedHotPosts = hots
          setHotPosts(hots)
        }
      } catch {
        // errors silently handled
      } finally {
        sidebarCacheLoaded = true
        setSidebarLoaded(true)
      }
    }
    fetchSidebarData()
  }, [])

  // Initial load from URL searchParams only once
  const isInitialLoad = useRef(true)
  useEffect(() => {
    if (!isInitialLoad.current) return
    isInitialLoad.current = false

    const page = parseInt(searchParams.get('page') || '1')
    const tag = searchParams.get('tag') || null
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || null

    setCurrentPage(page)
    setSelectedTag(tag)
    setSelectedCategory(category)
    setSearchKeyword(search)
    fetchPosts(page, tag, search, category)
  }, [searchParams])

  const fetchPosts = async (page: number, tag: string | null, search: string, category: string | null) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', pageSize.toString())
      if (tag) params.append('tag', tag)
      if (search) params.append('search', search)
      if (category) params.append('category', category)

      const res = await fetch(`/api/posts?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setPosts(data.posts || [])
        setTotal(data.total || 0)
      }
    } catch {
      // errors silently handled
    } finally {
      setLoading(false)
    }
  }

  // Update URL silently without triggering navigation
  const updateUrl = (page: number, tag: string | null, search: string, category: string | null) => {
    const params = new URLSearchParams()
    if (page > 1) params.append('page', page.toString())
    if (tag) params.append('tag', tag)
    if (search) params.append('search', search)
    if (category) params.append('category', category)

    const query = params.toString()
    const url = query ? `/blog?${query}` : '/blog'
    window.history.replaceState({}, '', url)
  }

  const handleSearch = (value: string) => {
    const newPage = 1
    setCurrentPage(newPage)
    setSearchKeyword(value)
    updateUrl(newPage, selectedTag, value, selectedCategory)
    fetchPosts(newPage, selectedTag, value, selectedCategory)
  }

  const handleTagClick = (tagSlug: string) => {
    const newPage = 1
    setCurrentPage(newPage)
    setSelectedTag(tagSlug)
    updateUrl(newPage, tagSlug, searchKeyword, null)
    fetchPosts(newPage, tagSlug, searchKeyword, null)
  }

  const handleCategoryClick = (categorySlug: string) => {
    const newPage = 1
    setCurrentPage(newPage)
    setSelectedCategory(categorySlug)
    setSelectedTag(null)
    updateUrl(newPage, null, searchKeyword, categorySlug)
    fetchPosts(newPage, null, searchKeyword, categorySlug)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    updateUrl(page, selectedTag, searchKeyword, selectedCategory)
    fetchPosts(page, selectedTag, searchKeyword, selectedCategory)
  }

  const getHeaderTitle = () => {
    if (selectedCategory === 'tech') return '技术博客'
    if (selectedCategory === 'life') return '生活记录'
    return t('blog.title')
  }

  const getHeaderDescription = () => {
    if (selectedCategory === 'tech') return '探索最新技术文章、开发技巧和行业趋势，提升您的开发技能'
    if (selectedCategory === 'life') return '提高自己的社会化技能或记录自己的生活感想'
    return t('blog.description')
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Page Header - Dark Futuristic Banner */}
      <div style={{
        position: 'relative',
        padding: '48px 0 36px',
        marginBottom: '32px',
        borderBottom: '1px solid var(--border)',
        overflow: 'hidden',
      }}>
        {/* Subtle grid overlay for dark mode */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }} />
        {/* Subtle indigo glow */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative' }}>
          <h1 className="blog-header-title" style={{
            fontSize: '32px',
            fontWeight: 700,
            marginBottom: '8px',
          }}>
            {getHeaderTitle()}
          </h1>
          <p style={{
            fontSize: '16px',
            color: 'var(--foreground)',
            opacity: 0.6,
            maxWidth: '800px',
            margin: 0,
          }}>
            {getHeaderDescription()}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 40px' }}>
        <Row gutter={[24, 24]}>
          {/* Blog List */}
          <Col xs={24} lg={16}>
            {loading ? (
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="dark-skeleton"
                  style={{
                    marginBottom: '24px',
                    height: '220px',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border)',
                  }}
                />
              ))
            ) : posts.length > 0 ? (
              <>
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="blog-post-card"
                    style={{
                      marginBottom: '24px',
                      borderRadius: '16px',
                      border: '1px solid var(--border)',
                      background: 'var(--background-light)',
                      padding: '24px',
                      transition: 'all 0.3s ease',
                      cursor: 'default',
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px',
                    }}>
                      {post.tags && post.tags.length > 0 && (
                        <span className="blog-tag-badge" style={{
                          fontSize: '12px',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontWeight: 500,
                        }}>
                          {post.tags[0].name}
                        </span>
                      )}
                      <span style={{ fontSize: '13px', color: 'var(--foreground)', opacity: 0.5 }}>
                        {formatDate(post.date)}
                        {post.readingTime ? (
                          <>
                            <span style={{ margin: '0 8px' }}>·</span>
                            <ClockCircleOutlined style={{ marginRight: '4px' }} />
                            {post.readingTime} {t('common.minRead', '分钟阅读')}
                          </>
                        ) : null}
                      </span>
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
                      <h3 style={{
                        fontSize: '20px',
                        fontWeight: 600,
                        marginBottom: '12px',
                        color: 'var(--foreground)',
                        cursor: 'pointer',
                      }}>
                        {post.title}
                      </h3>
                    </Link>
                    <p
                      style={{
                        color: 'var(--foreground)',
                        opacity: 0.6,
                        marginBottom: '20px',
                        fontSize: '15px',
                        lineHeight: 1.7,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {post.summary}
                    </p>
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
                              borderRadius: '4px',
                              cursor: 'pointer',
                            }}
                            onClick={() => handleTagClick(tag.slug)}
                          >
                            {tag.name}
                          </Tag>
                        ))}
                      </Space>
                      <Space size="large" style={{ fontSize: '13px', color: 'var(--foreground)', opacity: 0.4 }}>
                        <Space size="small">
                          <MessageOutlined />
                          <span>{post.commentCount || 0}</span>
                        </Space>
                      </Space>
                    </div>
                  </div>
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
              <Card style={{ borderRadius: '16px' }}>
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
                style={{ borderRadius: '16px' }}
                loading={!sidebarLoaded}
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
                        onClick={() => handleCategoryClick(category.slug)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.05)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent'
                        }}
                      >
                        <Text
                          style={{
                            color: selectedCategory === category.slug ? '#818cf8' : 'var(--foreground)',
                            opacity: selectedCategory === category.slug ? 1 : 0.7,
                            fontWeight: selectedCategory === category.slug ? 500 : 400,
                          }}
                        >
                          {category.name}
                        </Text>
                        <Text style={{ fontSize: '13px', color: 'var(--foreground)', opacity: 0.4 }}>
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
                style={{ borderRadius: '16px' }}
                loading={!sidebarLoaded}
              >
                {tags.length > 0 ? (
                  <Space wrap size="small">
                    {(showAllTags ? tags : tags.slice(0, 15)).map((tag) => (
                      <Tag
                        key={tag.id}
                        style={{
                          fontSize: '12px',
                          padding: '3px 10px',
                          background: selectedTag === tag.slug ? 'rgba(99, 102, 241, 0.8)' : undefined,
                          borderRadius: '4px',
                          color: selectedTag === tag.slug ? '#fff' : undefined,
                          border: selectedTag === tag.slug ? '1px solid #6366f1' : undefined,
                          cursor: 'pointer',
                          marginBottom: '8px',
                          transition: 'all 0.2s',
                        }}
                        onClick={() => handleTagClick(tag.slug)}
                      >
                        {tag.name} ({tag.count})
                      </Tag>
                    ))}
                    {tags.length > 15 && (
                      <Tag
                        style={{
                          fontSize: '12px',
                          padding: '3px 10px',
                          background: showAllTags ? 'rgba(255,255,255,0.05)' : 'rgba(99, 102, 241, 0.8)',
                          borderRadius: '4px',
                          color: showAllTags ? 'rgba(255,255,255,0.6)' : '#fff',
                          border: showAllTags ? '1px solid var(--border)' : '1px solid #6366f1',
                          cursor: 'pointer',
                          marginBottom: '8px',
                          transition: 'all 0.2s',
                          fontWeight: showAllTags ? 'normal' : '500',
                        }}
                        onClick={() => setShowAllTags(!showAllTags)}
                      >
                        {showAllTags ? '收起' : '更多'}
                      </Tag>
                    )}
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
                style={{ borderRadius: '16px' }}
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
                      borderRadius: '8px',
                      overflow: 'hidden',
                      flexShrink: 0,
                    }}>
                      <PostCoverImage
                        title={post.title}
                        summary={post.summary}
                        height={60}
                        gradient="linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
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
                      <Space size="small" style={{ fontSize: '12px', color: 'var(--foreground)', opacity: 0.4 }}>
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
