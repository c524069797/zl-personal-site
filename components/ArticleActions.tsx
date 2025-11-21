'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { HeartOutlined, BookOutlined, ShareAltOutlined, CheckOutlined } from '@ant-design/icons'
import { message } from 'antd'

export default function ArticleActions() {
  const pathname = usePathname()
  const [shared, setShared] = useState(false)
  const [clicked, setClicked] = useState<string | null>(null)

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    setClicked('share')
    
    const url = `${window.location.origin}${pathname}`
    
    try {
      await navigator.clipboard.writeText(url)
      setShared(true)
      message.success('链接已复制到剪贴板')
      setTimeout(() => {
        setShared(false)
        setClicked(null)
      }, 2000)
    } catch (err) {
      // 降级方案
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setShared(true)
      message.success('链接已复制到剪贴板')
      setTimeout(() => {
        setShared(false)
        setClicked(null)
      }, 2000)
    }
  }

  const handleClick = (type: string, e: React.MouseEvent) => {
    e.preventDefault()
    setClicked(type)
    setTimeout(() => {
      setClicked(null)
    }, 300)
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '32px',
      margin: '32px 0',
      padding: '16px 0',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          transition: 'all 0.2s',
          transform: clicked === 'like' ? 'scale(0.9)' : 'scale(1)',
          opacity: clicked === 'like' ? 0.7 : 1,
        }}
        onClick={(e) => handleClick('like', e)}
        onMouseEnter={(e) => {
          if (clicked !== 'like') {
            e.currentTarget.style.color = '#1890ff'
          }
        }}
        onMouseLeave={(e) => {
          if (clicked !== 'like') {
            e.currentTarget.style.color = 'var(--text-secondary)'
          }
        }}
      >
        <HeartOutlined style={{ fontSize: '20px', marginBottom: '8px' }} />
        <span style={{ fontSize: '14px' }}>点赞</span>
      </div>

      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          transition: 'all 0.2s',
          transform: clicked === 'bookmark' ? 'scale(0.9)' : 'scale(1)',
          opacity: clicked === 'bookmark' ? 0.7 : 1,
        }}
        onClick={(e) => handleClick('bookmark', e)}
        onMouseEnter={(e) => {
          if (clicked !== 'bookmark') {
            e.currentTarget.style.color = '#1890ff'
          }
        }}
        onMouseLeave={(e) => {
          if (clicked !== 'bookmark') {
            e.currentTarget.style.color = 'var(--text-secondary)'
          }
        }}
      >
        <BookOutlined style={{ fontSize: '20px', marginBottom: '8px' }} />
        <span style={{ fontSize: '14px' }}>收藏</span>
      </div>

      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: 'pointer',
          color: shared ? '#52c41a' : 'var(--text-secondary)',
          transition: 'all 0.2s',
          transform: clicked === 'share' ? 'scale(0.9)' : 'scale(1)',
          opacity: clicked === 'share' ? 0.7 : 1,
        }}
        onClick={handleShare}
        onMouseEnter={(e) => {
          if (clicked !== 'share' && !shared) {
            e.currentTarget.style.color = '#1890ff'
          }
        }}
        onMouseLeave={(e) => {
          if (clicked !== 'share' && !shared) {
            e.currentTarget.style.color = 'var(--text-secondary)'
          }
        }}
      >
        {shared ? (
          <CheckOutlined style={{ fontSize: '20px', marginBottom: '8px' }} />
        ) : (
          <ShareAltOutlined style={{ fontSize: '20px', marginBottom: '8px' }} />
        )}
        <span style={{ fontSize: '14px' }}>{shared ? '已复制' : '分享'}</span>
      </div>
    </div>
  )
}

