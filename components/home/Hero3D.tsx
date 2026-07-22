'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookOpen, FileText, MousePointer2 } from 'lucide-react'
import MagneticButton from './MagneticButton'
import { useTranslation } from '@/hooks/useTranslation'

// 固定展示的双语 one-liner（不随语言切换，双语并置）
const ONELINE_EN =
  'Fueled by passion, I turn complex business into AI agents that actually ship.'
const ONELINE_CN = '带着热爱，把复杂的业务做成真正能上线的 AI Agent。'

// Three.js 不能 SSR：动态引入 Canvas 场景，服务端不渲染
const Avatar3DScene = dynamic(() => import('./Avatar3DScene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-16 w-16 animate-spin rounded-full border-2 border-white/10 border-t-cyan-400/70" />
    </div>
  ),
})

export default function Hero3D() {
  const { t } = useTranslation()

  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white dark:from-[#050816] dark:via-[#070b1c] dark:to-[#050816]">
      {/* 顶部光晕装饰 */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-400/10 via-indigo-400/10 to-violet-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl grid-cols-1 items-center gap-4 px-5 sm:px-10 lg:grid-cols-2 lg:gap-8 lg:px-16">
        {/* 文案列（移动端在下，桌面端在左） */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="order-2 max-w-xl lg:order-1"
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-cyan-500 dark:text-cyan-300/80 sm:text-xs">
            {t('home.hero3d.eyebrow')}
          </span>

          <h1 className="mt-4 text-4xl font-bold leading-[1.05] text-neutral-900 dark:text-white sm:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
              Passion Life
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              Passion AI
            </span>
          </h1>

          <p className="mt-6 max-w-md text-base font-medium text-neutral-700 dark:text-white/80 sm:text-lg">
            {ONELINE_EN}
          </p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-500 dark:text-white/50 sm:text-base">
            {ONELINE_CN}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link href="/blog" className="w-full sm:w-auto">
              <MagneticButton className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 px-7 py-3 text-sm font-semibold text-white transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] sm:w-auto">
                <span className="flex items-center justify-center gap-2">
                  <BookOpen size={16} />
                  {t('common.browseBlog')}
                </span>
              </MagneticButton>
            </Link>
            <Link href="/resume" className="w-full sm:w-auto">
              <MagneticButton className="w-full rounded-full border-2 border-neutral-200 px-7 py-3 text-sm font-semibold text-neutral-600 transition-all duration-300 hover:border-cyan-400/50 hover:text-cyan-600 dark:border-white/20 dark:text-white/80 dark:hover:text-white sm:w-auto">
                <span className="flex items-center justify-center gap-2">
                  <FileText size={16} />
                  {t('common.viewResume')}
                </span>
              </MagneticButton>
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-2 text-[11px] text-neutral-400 dark:text-white/30">
            <MousePointer2 size={13} />
            <span>{t('home.hero3d.dragHint')}</span>
          </div>
        </motion.div>

        {/* 3D 手办列（移动端在上，桌面端在右） */}
        <div className="relative order-1 h-[42vh] w-full sm:h-[48vh] lg:order-2 lg:h-[calc(100vh-8rem)]">
          <Avatar3DScene />
        </div>
      </div>

      {/* 底部渐隐，衔接下方区块 */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[5] h-32 bg-gradient-to-t from-white to-transparent dark:from-[#050816]" />
    </section>
  )
}
