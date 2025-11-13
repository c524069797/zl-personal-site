'use client'

import { useState, useEffect } from 'react'
import { Table, Button, Tag, Space, message, Popconfirm, Card, Tabs, Input } from 'antd'
import { CheckOutlined, CloseOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
import { getAuthHeaders } from '@/lib/client-auth'
import type { ColumnsType } from 'antd/es/table'
import Link from 'next/link'

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
        throw new Error('获取评论失败')
      }

      const data = await response.json()
      setComments(data.comments || [])
    } catch (error) {
      message.error('获取评论失败')
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
        throw new Error('审批失败')
      }

      message.success('评论已通过审核')
      fetchComments(activeTab === 'approved')
    } catch (error) {
      message.error('审批失败')
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
        throw new Error('操作失败')
      }

      message.success('评论已拒绝')
      fetchComments(activeTab === 'approved')
    } catch (error) {
      message.error('操作失败')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/comments/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error('删除失败')
      }

      message.success('评论已删除')
      fetchComments(activeTab === 'approved')
    } catch (error) {
      message.error('删除失败')
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
      title: '作者',
      dataIndex: 'author',
      key: 'author',
      width: 120,
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (text: string) => (
        <div style={{ maxWidth: 300 }}>{text}</div>
      ),
    },
    {
      title: '文章',
      key: 'post',
      width: 200,
      render: (_, record) => (
        <Link href={`/blog/${record.post.slug}`} target="_blank">
          {record.post.title}
        </Link>
      ),
    },
    {
      title: '状态',
      dataIndex: 'approved',
      key: 'approved',
      width: 100,
      render: (approved: boolean) => (
        <Tag color={approved ? 'green' : 'orange'}>
          {approved ? '已审核' : '待审核'}
        </Tag>
      ),
    },
    {
      title: '时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
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
              通过
            </Button>
          )}
          {record.approved && (
            <Button
              size="small"
              icon={<CloseOutlined />}
              onClick={() => handleReject(record.id)}
            >
              拒绝
            </Button>
          )}
          <Popconfirm
            title="确定要删除这条评论吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Card
      title="评论管理"
      extra={
        <Space>
          <Search
            placeholder="搜索评论"
            allowClear
            style={{ width: 200 }}
            onSearch={setSearchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={() => fetchComments(activeTab === 'approved')}
          >
            刷新
          </Button>
        </Space>
      }
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="待审核" key="pending">
          <Table
            columns={columns}
            dataSource={filteredComments.filter((c) => !c.approved)}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条`,
            }}
          />
        </TabPane>
        <TabPane tab="已审核" key="approved">
          <Table
            columns={columns}
            dataSource={filteredComments.filter((c) => c.approved)}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条`,
            }}
          />
        </TabPane>
      </Tabs>
    </Card>
  )
}

