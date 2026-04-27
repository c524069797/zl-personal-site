'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface ScrollingTextProps {
  text: string
  direction?: 'left' | 'right'
  className?: string
  textClassName?: string
}

export default function ScrollingText({
  text,
  direction = 'left',
  className = '',
  textClassName = '',
}: ScrollingTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%']
  )

  const repeatedText = `${text} \u00A0\u00A0\u00A0 ${text} \u00A0\u00A0\u00A0 ${text} \u00A0\u00A0\u00A0 ${text} \u00A0\u00A0\u00A0 `

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden whitespace-nowrap ${className}`}
    >
      <motion.div
        style={{ x }}
        className="flex"
      >
        <span className={`inline-block ${textClassName}`}>
          {repeatedText}
        </span>
        <span className={`inline-block ${textClassName}`}>
          {repeatedText}
        </span>
      </motion.div>
    </div>
  )
}

export function ScrollingTextRow({
  texts,
  className = '',
}: {
  texts: Array<{ text: string; direction: 'left' | 'right' }>
  className?: string
}) {
  const baseTextClass =
    'text-[clamp(3rem,12vw,10rem)] font-bold tracking-widest uppercase select-none'

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {texts.map((item, i) => (
        <ScrollingText
          key={i}
          text={item.text}
          direction={item.direction}
          textClassName={`${baseTextClass} ${
            i % 2 === 0
              ? 'text-white/[0.04] dark:text-white/[0.06]'
              : 'text-white/[0.02] dark:text-white/[0.03]'
          }`}
        />
      ))}
    </div>
  )
}
