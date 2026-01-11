'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Layout, Input, Button, Space, Typography, Spin, Card, Select, Modal, Form, List, Popconfirm, message } from 'antd'
import { SendOutlined, RobotOutlined, SettingOutlined, PlusOutlined, DeleteOutlined, MessageOutlined } from '@ant-design/icons'
import Navigation from '@/components/Navigation'
import { useTranslation } from '@/hooks/useTranslation'


const { Content, Sider } = Layout
const { TextArea } = Input
const { Text, Paragraph } = Typography

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
}

interface AISetting {
  id: string
  name: string
  baseUrl: string
}

export default function AIChatPage() {
  const { t } = useTranslation()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConvId, setActiveConvId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settings, setSettings] = useState<AISetting[]>([])
  const [selectedSetting, setSelectedSetting] = useState<string>('')
  const [models, setModels] = useState<string[]>([])
  const [selectedModel, setSelectedModel] = useState<string>('')
  const [form] = Form.useForm()
  const [editingId, setEditingId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeConv = conversations.find((c) => c.id === activeConvId)

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/ai-settings')
      if (res.ok) {
        const data = await res.json()
        setSettings(data)
        if (data.length > 0 && !selectedSetting) {
          setSelectedSetting(data[0].id)
        }
      }
    } catch { /* ignore */ }
  }, [selectedSetting])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConv?.messages])

  const fetchModels = useCallback(async () => {
    if (!selectedSetting) return
    try {
      const res = await fetch(`/api/ai-settings/models?settingId=${selectedSetting}`)
      if (res.ok) {
        const data = await res.json()
        setModels(data.models || [])
        if (data.models?.length > 0) setSelectedModel(data.models[0])
      }
    } catch { /* ignore */ }
  }, [selectedSetting])

  useEffect(() => {
    fetchModels()
  }, [fetchModels])

  const createConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: `对话 ${conversations.length + 1}`,
      messages: [],
    }
    setConversations((prev) => [newConv, ...prev])
    setActiveConvId(newConv.id)
  }

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id))
    if (activeConvId === id) {
      setActiveConvId(conversations.find((c) => c.id !== id)?.id || null)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || loading || !activeConvId || !selectedSetting || !selectedModel) return

    const userMessage: Message = { role: 'user', content: input.trim() }
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? { ...c, messages: [...c.messages, userMessage], title: c.messages.length === 0 ? input.trim().slice(0, 20) : c.title }
          : c
      )
    )
    setInput('')
    setLoading(true)

    try {
      const conv = conversations.find((c) => c.id === activeConvId)
      const allMessages = [...(conv?.messages || []), userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settingId: selectedSetting, model: selectedModel, messages: allMessages }),
      })

      const data = await response.json()
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.ok ? data.content : (data.error || t('ai.chat.error')),
      }
      setConversations((prev) =>
        prev.map((c) => (c.id === activeConvId ? { ...c, messages: [...c.messages, assistantMessage] } : c))
      )
    } catch {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId ? { ...c, messages: [...c.messages, { role: 'assistant', content: t('ai.chat.networkError') }] } : c
        )
      )
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSaveSetting = async () => {
    const values = await form.validateFields()
    const res = await fetch('/api/ai-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, id: editingId }),
    })
    if (res.ok) {
      message.success('保存成功')
      form.resetFields()
      setEditingId(null)
      fetchSettings()
    }
  }

  const handleDeleteSetting = async (id: string) => {
    await fetch('/api/ai-settings', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    fetchSettings()
  }

  return (
    <>
      <Navigation />
      <Layout className="min-h-screen" style={{ background: 'var(--background)' }}>
        <Sider width={260} style={{ background: 'var(--background)', borderRight: '1px solid var(--border)', padding: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} block onClick={createConversation} style={{ marginBottom: 16 }}>
            新对话
          </Button>
          <List
            dataSource={conversations}
            renderItem={(conv) => (
              <List.Item
                style={{
                  cursor: 'pointer',
                  background: conv.id === activeConvId ? 'var(--border)' : 'transparent',
                  padding: '8px 12px',
                  borderRadius: 6,
                  marginBottom: 4,
                }}
                onClick={() => setActiveConvId(conv.id)}
                actions={[
                  <Popconfirm key="del" title="删除此对话？" onConfirm={() => deleteConversation(conv.id)}>
                    <DeleteOutlined onClick={(e) => e.stopPropagation()} />
                  </Popconfirm>,
                ]}
              >
                <Space>
                  <MessageOutlined />
                  <Text ellipsis style={{ maxWidth: 140 }}>{conv.title}</Text>
                </Space>
              </List.Item>
            )}
          />
          <Button icon={<SettingOutlined />} block style={{ marginTop: 16 }} onClick={() => setSettingsOpen(true)}>
            AI 设置
          </Button>
        </Sider>

        <Content style={{ padding: 24, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <RobotOutlined style={{ fontSize: 24 }} />
            <Text strong style={{ fontSize: 18 }}>{t('ai.chat.title')}</Text>
            <Select
              value={selectedSetting}
              onChange={(v) => { setSelectedSetting(v); setModels([]); setSelectedModel('') }}
              options={settings.map((s) => ({ value: s.id, label: s.name }))}
              style={{ width: 140, marginLeft: 'auto' }}
              placeholder="选择配置"
            />
            <Select
              value={selectedModel}
              onChange={setSelectedModel}
              options={models.map((m) => ({ value: m, label: m }))}
              style={{ width: 180 }}
              placeholder="选择模型"
            />
          </div>

          <Card style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 16 }}>
              {!activeConv ? (
                <div style={{ textAlign: 'center', color: 'var(--foreground)', opacity: 0.5, marginTop: 100 }}>
                  点击左侧&ldquo;新对话&rdquo;开始聊天
                </div>
              ) : activeConv.messages.length === 0 ? (
                <Card style={{ background: 'var(--background)' }}>
                  <Paragraph type="secondary" style={{ margin: 0 }}>
                    {t('ai.chat.welcome')}<br />
                    {t('ai.chat.examples')}<br />
                    • {t('ai.chat.example1')}<br />
                    • {t('ai.chat.example2')}
                  </Paragraph>
                </Card>
              ) : (
                activeConv.messages.map((msg, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    <Card style={{ maxWidth: '80%', background: 'var(--background)', border: '1px solid var(--border)' }}>
                      <Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.content}</Paragraph>
                    </Card>
                  </div>
                ))
              )}
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <Card><Spin size="small" /></Card>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <Space.Compact style={{ width: '100%' }}>
              <TextArea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('ai.chat.placeholder')}
                autoSize={{ minRows: 1, maxRows: 4 }}
                disabled={loading || !activeConvId}
                style={{ flex: 1 }}
              />
              <Button type="primary" icon={<SendOutlined />} onClick={handleSend} loading={loading} disabled={!input.trim() || !activeConvId}>
                {t('ai.chat.send')}
              </Button>
            </Space.Compact>
          </Card>
        </Content>
      </Layout>

      <Modal title="AI 设置" open={settingsOpen} onCancel={() => setSettingsOpen(false)} footer={null} width={600}>
        <Form form={form} layout="vertical" onFinish={handleSaveSetting}>
          <Form.Item name="name" label="配置名称" rules={[{ required: true }]}>
            <Input placeholder="例如：OpenAI、DeepSeek" />
          </Form.Item>
          <Form.Item name="baseUrl" label="中转 URL" rules={[{ required: true }]}>
            <Input placeholder="https://api.openai.com/v1" />
          </Form.Item>
          <Form.Item name="apiKey" label="API Key" rules={[{ required: !editingId }]}>
            <Input.Password placeholder={editingId ? '留空则不修改' : 'sk-xxx'} />
          </Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">保存</Button>
            {editingId && <Button onClick={() => { setEditingId(null); form.resetFields() }}>取消编辑</Button>}
          </Space>
        </Form>

        <List
          style={{ marginTop: 24 }}
          header={<Text strong>已保存的配置</Text>}
          dataSource={settings}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button key="edit" size="small" onClick={() => { setEditingId(item.id); form.setFieldsValue(item) }}>编辑</Button>,
                <Popconfirm key="del" title="确定删除？" onConfirm={() => handleDeleteSetting(item.id)}>
                  <Button size="small" danger>删除</Button>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta title={item.name} description={item.baseUrl} />
            </List.Item>
          )}
        />
      </Modal>
    </>
  )
}
