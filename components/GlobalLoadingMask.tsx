'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export function GlobalLoadingMask() {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsLoading(true))
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 200)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
  }, [pathname])

  if (!isLoading) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(1px)',
        transition: 'opacity 0.15s ease-out',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '3px solid rgba(6, 182, 212, 0.15)',
          borderTopColor: '#06b6d4',
          animation: 'global-spin 0.6s linear infinite',
        }}
      />
      <style jsx global>{`
        @keyframes global-spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
