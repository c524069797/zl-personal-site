'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayChildren, setDisplayChildren] = useState(children)
  const isResumePrintPage = pathname?.startsWith('/resume/print')

  useEffect(() => {
    if (isResumePrintPage) {
      return
    }

    /**
     * 【React 进阶模式学习 10：手动调度与 Fiber 调度思想】
     * 这里的 requestAnimationFrame (rAF) 是浏览器提供的原生调度 API。
     * 为什么要用它？为了确保 setIsTransitioning(true) 在浏览器下一帧渲染前执行，从而平滑地开启过渡动画。
     * React Fiber 架构内部的 Scheduler（调度器）其实也借鉴了这种思想：
     * 它会将不同优先级的更新（如动画 vs 数据流）放在不同的时间片中执行，
     * 以确保像动画这样对视觉敏感的操作不会被耗时较长的 JS 计算（如大列表渲染）所阻塞。
     */
    const raf = requestAnimationFrame(() => setIsTransitioning(true))
    const timer = setTimeout(() => {
      setDisplayChildren(children)
      setIsTransitioning(false)
    }, 120)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
  }, [pathname, children, isResumePrintPage])

  if (isResumePrintPage) {
    return <>{children}</>
  }

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
