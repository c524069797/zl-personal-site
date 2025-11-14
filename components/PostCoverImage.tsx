'use client'

import { useState } from 'react'
import { BookOutlined } from '@ant-design/icons'
import { getPostCoverImage } from '@/lib/image-utils'

interface PostCoverImageProps {
  title: string
  summary?: string
  height?: number
  gradient?: string
  fallbackIcon?: React.ReactNode
}

export default function PostCoverImage({
  title,
  summary,
  height = 180,
  gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  fallbackIcon,
}: PostCoverImageProps) {
  const [imageError, setImageError] = useState(false)

  // 生成图片URL
  const imageUrl = getPostCoverImage(title, summary)

  if (imageError) {
    return (
      <div
        style={{
          height: `${height}px`,
          background: gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '48px',
        }}
      >
        {fallbackIcon || <BookOutlined />}
      </div>
    )
  }

  return (
    <div
      style={{
        height: `${height}px`,
        overflow: 'hidden',
        position: 'relative',
        background: '#f0f0f0',
      }}
    >
      <img
        src={imageUrl}
        alt={title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        onError={() => {
          setImageError(true)
        }}
        loading="lazy"
      />
    </div>
  )
}

