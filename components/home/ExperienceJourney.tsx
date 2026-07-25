'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'

// 经历时间轴数据（从新到旧，与滚动进度对应）。i18n 待后续补充。
const JOURNEY = [
  {
    year: '2026 · 广州鼎甲',
    title: 'AI 全栈',
    sub: '主导内部智能客服 Agent 从 0 到 1 上线',
    detail: '数据接入 → Agent 编排 → 工具调用 → 前端交付',
  },
  {
    year: '2022 – 2026 · 广州鼎甲',
    title: '软件工程师（Web）',
    sub: '企业级备份软件研发',
    detail: 'Web 端前后端功能对接、50+ 资源类型统一流程、可视化大屏与跨端',
  },
  {
    year: '2021 · 卓为会员通',
    title: '前端开发',
    sub: '职业起点',
    detail: '把工程基础打扎实，学会为写下的每一行代码负责',
  },
]

const JourneyAvatar = dynamic(() => import('./JourneyAvatar'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-16 w-16 animate-spin rounded-full border-2 border-white/10 border-t-cyan-400/70" />
    </div>
  ),
})

function TimelineItem({
  item,
  index,
  count,
  progress,
}: {
  item: (typeof JOURNEY)[number]
  index: number
  count: number
  progress: MotionValue<number>
}) {
  const seg = 1 / count
  const center = (index + 0.5) * seg
  const lo = 0.35

  // 关键：所有输入断点都夹进 [0,1]，避免 framer-motion WAAPI
  // "Offsets must be monotonically non-decreasing" 报错。
  // 首段起点保持高亮、末段终点保持高亮。
  let opInput: number[]
  let opOutput: number[]
  if (index === 0) {
    opInput = [0, Math.min(1, center + seg * 0.25), Math.min(1, center + seg * 0.7)]
    opOutput = [1, 1, lo]
  } else if (index === count - 1) {
    opInput = [Math.max(0, center - seg * 0.7), Math.max(0, center - seg * 0.25), 1]
    opOutput = [lo, 1, 1]
  } else {
    opInput = [
      center - seg * 0.7,
      center - seg * 0.25,
      center + seg * 0.25,
      center + seg * 0.7,
    ]
    opOutput = [lo, 1, 1, lo]
  }
  const opacity = useTransform(progress, opInput, opOutput)

  const dotScale = useTransform(
    progress,
    [Math.max(0, center - seg * 0.4), center, Math.min(1, center + seg * 0.4)],
    [1, 1.7, 1],
  )

  return (
    <motion.div style={{ opacity }} className="relative pl-10 pb-16 last:pb-0">
      {/* 时间轴节点 */}
      <motion.span
        style={{ scale: dotScale }}
        className="absolute left-[9px] top-2 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-cyan-400 bg-white shadow-[0_0_12px_rgba(56,189,248,0.6)] dark:bg-[#050816]"
      />
      <div className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-400 dark:text-white/40">
        {item.year}
      </div>
      <h3 className="mt-2 text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl lg:text-5xl">
        {item.title}
      </h3>
      <p className="mt-2 text-base text-neutral-600 dark:text-white/70 sm:text-lg">
        {item.sub}
      </p>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-500 dark:text-white/45">
        {item.detail}
      </p>
    </motion.div>
  )
}

export default function ExperienceJourney() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  return (
    <section
      ref={ref}
      id="experience-journey"
      className="relative bg-white dark:bg-[#050816]"
      style={{ height: `${JOURNEY.length * 100 + 30}vh` }}
    >
      <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-hidden">
        <div className="mx-auto grid h-full max-w-7xl grid-cols-1 items-center gap-4 px-5 sm:px-10 lg:grid-cols-2 lg:gap-10 lg:px-16">
          {/* 左：3D 手办（sticky 内固定，随滚动转身） */}
          <div className="relative order-1 h-[45vh] w-full lg:h-full">
            <JourneyAvatar progress={scrollYProgress} />
            <div className="pointer-events-none absolute right-0 top-1/2 hidden h-40 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-neutral-300 to-transparent dark:via-white/15 lg:block" />
          </div>

          {/* 右：时间轴 */}
          <div className="relative order-2 flex h-full flex-col justify-center">
            <div className="absolute bottom-10 left-[9px] top-10 w-px bg-neutral-200 dark:bg-white/10" />
            {JOURNEY.map((item, i) => (
              <TimelineItem
                key={item.year}
                item={item}
                index={i}
                count={JOURNEY.length}
                progress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
