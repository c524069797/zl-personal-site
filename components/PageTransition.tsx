'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayChildren, setDisplayChildren] = useState(children)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsTransitioning(true))
    const timer = setTimeout(() => {
      setDisplayChildren(children)
      setIsTransitioning(false)
    }, 120)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
  }, [pathname, children])

  return (
    <div
      style={{
        opacity: isTransitioning ? 0.15 : 1,
        transform: isTransitioning ? 'translateY(12px) scale(0.995)' : 'translateY(0) scale(1)',
        filter: isTransitioning ? 'blur(1px)' : 'none',
        transition: 'opacity 0.15s ease-out, transform 0.15s ease-out, filter 0.15s ease-out',
      }}
    >
      {displayChildren}
    </div>
  )
}
