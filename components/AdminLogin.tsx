'use client'

import { useState } from 'react'
import { Modal, Form, Input, Button, message } from 'antd'
import { LoginOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'

interface AdminLoginProps {
  open: boolean
  onClose: () => void
}

export default function AdminLogin({ open, onClose }: AdminLoginProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (!response.ok) {
        message.error(data.error || '登录失败')
        setLoading(false)
        return
      }

      // 检查是否是管理员
      if (data.user.role !== 'admin') {
        message.error('需要管理员权限')
        setLoading(false)
        return
      }

      // 保存 token 到 localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      // 触发自定义事件，通知导航栏更新
      window.dispatchEvent(new Event('auth-change'))

      message.success('登录成功')
      form.resetFields()
      onClose()

      // 跳转到管理员界面
      router.push('/admin')
    } catch (err) {
      message.error('登录失败，请稍后重试')
      setLoading(false)
    }
  }

  return (
    <Modal
      title="管理员登录"
      open={open}
      onCancel={onClose}
      footer={null}
      width={400}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' },
          ]}
        >
          <Input placeholder="your@email.com" />
        </Form.Item>

        <Form.Item
          name="password"
          label="密码"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password placeholder="••••••••" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            icon={<LoginOutlined />}
          >
            登录
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

