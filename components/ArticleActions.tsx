'use client'

import { HeartOutlined, BookOutlined, ShareAltOutlined } from '@ant-design/icons'

export default function ArticleActions() {
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
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        color: 'var(--text-secondary)',
        transition: 'all 0.3s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#1890ff'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--text-secondary)'
      }}
      >
        <HeartOutlined style={{ fontSize: '20px', marginBottom: '8px' }} />
        <span style={{ fontSize: '14px' }}>1.2K</span>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        color: 'var(--text-secondary)',
        transition: 'all 0.3s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#1890ff'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--text-secondary)'
      }}
      >
        <BookOutlined style={{ fontSize: '20px', marginBottom: '8px' }} />
        <span style={{ fontSize: '14px' }}>326</span>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        color: 'var(--text-secondary)',
        transition: 'all 0.3s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#1890ff'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--text-secondary)'
      }}
      >
        <ShareAltOutlined style={{ fontSize: '20px', marginBottom: '8px' }} />
        <span style={{ fontSize: '14px' }}>分享</span>
      </div>
    </div>
  )
}

