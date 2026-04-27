'use client'

import { useRef, useEffect } from 'react'
import { useTheme } from 'next-themes'

interface DataNode {
  x: number
  y: number
  targetX: number
  targetY: number
  size: number
  opacity: number
  speed: number
  color: string
  ringRadius: number
  ringPhase: number
}

interface DataPacket {
  x: number
  y: number
  tx: number
  ty: number
  progress: number
  speed: number
  color: string
  width: number
}

const COLORS = ['0, 212, 255', '14, 165, 233', '99, 102, 241', '6, 182, 212']

export default function DataFlowBackground() {
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
    let nodes: DataNode[] = []
    const packets: DataPacket[] = []

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
      initNodes()
    }

    const initNodes = () => {
      nodes = []
      const count = Math.min(Math.floor((w * h) / 25000), 40)
      for (let i = 0; i < count; i++) {
        const colorIdx = Math.floor(Math.random() * COLORS.length)
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          targetX: Math.random() * w,
          targetY: Math.random() * h,
          size: Math.random() * 2.5 + 1,
          opacity: Math.random() * 0.5 + 0.2,
          speed: Math.random() * 0.3 + 0.1,
          color: COLORS[colorIdx],
          ringRadius: Math.random() * 20 + 10,
          ringPhase: Math.random() * Math.PI * 2,
        })
      }
    }

    const spawnPacket = () => {
      if (packets.length > 15) return
      if (nodes.length < 2) return
      const from = nodes[Math.floor(Math.random() * nodes.length)]
      const to = nodes[Math.floor(Math.random() * nodes.length)]
      if (from === to) return
      const colorIdx = Math.floor(Math.random() * COLORS.length)
      packets.push({
        x: from.x,
        y: from.y,
        tx: to.x,
        ty: to.y,
        progress: 0,
        speed: Math.random() * 0.008 + 0.004,
        color: COLORS[colorIdx],
        width: Math.random() * 2 + 1,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      time += 0.003

      if (resolvedTheme === 'dark') {
        animId = requestAnimationFrame(draw)
        return
      }

      // Base - very light tech blue
      const baseGradient = ctx.createLinearGradient(0, 0, w, h)
      baseGradient.addColorStop(0, '#f0f7ff')
      baseGradient.addColorStop(0.5, '#f5f3ff')
      baseGradient.addColorStop(1, '#f0faff')
      ctx.fillStyle = baseGradient
      ctx.fillRect(0, 0, w, h)

      // Animated data flow spots
      const spots = [
        { cx: 0.15 + Math.sin(time * 0.6) * 0.1, cy: 0.15 + Math.cos(time * 0.4) * 0.1, r: 0.45, c: 'rgba(0, 212, 255, 0.08)' },
        { cx: 0.85 + Math.cos(time * 0.5) * 0.1, cy: 0.25 + Math.sin(time * 0.7) * 0.08, r: 0.4, c: 'rgba(14, 165, 233, 0.06)' },
        { cx: 0.5 + Math.sin(time * 0.3) * 0.15, cy: 0.75 + Math.cos(time * 0.6) * 0.1, r: 0.5, c: 'rgba(99, 102, 241, 0.06)' },
        { cx: 0.3 + Math.cos(time * 0.8) * 0.08, cy: 0.6 + Math.sin(time * 0.5) * 0.08, r: 0.35, c: 'rgba(6, 182, 212, 0.07)' },
      ]
      for (const s of spots) {
        const g = ctx.createRadialGradient(s.cx * w, s.cy * h, 0, s.cx * w, s.cy * h, s.r * Math.max(w, h))
        g.addColorStop(0, s.c)
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
      }

      // Hex grid pattern
      const hexSize = 50
      for (let row = -1; row < h / hexSize + 1; row++) {
        for (let col = -1; col < w / hexSize + 1; col++) {
          const x = col * hexSize * 1.5 + (row % 2) * hexSize * 0.75
          const y = row * hexSize * 0.866
          const dist = Math.sqrt((x - w / 2) ** 2 + (y - h / 2) ** 2)
          const maxDist = Math.sqrt((w / 2) ** 2 + (h / 2) ** 2)
          const wave = Math.sin(time * 1.5 + dist * 0.008) * 0.5 + 0.5
          const alpha = wave * (1 - dist / maxDist) * 0.06
          if (alpha < 0.005) continue

          ctx.beginPath()
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6
            const hx = x + hexSize * 0.4 * Math.cos(angle)
            const hy = y + hexSize * 0.4 * Math.sin(angle)
            if (i === 0) ctx.moveTo(hx, hy)
            else ctx.lineTo(hx, hy)
          }
          ctx.closePath()
          ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }

      // Data nodes
      for (const node of nodes) {
        // Drift toward target
        node.x += (node.targetX - node.x) * 0.002
        node.y += (node.targetY - node.y) * 0.002
        if (Math.abs(node.x - node.targetX) < 5 && Math.abs(node.y - node.targetY) < 5) {
          node.targetX = Math.random() * w
          node.targetY = Math.random() * h
        }

        const pulse = 0.7 + 0.3 * Math.sin(time * 2 + node.ringPhase)
        const alpha = node.opacity * pulse

        // Outer ring
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.ringRadius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${node.color}, ${alpha * 0.15})`
        ctx.lineWidth = 0.5
        ctx.stroke()

        // Core
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${node.color}, ${alpha})`
        ctx.shadowBlur = 10
        ctx.shadowColor = `rgba(${node.color}, 0.5)`
        ctx.fill()
        ctx.shadowBlur = 0
      }

      // Spawn data packets
      if (Math.random() < 0.03) spawnPacket()

      // Draw data packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i]
        p.progress += p.speed
        if (p.progress >= 1) {
          packets.splice(i, 1)
          continue
        }
        const cx = p.x + (p.tx - p.x) * p.progress
        const cy = p.y + (p.ty - p.y) * p.progress
        const trailLen = 40
        const tdx = (p.tx - p.x) / Math.sqrt((p.tx - p.x) ** 2 + (p.ty - p.y) ** 2) * trailLen
        const tdy = (p.ty - p.y) / Math.sqrt((p.tx - p.x) ** 2 + (p.ty - p.y) ** 2) * trailLen

        const grad = ctx.createLinearGradient(cx - tdx, cy - tdy, cx, cy)
        grad.addColorStop(0, `rgba(${p.color}, 0)`)
        grad.addColorStop(1, `rgba(${p.color}, 0.6)`)
        ctx.beginPath()
        ctx.moveTo(cx - tdx, cy - tdy)
        ctx.lineTo(cx, cy)
        ctx.strokeStyle = grad
        ctx.lineWidth = p.width
        ctx.lineCap = 'round'
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(cx, cy, p.width + 0.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color}, 0.8)`
        ctx.fill()
      }

      // Draw connections between nearby nodes
      const maxDist = 200
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.06
            ctx.beginPath()
            ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`
            ctx.lineWidth = 0.5
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      // Bottom data wave line
      ctx.beginPath()
      for (let x = 0; x < w; x += 2) {
        const y = h - 60 + Math.sin(x * 0.01 + time * 2) * 15 + Math.sin(x * 0.02 - time * 1.5) * 10
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      const waveGrad = ctx.createLinearGradient(0, h - 80, 0, h)
      waveGrad.addColorStop(0, 'rgba(0, 212, 255, 0.15)')
      waveGrad.addColorStop(1, 'rgba(0, 212, 255, 0)')
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.2)'
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.lineTo(w, h)
      ctx.lineTo(0, h)
      ctx.closePath()
      ctx.fillStyle = waveGrad
      ctx.fill()

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
