'use client'

import { useState, useRef, useEffect } from 'react'
import { FloatButton, Drawer, Input, Button, Space, Typography, Spin, Card } from 'antd'
import { MessageOutlined, SendOutlined, CloseOutlined } from '@ant-design/icons'
import { useTranslation } from '@/hooks/useTranslation'

const { TextArea } = Input
const { Text, Paragraph } = Typography

interface Message {
  role: 'user' | 'assistant'
  content: string
  sources?: Array<{ title: string; slug: string }>
}

export default function AIChatBot() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/rag/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userMessage.content,
          provider: 'deepseek' // 明确使用 DeepSeek 模型
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.answer,
          sources: data.sources || [],
        }
        setMessages((prev) => [...prev, assistantMessage])
      } else {
        const errorMessage: Message = {
          role: 'assistant',
          content: data.error || t('ai.chat.error'),
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: t('ai.chat.networkError'),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <FloatButton
        icon={<MessageOutlined />}
        type="primary"
        style={{
          right: 24,
          bottom: 24,
        }}
        onClick={() => setOpen(true)}
        tooltip={<div>{t('ai.chat.title')}</div>}
      />

      <Drawer
        title={
          <Space>
            <MessageOutlined />
            <span>{t('ai.chat.title')}</span>
          </Space>
        }
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        width={400}
        styles={{
          body: {
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100% - 55px)',
          },
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            marginBottom: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {messages.length === 0 && (
            <Card>
              <Paragraph type="secondary" style={{ margin: 0 }}>
                {t('ai.chat.welcome')}
                <br />
                {t('ai.chat.examples')}
                <br />
                • {t('ai.chat.example1')}
                <br />
                • {t('ai.chat.example2')}
              </Paragraph>
            </Card>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: message.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <Card
                style={{
                  maxWidth: '80%',
                  background:
                    message.role === 'user'
                      ? 'var(--background)'
                      : 'var(--background)',
                  border:
                    message.role === 'user'
                      ? '1px solid var(--border)'
                      : '1px solid var(--border)',
                }}
              >
                <Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {message.content}
                </Paragraph>
                {message.sources && message.sources.length > 0 && (
                  <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {t('ai.chat.sources')}：
                    </Text>
                    <div style={{ marginTop: '4px' }}>
                      {message.sources.map((source, idx) => (
                        <a
                          key={idx}
                          href={`/blog/${source.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'block',
                            fontSize: '12px',
                            color: '#1890ff',
                            marginTop: '4px',
                          }}
                        >
                          • {source.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Card>
                <Spin size="small" />
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <Space.Compact style={{ width: '100%' }}>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('ai.chat.placeholder')}
            autoSize={{ minRows: 1, maxRows: 4 }}
            disabled={loading}
            style={{ flex: 1 }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            loading={loading}
            disabled={!input.trim()}
          >
            {t('ai.chat.send')}
          </Button>
        </Space.Compact>
      </Drawer>
    </>
  )
}

