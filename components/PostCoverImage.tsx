'use client'

import Image from 'next/image'
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
  const { imageUrl, isIcon, backgroundColor } = getPostCoverImageInfo(title, summary)

  if (isIcon && !imageError) {
    return (
      <div
        style={{
          height: `${height}px`,
          background: backgroundColor || '#4fc08d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          position: 'relative',
        }}
      >
        <Image
          src={imageUrl}
          alt={title}
          width={Math.round(height * 0.6)}
          height={Math.round(height * 0.6)}
          unoptimized
          style={{
            width: '60%',
            height: '60%',
            objectFit: 'contain',
            filter: 'brightness(0) invert(1)',
          }}
          onError={() => {
            setImageError(true)
          }}
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
      <Image
        src={imageUrl}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        style={{
          objectFit: 'cover',
        }}
        onError={() => {
          setImageError(true)
        }}
      />
    </div>
  )
}
