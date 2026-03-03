'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  color: string
}

interface Meteor {
  x: number
  y: number
  length: number
  speed: number
  opacity: number
  width: number
  color: string
  life: number
  maxLife: number
}

const COLORS = [
  'rgba(99, 102, 241, 0.6)',
  'rgba(139, 92, 246, 0.5)',
  'rgba(59, 130, 246, 0.5)',
  'rgba(6, 182, 212, 0.4)',
  'rgba(168, 85, 247, 0.4)',
]

const METEOR_COLORS = ['#ffffff', '#c7d2fe', '#a5b4fc', '#93c5fd', '#c4b5fd']

function createMeteor(w: number, h: number): Meteor {
  return {
    x: Math.random() * w * 1.2,
    y: -Math.random() * h * 0.3,
    length: Math.random() * 120 + 60,
    speed: Math.random() * 4 + 3,
    opacity: Math.random() * 0.6 + 0.4,
    width: Math.random() * 1.5 + 0.5,
    color: METEOR_COLORS[Math.floor(Math.random() * METEOR_COLORS.length)],
    life: 0,
    maxLife: Math.random() * 60 + 40,
  }
}

function initParticles(w: number, h: number): Particle[] {
  const count = Math.min(Math.floor((w * h) / 8000), 120)
  const particles: Particle[] = []
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    })
  }
  return particles
}

function initMeteors(w: number, h: number): Meteor[] {
  const count = Math.max(3, Math.floor(w / 300))
  const meteors: Meteor[] = []
  for (let i = 0; i < count; i++) {
    const m = createMeteor(w, h)
    m.life = Math.random() * m.maxLife
    meteors.push(m)
  }
  return meteors
}

/**
 * Canvas-based particle system with meteor/shooting star effects.
 */
export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let particles: Particle[] = []
    let meteors: Meteor[] = []
    let w = 0
    let h = 0
    let animId = 0
    const mouse = { x: 0, y: 0 }

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
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.scale(dpr, dpr)
      particles = initParticles(w, h)
      meteors = initMeteors(w, h)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }

    const drawConnections = (ctx: CanvasRenderingContext2D) => {
      const maxDist = 150
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.15
            ctx.beginPath()
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    const drawMeteors = (ctx: CanvasRenderingContext2D) => {
      for (let i = 0; i < meteors.length; i++) {
        const m = meteors[i]
        m.life++
        m.x -= m.speed * 1.2
        m.y += m.speed

        let fadeAlpha = m.opacity
        if (m.life < 10) {
          fadeAlpha = m.opacity * (m.life / 10)
        } else if (m.life > m.maxLife - 15) {
          fadeAlpha = m.opacity * ((m.maxLife - m.life) / 15)
        }

        if (fadeAlpha > 0) {
          ctx.save()
          const angle = Math.atan2(m.speed, -m.speed * 1.2)
          const tailX = m.x + Math.cos(angle + Math.PI) * m.length
          const tailY = m.y + Math.sin(angle + Math.PI) * m.length

          const gradient = ctx.createLinearGradient(m.x, m.y, tailX, tailY)
          gradient.addColorStop(0, `rgba(255, 255, 255, ${fadeAlpha})`)
          gradient.addColorStop(0.3, m.color)
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

          ctx.beginPath()
          ctx.strokeStyle = gradient
          ctx.lineWidth = m.width
          ctx.lineCap = 'round'
          ctx.moveTo(m.x, m.y)
          ctx.lineTo(tailX, tailY)
          ctx.stroke()

          ctx.beginPath()
          ctx.arc(m.x, m.y, m.width + 1, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${fadeAlpha * 0.8})`
          ctx.shadowBlur = 12
          ctx.shadowColor = m.color
          ctx.fill()
          ctx.shadowBlur = 0
          ctx.restore()
        }

        if (m.life >= m.maxLife || m.x < -m.length || m.y > h + m.length) {
          meteors[i] = createMeteor(w, h)
          meteors[i].life = -Math.floor(Math.random() * 80)
        }
      }
    }

    const animate = () => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const dpr = window.devicePixelRatio || 1
      ctx.clearRect(0, 0, w * dpr, h * dpr)

      for (const p of particles) {
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 200 && dist > 0) {
          p.vx += (dx / dist) * 0.02
          p.vy += (dy / dist) * 0.02
        }

        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.99
        p.vy *= 0.99

        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.shadowBlur = 8
        ctx.shadowColor = p.color
        ctx.fill()
        ctx.shadowBlur = 0
      }

      drawConnections(ctx)
      drawMeteors(ctx)

      animId = requestAnimationFrame(animate)
    }

    resize()
    window.addEventListener('resize', resize)
    canvas.addEventListener('mousemove', handleMouseMove)
    animId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
      style={{ pointerEvents: 'auto' }}
    />
  )
}
