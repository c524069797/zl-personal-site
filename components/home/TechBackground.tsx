'use client'

import { useRef, useEffect } from 'react'
import { useTheme } from 'next-themes'

interface TechParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
  pulse: number
  pulseSpeed: number
}

interface GridLine {
  x: number
  y: number
  speed: number
  opacity: number
  type: 'h' | 'v'
}

const COLORS = [
  '99, 102, 241',
  '139, 92, 246',
  '59, 130, 246',
  '236, 72, 153',
  '14, 165, 233',
  '168, 85, 247',
]

export default function TechBackground() {
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
    let particles: TechParticle[] = []
    let gridLines: GridLine[] = []

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
      initParticles()
      initGridLines()
    }

    const initParticles = () => {
      particles = []
      const count = Math.min(Math.floor((w * h) / 15000), 60)
      for (let i = 0; i < count; i++) {
        const colorIdx = Math.floor(Math.random() * COLORS.length)
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.2,
          size: Math.random() * 2.5 + 0.5,
          opacity: Math.random() * 0.4 + 0.1,
          color: COLORS[colorIdx],
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.02 + 0.01,
        })
      }
    }

    const initGridLines = () => {
      gridLines = []
      const hCount = Math.max(5, Math.floor(w / 200))
      const vCount = Math.max(5, Math.floor(h / 200))
      for (let i = 0; i < hCount; i++) {
        gridLines.push({
          x: Math.random() * w,
          y: 0,
          speed: Math.random() * 0.3 + 0.1,
          opacity: Math.random() * 0.04 + 0.01,
          type: 'v',
        })
      }
      for (let i = 0; i < vCount; i++) {
        gridLines.push({
          x: 0,
          y: Math.random() * h,
          speed: Math.random() * 0.3 + 0.1,
          opacity: Math.random() * 0.04 + 0.01,
          type: 'h',
        })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      time += 0.003

      if (resolvedTheme === 'dark') {
        animId = requestAnimationFrame(draw)
        return
      }

      // Base gradient - deep tech blue to purple
      const baseGradient = ctx.createLinearGradient(0, 0, w, h)
      baseGradient.addColorStop(0, '#f0f4ff')
      baseGradient.addColorStop(0.3, '#f5f0ff')
      baseGradient.addColorStop(0.6, '#fff0f5')
      baseGradient.addColorStop(1, '#f0f9ff')
      ctx.fillStyle = baseGradient
      ctx.fillRect(0, 0, w, h)

      // Animated mesh gradient spots
      const spots = [
        { cx: 0.2 + Math.sin(time * 0.7) * 0.1, cy: 0.2 + Math.cos(time * 0.5) * 0.1, r: 0.5, c: 'rgba(99, 102, 241, 0.15)' },
        { cx: 0.8 + Math.cos(time * 0.6) * 0.1, cy: 0.3 + Math.sin(time * 0.8) * 0.08, r: 0.45, c: 'rgba(139, 92, 246, 0.12)' },
        { cx: 0.5 + Math.sin(time * 0.4) * 0.15, cy: 0.7 + Math.cos(time * 0.7) * 0.1, r: 0.55, c: 'rgba(236, 72, 153, 0.1)' },
        { cx: 0.3 + Math.cos(time * 0.9) * 0.08, cy: 0.8 + Math.sin(time * 0.5) * 0.08, r: 0.4, c: 'rgba(14, 165, 233, 0.12)' },
      ]
      for (const s of spots) {
        const g = ctx.createRadialGradient(s.cx * w, s.cy * h, 0, s.cx * w, s.cy * h, s.r * Math.max(w, h))
        g.addColorStop(0, s.c)
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
      }

      // Tech grid
      const gridSize = 80
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.04)'
      ctx.lineWidth = 0.5
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }

      // Animated grid intersection dots
      for (let x = 0; x < w; x += gridSize) {
        for (let y = 0; y < h; y += gridSize) {
          const dist = Math.sqrt((x - w / 2) ** 2 + (y - h / 2) ** 2)
          const maxDist = Math.sqrt((w / 2) ** 2 + (h / 2) ** 2)
          const wave = Math.sin(time * 2 + dist * 0.005) * 0.5 + 0.5
          const alpha = wave * (1 - dist / maxDist) * 0.15
          if (alpha > 0.01) {
            ctx.beginPath()
            ctx.arc(x, y, 1.5, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(99, 102, 241, ${alpha})`
            ctx.fill()
          }
        }
      }

      // Floating scan lines
      for (const line of gridLines) {
        if (line.type === 'h') {
          line.y += line.speed
          if (line.y > h) line.y = 0
          ctx.beginPath()
          ctx.moveTo(0, line.y)
          ctx.lineTo(w, line.y)
          ctx.strokeStyle = `rgba(99, 102, 241, ${line.opacity})`
          ctx.lineWidth = 1
          ctx.stroke()
        } else {
          line.x += line.speed
          if (line.x > w) line.x = 0
          ctx.beginPath()
          ctx.moveTo(line.x, 0)
          ctx.lineTo(line.x, h)
          ctx.strokeStyle = `rgba(139, 92, 246, ${line.opacity})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      // Particles
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.pulse += p.pulseSpeed

        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0

        const pulseAlpha = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse))

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color}, ${pulseAlpha})`
        ctx.shadowBlur = 8
        ctx.shadowColor = `rgba(${p.color}, 0.4)`
        ctx.fill()
        ctx.shadowBlur = 0

        // Small ring around some particles
        if (p.size > 2) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(${p.color}, ${pulseAlpha * 0.2})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }

      // Draw connections between nearby particles
      const maxDist = 180
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.08
            ctx.beginPath()
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // Central glow
      const centerGradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.4)
      centerGradient.addColorStop(0, 'rgba(99, 102, 241, 0.03)')
      centerGradient.addColorStop(1, 'transparent')
      ctx.fillStyle = centerGradient
      ctx.fillRect(0, 0, w, h)

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
      className="absolute inset-0 z-0 dark:hidden"
    />
  )
}
