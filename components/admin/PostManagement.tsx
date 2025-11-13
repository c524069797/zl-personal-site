'use client'

import { useState, useEffect } from 'react'
import { Table, Button, Tag, Space, message, Popconfirm, Card, Input, Modal, Form, Input as AntInput, DatePicker, Switch, ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { EditOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons'
import { getAuthHeaders } from '@/lib/client-auth'
import type { ColumnsType } from 'antd/es/table'
import Link from 'next/link'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

const { Search } = Input
const { TextArea } = AntInput

interface PostTag {
  id: string
  name: string
  slug: string
}

interface Post {
  id: string
  slug: string
  title: string
  content: string
  summary: string | null
  date: string
  published: boolean
  tags: PostTag[]
  author: {
    id: string
    name: string | null
    email: string
  }
}

export default function PostManagement() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [form] = Form.useForm()

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchText) {
        params.append('search', searchText)
      }
      const response = await fetch(`/api/admin/posts?${params.toString()}`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error('获取文章失败')
      }

      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      message.error('获取文章失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [searchText])

  const handleCreate = () => {
    setEditingPost(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEdit = async (post: Post) => {
    try {
      setLoading(true)
      // 获取完整的文章数据
      const response = await fetch(`/api/admin/posts/${post.id}`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error('获取文章详情失败')
      }

      const data = await response.json()
      const fullPost = data.post

      setEditingPost(fullPost)
      form.setFieldsValue({
        title: fullPost.title,
        content: fullPost.content,
        summary: fullPost.summary || '',
        slug: fullPost.slug,
        tags: fullPost.tags.map((t: PostTag) => t.name).join(', '),
        published: fullPost.published,
        date: fullPost.date ? dayjs(fullPost.date) : dayjs(),
      })
      setIsModalOpen(true)
    } catch (error) {
      message.error('获取文章详情失败')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error('删除失败')
      }

      message.success('文章已删除')
      fetchPosts()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const tags = values.tags
        ? values.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
        : []

      const payload = {
        title: values.title,
        content: values.content,
        summary: values.summary,
        slug: values.slug,
        tags,
        published: values.published,
        date: values.date ? values.date.toISOString() : new Date().toISOString(),
      }

      const url = editingPost
        ? `/api/admin/posts/${editingPost.id}`
        : '/api/admin/posts'
      const method = editingPost ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(editingPost ? '更新失败' : '创建失败')
      }

      message.success(editingPost ? '文章已更新' : '文章已创建')
      setIsModalOpen(false)
      setEditingPost(null)
      form.resetFields()
      fetchPosts()
    } catch (error: any) {
      if (error.errorFields) {
        return
      }
      message.error(error.message || '操作失败')
    }
  }

  const columns: ColumnsType<Post> = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '作者',
      key: 'author',
      width: 150,
      render: (_, record) => record.author.name || record.author.email,
    },
    {
      title: '标签',
      key: 'tags',
      width: 200,
      render: (_, record) => (
        <Space wrap>
          {record.tags.map((tag) => (
            <Tag key={tag.id}>{tag.name}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'published',
      key: 'published',
      width: 100,
      render: (published: boolean) => (
        <Tag color={published ? 'green' : 'default'}>
          {published ? '已发布' : '草稿'}
        </Tag>
      ),
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 180,
      render: (date: string) => new Date(date).toLocaleDateString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small" wrap>
          <Link href={`/blog/${record.slug}`} target="_blank">
            <Button size="small" icon={<EyeOutlined />} type="link">
              查看
            </Button>
          </Link>
          <Button
            size="small"
            icon={<EditOutlined />}
            type="link"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这篇文章吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              type="link"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <>
      <Card
        title="文章管理"
        extra={
          <Space>
            <Search
              placeholder="搜索文章"
              allowClear
              style={{ width: 200 }}
              onSearch={setSearchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              新建文章
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchPosts}
            >
              刷新
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={posts}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      <Modal
        title={editingPost ? '编辑文章' : '新建文章'}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false)
          setEditingPost(null)
          form.resetFields()
        }}
        afterClose={() => {
          setEditingPost(null)
          form.resetFields()
        }}
        width={800}
        okText="保存"
        cancelText="取消"
      >
        <ConfigProvider locale={zhCN}>
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              published: false,
              date: dayjs(),
            }}
          >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <AntInput placeholder="文章标题" />
          </Form.Item>

          <Form.Item
            name="slug"
            label="URL Slug"
            rules={[{ required: true, message: '请输入 URL Slug' }]}
          >
            <AntInput placeholder="url-slug" />
          </Form.Item>

          <Form.Item
            name="summary"
            label="摘要"
          >
            <TextArea rows={3} placeholder="文章摘要（可选）" />
          </Form.Item>

          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <TextArea rows={15} placeholder="文章内容（Markdown 格式）" />
          </Form.Item>

          <Form.Item
            name="tags"
            label="标签"
          >
            <AntInput placeholder="标签，用逗号分隔，例如：React, Next.js, TypeScript" />
          </Form.Item>

          <Form.Item
            name="date"
            label="发布日期"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="published"
            label="发布状态"
            valuePropName="checked"
          >
            <Switch checkedChildren="已发布" unCheckedChildren="草稿" />
          </Form.Item>
        </Form>
        </ConfigProvider>
      </Modal>
    </>
  )
}

