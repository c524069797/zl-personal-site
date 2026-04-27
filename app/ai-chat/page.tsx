'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Layout, Input, Button, Space, Typography, Spin, Card, Select, Modal, Form, List, Popconfirm, message } from 'antd'
import { SendOutlined, RobotOutlined, PlusOutlined, DeleteOutlined, MessageOutlined } from '@ant-design/icons'
import Navigation from '@/components/Navigation'
import { useTranslation } from '@/hooks/useTranslation'
import ReactMarkdown from 'react-markdown'


const { Content, Sider } = Layout
const { TextArea } = Input
const { Text, Paragraph, Title } = Typography

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: number // 添加创建时间戳
}

interface AISetting {
  id: string
  name: string
  baseUrl: string
}

// 缓存配置
const CACHE_KEY = 'ai-chat-conversations'
const CACHE_DURATION = 5 * 60 * 1000 // 5分钟

// 从localStorage加载对话（过滤过期的）
function loadCachedConversations(): Conversation[] {
  if (typeof window === 'undefined') return []

  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return []

    const data = JSON.parse(cached) as Conversation[]
    const now = Date.now()

    // 过滤掉超过5分钟的对话
    return data.filter(conv => now - conv.createdAt < CACHE_DURATION)
  } catch {
    return []
  }
}

// 保存对话到localStorage
function saveCachedConversations(conversations: Conversation[]) {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(conversations))
  } catch { /* ignore */ }
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

  // 加载缓存的对话
  useEffect(() => {
    const cached = loadCachedConversations()
    if (cached.length) {
      setConversations(cached)
      setActiveConvId(cached[0].id)
    }
  }, [])

  // 保存对话到缓存
  useEffect(() => {
    if (conversations.length) {
      saveCachedConversations(conversations)
    }
  }, [conversations])

  const fetchModels = useCallback(async () => {
    try {
      const query = selectedSetting ? `?settingId=${selectedSetting}` : ''
      const res = await fetch(`/api/ai-settings/models${query}`)
      if (res.ok) {
        const data = await res.json()
        setModels(data.models || [])
        if (data.models?.length > 0 && !selectedModel) {
          setSelectedModel(data.models[0])
        }
      }
    } catch { /* ignore */ }
  }, [selectedSetting, selectedModel])

  useEffect(() => {
    fetchModels()
  }, [fetchModels])

  const createConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: `对话 ${conversations.length + 1}`,
      messages: [],
      createdAt: Date.now(),
    }
    setConversations(prev => [newConv, ...prev])
    setActiveConvId(newConv.id)
  }

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id))
    if (activeConvId === id) {
      setActiveConvId(conversations.find((c) => c.id !== id)?.id || null)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || loading || !activeConvId) return

    // 博客问答模式：不需要选择配置，直接使用内置DeepSeek
    const isBlogMode = selectedSetting === 'blog-qa'

    // 普通AI模式需要选择配置和模型
    if (!isBlogMode && (!selectedSetting || !selectedModel)) return

    const userMessage: Message = { role: 'user', content: input.trim() }
    setConversations(prev =>
      prev.map(c =>
        c.id === activeConvId
          ? { ...c, messages: [...c.messages, userMessage], title: !c.messages.length ? input.trim().slice(0, 20) : c.title }
          : c
      )
    )
    setInput('')
    setLoading(true)

    try {
      let assistantContent = ''
      let sources: Array<{ title: string; slug: string }> = []

      if (isBlogMode) {
        // 博客问答模式：调用RAG接口查询数据库
        const response = await fetch('/api/rag/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: userMessage.content }),
        })

        const data = await response.json()
        if (response.ok) {
          assistantContent = data.answer || '抱歉，我无法回答这个问题。'
          sources = data.sources || []
          // 如果有来源，添加到回答中
          if (sources.length) {
            assistantContent += '\n\n📚 相关文章：\n' + sources.map(s => `• ${s.title}`).join('\n')
          }
        } else {
          assistantContent = data.error || t('ai.chat.error')
        }
      } else {
        // 普通AI模式：调用自定义配置的API
        const conv = conversations.find(c => c.id === activeConvId)
        const allMessages = [...(conv?.messages || []), userMessage].map(m => ({
          role: m.role,
          content: m.content,
        }))

        const response = await fetch('/api/ai-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ settingId: selectedSetting, model: selectedModel, messages: allMessages }),
        })

        const data = await response.json()
        assistantContent = response.ok ? data.content : (data.error || t('ai.chat.error'))
      }

      const assistantMessage: Message = { role: 'assistant', content: assistantContent }
      setConversations(prev =>
        prev.map(c => (c.id === activeConvId ? { ...c, messages: [...c.messages, assistantMessage] } : c))
      )
    } catch {
      setConversations(prev =>
        prev.map(c =>
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

        </Sider>

        <Content style={{ padding: 24, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
          {/* 缓存提示条 */}
          <div style={{
            background: 'linear-gradient(90deg, #2563eb15, #3b82f615)',
            borderRadius: 8,
            padding: '8px 16px',
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 13,
            color: 'var(--text-secondary)',
          }}>
            💡 对话记录仅缓存在浏览器中，5分钟后自动清除
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <RobotOutlined style={{ fontSize: 24 }} />
            <Text strong style={{ fontSize: 18 }}>{t('ai.chat.title')}</Text>
            <Select
              value={selectedSetting}
              onChange={v => { setSelectedSetting(v); setModels([]); setSelectedModel('') }}
              options={[
                { value: 'blog-qa', label: '📚 博客问答（内置）' },
                ...settings.map(s => ({ value: s.id, label: s.name }))
              ]}
              style={{ width: 180, marginLeft: 'auto' }}
              placeholder="选择配置"
            />
            {selectedSetting !== 'blog-qa' && (
              <Select
                value={selectedModel}
                onChange={setSelectedModel}
                options={models.map(m => ({ value: m, label: m }))}
                style={{ width: 180 }}
                placeholder="选择模型"
              />
            )}
          </div>

          <Card style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 16 }}>
              {!activeConv ? (
                <div style={{ textAlign: 'center', color: 'var(--foreground)', opacity: 0.5, marginTop: 100 }}>
                  点击左侧&ldquo;新对话&rdquo;开始聊天
                </div>
              ) : activeConv.messages.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '40px' }}>
                   <Title level={3} style={{ marginBottom: '24px' }}>{t('ai.chat.welcome')}</Title>
                   <Paragraph type="secondary" style={{ marginBottom: '24px' }}>{t('ai.chat.examples')}</Paragraph>
                   <Space wrap style={{ justifyContent: 'center' }}>
                     {[t('ai.chat.example1'), t('ai.chat.example2')].map((example, i) => (
                       <Button 
                         key={i} 
                         onClick={() => {
                           // Set input and maybe auto-send? Let's just set input for now as per standard UX, or auto-send if desired.
                           // Actually, let's just set input.
                           setInput(example)
                         }}
                         shape="round"
                       >
                         {example}
                       </Button>
                     ))}
                   </Space>
                </div>
              ) : (
                activeConv.messages.map((msg, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    <Card style={{ maxWidth: '80%', background: 'var(--background)', border: '1px solid var(--border)' }}>
                      {msg.role === 'assistant' ? (
                        <div className="markdown-content">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.content}</Paragraph>
                      )}
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
