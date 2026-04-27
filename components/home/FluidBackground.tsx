'use client'

import { useRef, useEffect } from 'react'
import { useTheme } from 'next-themes'

interface FluidBackgroundProps {
  className?: string
}

export default function FluidBackground({ className = '' }: FluidBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    let animId = 0
    let time = 0

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const dpr = window.devicePixelRatio || 1
      const rect = parent.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const isDark = resolvedTheme === 'dark'

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      time += 0.003

      if (isDark) {
        // Dark mode: deep blue/teal fluid
        const gradients = [
          { cx: 0.3 + Math.sin(time) * 0.2, cy: 0.3 + Math.cos(time * 0.7) * 0.2, r: 0.5, color: 'rgba(20, 40, 100, 0.6)' },
          { cx: 0.7 + Math.cos(time * 0.8) * 0.2, cy: 0.5 + Math.sin(time * 0.6) * 0.2, r: 0.45, color: 'rgba(10, 60, 90, 0.5)' },
          { cx: 0.5 + Math.sin(time * 0.5) * 0.3, cy: 0.7 + Math.cos(time * 0.9) * 0.2, r: 0.55, color: 'rgba(30, 30, 80, 0.5)' },
          { cx: 0.2 + Math.cos(time * 0.6) * 0.15, cy: 0.6 + Math.sin(time * 0.4) * 0.15, r: 0.35, color: 'rgba(40, 20, 80, 0.4)' },
        ]
        for (const g of gradients) {
          const gradient = ctx.createRadialGradient(g.cx * w, g.cy * h, 0, g.cx * w, g.cy * h, g.r * Math.max(w, h))
          gradient.addColorStop(0, g.color)
          gradient.addColorStop(1, 'transparent')
          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, w, h)
        }
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
        ctx.fillRect(0, 0, w, h)
      } else {
        // Light mode: vibrant pastel mesh gradient
        const gradients = [
          { cx: 0.2 + Math.sin(time * 0.7) * 0.15, cy: 0.2 + Math.cos(time * 0.5) * 0.15, r: 0.6, color: 'rgba(139, 92, 246, 0.12)' },
          { cx: 0.8 + Math.cos(time * 0.6) * 0.15, cy: 0.3 + Math.sin(time * 0.8) * 0.1, r: 0.55, color: 'rgba(59, 130, 246, 0.1)' },
          { cx: 0.5 + Math.sin(time * 0.4) * 0.2, cy: 0.6 + Math.cos(time * 0.7) * 0.15, r: 0.65, color: 'rgba(236, 72, 153, 0.08)' },
          { cx: 0.3 + Math.cos(time * 0.9) * 0.1, cy: 0.8 + Math.sin(time * 0.5) * 0.1, r: 0.5, color: 'rgba(14, 165, 233, 0.1)' },
          { cx: 0.7 + Math.sin(time * 0.3) * 0.2, cy: 0.7 + Math.cos(time * 0.4) * 0.2, r: 0.45, color: 'rgba(168, 85, 247, 0.08)' },
        ]
        for (const g of gradients) {
          const gradient = ctx.createRadialGradient(g.cx * w, g.cy * h, 0, g.cx * w, g.cy * h, g.r * Math.max(w, h))
          gradient.addColorStop(0, g.color)
          gradient.addColorStop(1, 'transparent')
          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, w, h)
        }
      }

      animId = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    animId = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [resolvedTheme])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 z-0 ${className}`}
    />
  )
}
