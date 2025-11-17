'use client'

import { useState, useEffect } from 'react'
import { Table, Button, Tag, Space, message, Popconfirm, Card, Tabs, Input } from 'antd'
import { CheckOutlined, CloseOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
import { getAuthHeaders } from '@/lib/client-auth'
import type { ColumnsType } from 'antd/es/table'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

const { Search } = Input
const { TabPane } = Tabs

interface Comment {
  id: string
  author: string
  email: string | null
  website: string | null
  content: string
  approved: boolean
  createdAt: string
  post: {
    id: string
    slug: string
    title: string
  }
}

export default function CommentManagement() {
  const { t } = useTranslation()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('pending')
  const [searchText, setSearchText] = useState('')

  const fetchComments = async (approved?: boolean) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (approved !== undefined) {
        params.append('approved', approved.toString())
      }
      const response = await fetch(`/api/admin/comments?${params.toString()}`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(t('admin.messages.fetchCommentsFailed'))
      }

      const data = await response.json()
      setComments(data.comments || [])
    } catch (error) {
      message.error(t('admin.messages.fetchCommentsFailed'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const approved = activeTab === 'approved'
    fetchComments(approved)
  }, [activeTab])

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/comments/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ approved: true }),
      })

      if (!response.ok) {
        throw new Error(t('admin.messages.approveFailed'))
      }

      message.success(t('admin.messages.commentApproved'))
      fetchComments(activeTab === 'approved')
    } catch (error) {
      message.error(t('admin.messages.approveFailed'))
    }
  }

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/comments/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ approved: false }),
      })

      if (!response.ok) {
        throw new Error(t('admin.messages.operationFailed'))
      }

      message.success(t('admin.messages.commentRejected'))
      fetchComments(activeTab === 'approved')
    } catch (error) {
      message.error(t('admin.messages.operationFailed'))
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/comments/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(t('admin.messages.deleteFailed'))
      }

      message.success(t('admin.messages.commentDeleted'))
      fetchComments(activeTab === 'approved')
    } catch (error) {
      message.error(t('admin.messages.deleteFailed'))
    }
  }

  const filteredComments = comments.filter((comment) => {
    if (!searchText) return true
    const searchLower = searchText.toLowerCase()
    return (
      comment.author.toLowerCase().includes(searchLower) ||
      comment.content.toLowerCase().includes(searchLower) ||
      comment.post.title.toLowerCase().includes(searchLower)
    )
  })

  const columns: ColumnsType<Comment> = [
    {
      title: t('admin.columns.author'),
      dataIndex: 'author',
      key: 'author',
      width: 120,
    },
    {
      title: t('admin.columns.content'),
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (text: string) => (
        <div style={{ maxWidth: 300 }}>{text}</div>
      ),
    },
    {
      title: t('admin.columns.post'),
      key: 'post',
      width: 200,
      render: (_, record) => (
        <Link href={`/blog/${record.post.slug}`} target="_blank">
          {record.post.title}
        </Link>
      ),
    },
    {
      title: t('admin.columns.status'),
      dataIndex: 'approved',
      key: 'approved',
      width: 100,
      render: (approved: boolean) => (
        <Tag color={approved ? 'green' : 'orange'}>
          {approved ? t('admin.status.approved') : t('admin.status.pending')}
        </Tag>
      ),
    },
    {
      title: t('admin.columns.time'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: t('admin.columns.action'),
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          {!record.approved && (
            <Button
              type="primary"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => handleApprove(record.id)}
            >
              {t('admin.actions.approve')}
            </Button>
          )}
          {record.approved && (
            <Button
              size="small"
              icon={<CloseOutlined />}
              onClick={() => handleReject(record.id)}
            >
              {t('admin.actions.reject')}
            </Button>
          )}
          <Popconfirm
            title={t('admin.confirm.deleteComment')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('admin.actions.confirm')}
            cancelText={t('admin.actions.cancel')}
          >
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              {t('admin.actions.delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Card
      title={t('admin.commentManagement')}
      extra={
        <Space>
          <Search
            placeholder={t('admin.searchComments')}
            allowClear
            style={{ width: 200 }}
            onSearch={setSearchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={() => fetchComments(activeTab === 'approved')}
          >
            {t('admin.refresh')}
          </Button>
        </Space>
      }
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab={t('admin.pendingReview')} key="pending">
          <Table
            columns={columns}
            dataSource={filteredComments.filter((c) => !c.approved)}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `${t('admin.pagination.total')} ${total} ${t('admin.pagination.items')}`,
            }}
          />
        </TabPane>
        <TabPane tab={t('admin.approved')} key="approved">
          <Table
            columns={columns}
            dataSource={filteredComments.filter((c) => c.approved)}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `${t('admin.pagination.total')} ${total} ${t('admin.pagination.items')}`,
            }}
          />
        </TabPane>
      </Tabs>
    </Card>
  )
}

