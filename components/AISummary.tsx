'use client'

import { useState } from 'react'
import { Card, Typography, Space, Button, Spin, Tag, Select } from 'antd'
import { RobotOutlined, ReloadOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { useTranslation } from '@/hooks/useTranslation'

const { Paragraph, Text } = Typography
const { Option } = Select

type AIProvider = 'chatgpt' | 'deepseek'

interface AISummaryProps {
  postId: string
  postSlug: string
}

export default function AISummary({ postId, postSlug }: AISummaryProps) {
  const { t } = useTranslation()
  const [summary, setSummary] = useState<string | null>(null)
  const [keywords, setKeywords] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [provider, setProvider] = useState<AIProvider>('deepseek')
  const [hasGenerated, setHasGenerated] = useState(false)

  const fetchSummary = async (forceRegenerate = false) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/ai/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          force: forceRegenerate,
          provider,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSummary(data.summary)
        setKeywords(data.keywords || [])
        setHasGenerated(true)
      } else {
        console.error('Failed to fetch summary:', data.error, data.details)
        alert(data.error || '生成摘要失败，请稍后重试')
      }
    } catch (error: any) {
      console.error('Failed to fetch summary:', error)
      alert('网络错误，请稍后重试')
    } finally {
      setLoading(false)
      setGenerating(false)
    }
  }

  const handleGenerate = () => {
    setGenerating(true)
    fetchSummary(false)
  }

  const handleRegenerate = () => {
    setGenerating(true)
    fetchSummary(true)
  }

  const handleProviderChange = (value: AIProvider) => {
    setProvider(value)
    // 切换提供商时清空之前的摘要
    setSummary(null)
    setKeywords([])
    setHasGenerated(false)
  }

  // 如果还没有生成过摘要，显示生成按钮
  if (!hasGenerated && !loading) {
    return (
      <Card
        title={
          <Space>
            <RobotOutlined />
            <span>{t('ai.summary.title')}</span>
          </Space>
        }
        style={{ marginBottom: '24px' }}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div>
            <Text type="secondary" style={{ marginRight: '8px' }}>{t('ai.summary.selectModel')}</Text>
            <Select
              value={provider}
              onChange={handleProviderChange}
              style={{ width: 200 }}
            >
              <Option value="deepseek">
                <Space>
                  <ThunderboltOutlined />
                  DeepSeek
                </Space>
              </Option>
              <Option value="chatgpt">
                <Space>
                  <RobotOutlined />
                  ChatGPT
                </Space>
              </Option>
            </Select>
          </div>
          <Button
            type="primary"
            icon={<RobotOutlined />}
            onClick={handleGenerate}
            loading={generating}
            block
          >
            {t('ai.summary.generate')}
          </Button>
        </Space>
      </Card>
    )
  }

  if (loading || generating) {
    return (
      <Card
        title={
          <Space>
            <RobotOutlined />
            <span>{t('ai.summary.title')}</span>
          </Space>
        }
        style={{ marginBottom: '24px' }}
      >
        <Spin />
      </Card>
    )
  }

  if (!summary) {
    return null
  }

  return (
      <Card
        title={
          <Space>
            <RobotOutlined />
            <span>{t('ai.summary.title')}</span>
          </Space>
        }
        extra={
          <Button
            type="text"
            size="small"
            icon={<ReloadOutlined />}
            onClick={handleRegenerate}
            loading={generating}
          >
            {t('ai.summary.regenerate')}
          </Button>
        }
        style={{ marginBottom: '24px' }}
      >
        <Paragraph style={{ marginBottom: '16px', lineHeight: 1.8 }}>
          {summary}
        </Paragraph>

        {keywords.length > 0 && (
          <div>
            <Text type="secondary" style={{ fontSize: '12px', marginRight: '8px' }}>
              {t('ai.summary.keywords')}
            </Text>
            <Space wrap size="small">
              {keywords.map((keyword, index) => (
                <Tag key={index}>{keyword}</Tag>
              ))}
            </Space>
          </div>
        )}
      </Card>
  )
}

