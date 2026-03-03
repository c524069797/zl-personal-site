'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface GlowCardProps {
  children: ReactNode
  className?: string
  glowColor?: string
}

/**
 * Glassmorphism card with animated neon glow border and 3D tilt on hover.
 * Uses Framer Motion springs for smooth mouse-tracking tilt.
 */
export default function GlowCard({
  children,
  className = '',
  glowColor = 'rgba(99, 102, 241, 0.4)',
}: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 200,
    damping: 20,
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
    stiffness: 200,
    damping: 20,
  })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 800,
      }}
      className={`relative group ${className}`}
    >
      {/* Animated glow border */}
      <div
        className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
        style={{
          background: `conic-gradient(from var(--glow-angle, 0deg), ${glowColor}, transparent 40%, ${glowColor})`,
          animation: 'glowSpin 3s linear infinite',
        }}
      />

      {/* Glass card body */}
      <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 h-full overflow-hidden">
        {/* Inner glow on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${glowColor.replace('0.4', '0.08')}, transparent 70%)`,
          }}
        />
        <div className="relative z-10">{children}</div>
      </div>
    </motion.div>
  )
}
