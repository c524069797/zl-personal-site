'use client'

import { useState } from 'react'
import { BookOutlined } from '@ant-design/icons'
import { getPostCoverImageInfo } from '@/lib/image-utils'

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

  // 生成图片信息
  const imageInfo = getPostCoverImageInfo(title, summary)
  const { imageUrl, isIcon, backgroundColor } = imageInfo

  // 如果是图标，使用特殊样式显示
  if (isIcon) {
    return (
      <div
        style={{
          height: `${height}px`,
          background: backgroundColor || '#4fc08d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        <img
          src={imageUrl}
          alt={title}
          style={{
            width: '60%',
            height: '60%',
            objectFit: 'contain',
            filter: 'brightness(0) invert(1)', // 将图标变为白色
          }}
          onError={() => {
            setImageError(true)
          }}
          loading="lazy"
        />
      </div>
    )
  }

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

