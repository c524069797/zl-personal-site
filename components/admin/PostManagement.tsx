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
import { useTranslation } from '@/hooks/useTranslation'

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
  const { t } = useTranslation()
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
        throw new Error(t('admin.messages.fetchPostsFailed'))
      }

      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      message.error(t('admin.messages.fetchPostsFailed'))
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
        throw new Error(t('admin.messages.fetchPostDetailFailed'))
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
      message.error(t('admin.messages.fetchPostDetailFailed'))
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
        throw new Error(t('admin.messages.deleteFailed'))
      }

      message.success(t('admin.messages.postDeleted'))
      fetchPosts()
    } catch (error) {
      message.error(t('admin.messages.deleteFailed'))
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
        throw new Error(editingPost ? t('admin.messages.updateFailed') : t('admin.messages.createFailed'))
      }

      message.success(editingPost ? t('admin.messages.postUpdated') : t('admin.messages.postCreated'))
      setIsModalOpen(false)
      setEditingPost(null)
      form.resetFields()
      fetchPosts()
    } catch (error: any) {
      if (error.errorFields) {
        return
      }
      message.error(error.message || t('admin.messages.operationFailed'))
    }
  }

  const columns: ColumnsType<Post> = [
    {
      title: t('admin.columns.title'),
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: t('admin.columns.author'),
      key: 'author',
      width: 150,
      render: (_, record) => record.author.name || record.author.email,
    },
    {
      title: t('admin.columns.tags'),
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
      title: t('admin.columns.status'),
      dataIndex: 'published',
      key: 'published',
      width: 100,
      render: (published: boolean) => (
        <Tag color={published ? 'green' : 'default'}>
          {published ? t('admin.status.published') : t('admin.status.draft')}
        </Tag>
      ),
    },
    {
      title: t('admin.columns.date'),
      dataIndex: 'date',
      key: 'date',
      width: 180,
      render: (date: string) => new Date(date).toLocaleDateString('zh-CN'),
    },
    {
      title: t('admin.columns.action'),
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small" wrap>
          <Link href={`/blog/${record.slug}`} target="_blank">
            <Button size="small" icon={<EyeOutlined />} type="link">
              {t('admin.actions.view')}
            </Button>
          </Link>
          <Button
            size="small"
            icon={<EditOutlined />}
            type="link"
            onClick={() => handleEdit(record)}
          >
            {t('admin.actions.edit')}
          </Button>
          <Popconfirm
            title={t('admin.confirm.deletePost')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('admin.actions.confirm')}
            cancelText={t('admin.actions.cancel')}
          >
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              type="link"
            >
              {t('admin.actions.delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <>
      <Card
        title={t('admin.postManagement')}
        extra={
          <Space>
            <Search
              placeholder={t('admin.searchPosts')}
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
              {t('admin.newPost')}
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchPosts}
            >
              {t('admin.refresh')}
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
            showTotal: (total) => `${t('admin.pagination.total')} ${total} ${t('admin.pagination.items')}`,
          }}
        />
      </Card>

      <Modal
        title={editingPost ? t('admin.editPost') : t('admin.newPost')}
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
        okText={t('admin.actions.save')}
        cancelText={t('admin.actions.cancel')}
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
            label={t('admin.form.title')}
            rules={[{ required: true, message: t('admin.form.titleRequired') }]}
          >
            <AntInput placeholder={t('admin.form.titlePlaceholder')} />
          </Form.Item>

          <Form.Item
            name="slug"
            label={t('admin.form.urlSlug')}
            rules={[{ required: true, message: t('admin.form.slugRequired') }]}
          >
            <AntInput placeholder={t('admin.form.slugPlaceholder')} />
          </Form.Item>

          <Form.Item
            name="summary"
            label={t('admin.form.summary')}
          >
            <TextArea rows={3} placeholder={t('admin.form.summaryPlaceholder')} />
          </Form.Item>

          <Form.Item
            name="content"
            label={t('admin.form.content')}
            rules={[{ required: true, message: t('admin.form.contentRequired') }]}
          >
            <TextArea rows={15} placeholder={t('admin.form.contentPlaceholder')} />
          </Form.Item>

          <Form.Item
            name="tags"
            label={t('admin.form.tags')}
          >
            <AntInput placeholder={t('admin.form.tagsPlaceholder')} />
          </Form.Item>

          <Form.Item
            name="date"
            label={t('admin.form.publishDate')}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="published"
            label={t('admin.form.publishStatus')}
            valuePropName="checked"
          >
            <Switch checkedChildren={t('admin.status.published')} unCheckedChildren={t('admin.status.draft')} />
          </Form.Item>
        </Form>
        </ConfigProvider>
      </Modal>
    </>
  )
}

