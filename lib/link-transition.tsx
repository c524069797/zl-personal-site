'use client'

import { useRouter } from 'next/navigation'
import { useState, MouseEvent } from 'react'

interface LinkTransitionProps {
  href: string
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
}

export function LinkTransition({ href, children, className, style, onClick }: LinkTransitionProps) {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    if (onClick) {
      onClick(e)
    }

    setIsNavigating(true)

    // 添加视觉反馈
    document.body.style.cursor = 'wait'

    // 延迟导航以显示反馈
    setTimeout(() => {
      router.push(href)
      // 导航后恢复光标
      setTimeout(() => {
        document.body.style.cursor = ''
        setIsNavigating(false)
      }, 100)
    }, 50)
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
      style={{
        ...style,
        cursor: isNavigating ? 'wait' : 'pointer',
        opacity: isNavigating ? 0.7 : 1,
        transition: 'opacity 0.2s',
      }}
    >
      {children}
    </a>
  )
}

