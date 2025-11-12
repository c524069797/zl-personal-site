'use client'

import { useState, useEffect } from 'react'
import { Form, Input, Button, List, Avatar, Card, Space, Typography, App } from 'antd'
import { UserOutlined, SendOutlined } from '@ant-design/icons'

const { TextArea } = Input
const { Text } = Typography

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
      console.error('获取评论失败:', error)
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

  return (
    <div style={{ marginTop: '48px' }}>
      <h3 style={{
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '24px',
        color: 'var(--foreground)',
      }}>
        评论 ({comments.length})
      </h3>

      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        style={{ marginBottom: '32px' }}
      >
        <Form.Item
          name="author"
          label="姓名"
          rules={[{ required: true, message: '请输入您的姓名' }]}
        >
          <Input placeholder="请输入您的姓名" />
        </Form.Item>

        <Form.Item
          name="email"
          label="邮箱（可选）"
          rules={[{ type: 'email', message: '请输入有效的邮箱地址' }]}
        >
          <Input placeholder="your@email.com" />
        </Form.Item>

        <Form.Item
          name="website"
          label="网站（可选）"
        >
          <Input placeholder="https://yourwebsite.com" />
        </Form.Item>

        <Form.Item
          name="content"
          label="评论内容"
          rules={[{ required: true, message: '请输入评论内容' }]}
        >
          <TextArea
            rows={4}
            placeholder="写下您的评论..."
            showCount
            maxLength={1000}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            icon={<SendOutlined />}
          >
            提交评论
          </Button>
        </Form.Item>
      </Form>

      <List
        loading={loading}
        dataSource={comments}
        itemLayout="horizontal"
        renderItem={(item) => (
          <List.Item>
            <Card
              style={{
                width: '100%',
                border: '1px solid var(--border)',
                background: 'var(--background)',
              }}
              bodyStyle={{ padding: '16px' }}
            >
              <Space align="start" style={{ width: '100%' }}>
                <Avatar icon={<UserOutlined />} />
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong style={{ color: 'var(--foreground)', marginRight: '12px' }}>
                      {item.author}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {new Date(item.createdAt).toLocaleString('zh-CN')}
                    </Text>
                  </div>
                  <div style={{ color: 'var(--foreground)', lineHeight: '1.6' }}>
                    {item.content}
                  </div>
                </div>
              </Space>
            </Card>
          </List.Item>
        )}
      />
    </div>
  )
}

