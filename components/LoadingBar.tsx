'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export function LoadingBar() {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const startTimer = window.setTimeout(() => {
      setIsLoading(true)
    }, 0)
    const endTimer = window.setTimeout(() => {
      setIsLoading(false)
    }, 300)

    return () => {
      window.clearTimeout(startTimer)
      window.clearTimeout(endTimer)
    }
  }, [pathname])

  if (!isLoading) {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #2563eb, #3b82f6)',
        zIndex: 9999,
        animation: 'loading-bar 0.3s ease-out',
      }}
    />
  )
}

