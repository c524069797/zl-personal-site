'use client'

import { useState, useEffect } from 'react'
import { Form, Input, Button, Avatar, Space, Typography, App } from 'antd'
import { UserOutlined, SendOutlined, HeartOutlined } from '@ant-design/icons'

const { TextArea } = Input
const { Title, Text } = Typography

interface CommentItem {
  id: string
  author: string
  email?: string
  website?: string
  content: string
  createdAt: string
}

interface CommentSectionProps {
  postSlug: string
}

export default function CommentSection({ postSlug }: CommentSectionProps) {
  const { message } = App.useApp()
  const [comments, setComments] = useState<CommentItem[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchComments()
  }, [postSlug])

  const fetchComments = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/posts/${postSlug}/comments`)
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments || [])
      }
    } catch (error) {
      // 错误已静默处理
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (values: any) => {
    setSubmitting(true)
    try {
      const response = await fetch(`/api/posts/${postSlug}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author: values.author,
          email: values.email,
          website: values.website,
          content: values.content,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        message.success(data.message || '评论已提交，等待审核')
        form.resetFields()
        // 刷新评论列表
        fetchComments()
      } else {
        message.error(data.error || '评论提交失败')
      }
    } catch (error) {
      message.error('评论提交失败，请稍后重试')
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return '今天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    } else if (days === 1) {
      return '昨天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    } else if (days < 7) {
      return `${days}天前`
    } else {
      return date.toLocaleDateString('zh-CN')
    }
  }

  return (
    <div style={{ marginTop: '48px' }}>
      <Title
        level={2}
        style={{
          fontSize: '24px',
          marginBottom: '24px',
          paddingBottom: '12px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        评论 ({comments.length})
      </Title>

      {/* 评论表单 */}
      <div
        style={{
          background: 'var(--background-light)',
          padding: '24px',
          borderRadius: '8px',
          marginBottom: '32px',
        }}
      >
        <Title level={3} style={{ fontSize: '20px', marginBottom: '24px' }}>
          发表评论
        </Title>
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="author"
            rules={[{ required: true, message: '请输入您的姓名' }]}
          >
            <Input placeholder="请输入您的姓名" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[{ type: 'email', message: '请输入有效的邮箱地址' }]}
          >
            <Input placeholder="邮箱（可选）" />
          </Form.Item>

          <Form.Item
            name="website"
          >
            <Input placeholder="网站（可选）" />
          </Form.Item>

          <Form.Item
            name="content"
            rules={[{ required: true, message: '请输入评论内容' }]}
          >
            <TextArea
              rows={6}
              placeholder="写下你的想法..."
              showCount
              maxLength={1000}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              icon={<SendOutlined />}
              style={{
                height: '40px',
                padding: '0 24px',
              }}
            >
              提交评论
            </Button>
          </Form.Item>
        </Form>
      </div>

      {/* 评论列表 */}
      <div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Text type="secondary">加载中...</Text>
          </div>
        ) : comments.length > 0 ? (
          comments.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                padding: '24px 0',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <Avatar
                size={48}
                icon={<UserOutlined />}
                style={{
                  marginRight: '16px',
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '8px',
                  }}
                >
                  <Text strong style={{ marginRight: '16px', fontSize: '16px' }}>
                    {item.author}
                  </Text>
                  <Text type="secondary" style={{ fontSize: '14px' }}>
                    {formatTime(item.createdAt)}
                  </Text>
                </div>
                <div
                  style={{
                    marginBottom: '12px',
                    color: 'var(--foreground)',
                    lineHeight: '1.6',
                  }}
                >
                  {item.content}
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: '24px',
                  }}
                >
                  <a
                    href="#"
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '14px',
                      textDecoration: 'none',
                      transition: 'color 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--primary-color)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-secondary)'
                    }}
                  >
                    <HeartOutlined style={{ marginRight: '4px' }} />
                    赞 (0)
                  </a>
                  <a
                    href="#"
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '14px',
                      textDecoration: 'none',
                      transition: 'color 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--primary-color)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-secondary)'
                    }}
                  >
                    回复
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Text type="secondary">暂无评论，快来发表第一条评论吧！</Text>
          </div>
        )}
      </div>
    </div>
  )
}

