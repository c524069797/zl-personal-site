'use client'

import { motion } from 'framer-motion'
import { Database, Server, HardDrive, ShieldCheck, ArchiveRestore, BadgeCheck, BookOpen, FileText, ArrowDown } from 'lucide-react'
import Link from 'next/link'
import { ScrollingTextRow } from './ScrollingText'
import FluidBackground from './FluidBackground'
import DataFlowBackground from './DataFlowBackground'
import MagneticButton from './MagneticButton'
import { useTranslation } from '@/hooks/useTranslation'

const scrollTexts = [
  { text: 'DATA', direction: 'left' as const },
  { text: 'PROTECTION', direction: 'right' as const },
  { text: 'SECURITY', direction: 'left' as const },
  { text: 'INSIGHT', direction: 'right' as const },
]

function FloatingIcon({
  Icon,
  label,
  delay,
  x,
  y,
}: {
  Icon: React.ElementType
  label: string
  delay: number
  x: string
  y: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: delay + 0.5 }}
      className="absolute z-[5] hidden lg:flex flex-col items-center gap-2 pointer-events-auto"
      style={{ left: x, top: y }}
    >
      <motion.div
        className="group relative text-cyan-400/40 dark:text-cyan-400/30"
        animate={{
          y: [0, -12, 0],
          rotate: [0, 5, -5, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 5,
          delay,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        whileHover={{
          scale: 1.4,
          rotate: [0, -10, 10, 0],
          transition: { duration: 0.5 },
        }}
      >
        <Icon size={28} strokeWidth={1.2} />
        <div className="absolute inset-0 blur-lg bg-cyan-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <motion.div
          className="absolute -inset-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute top-0 left-1/2 w-1 h-1 rounded-full bg-cyan-400/60" />
          <div className="absolute bottom-0 left-1/2 w-1 h-1 rounded-full bg-cyan-400/40" />
        </motion.div>
      </motion.div>
      <motion.span
        className="text-[10px] tracking-wider text-cyan-500/70 dark:text-cyan-400/50 whitespace-nowrap font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0"
      >
        {label}
      </motion.span>
    </motion.div>
  )
}

function HeroCard({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  accent = 'cyan',
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'left' | 'right' | 'up' | 'down'
  accent?: 'cyan' | 'blue' | 'indigo' | 'violet'
}) {
  const initialMap = {
    left: { opacity: 0, x: -40 },
    right: { opacity: 0, x: 40 },
    up: { opacity: 0, y: 30 },
    down: { opacity: 0, y: -30 },
  }

  const accentColors = {
    cyan: {
      border: 'hover:border-cyan-300/70 dark:hover:border-cyan-500/30',
      glow: 'from-cyan-400/10 to-blue-400/10',
      shimmer: 'via-cyan-400/8',
    },
    blue: {
      border: 'hover:border-blue-300/70 dark:hover:border-blue-500/30',
      glow: 'from-blue-400/10 to-indigo-400/10',
      shimmer: 'via-blue-400/8',
    },
    indigo: {
      border: 'hover:border-indigo-300/70 dark:hover:border-indigo-500/30',
      glow: 'from-indigo-400/10 to-violet-400/10',
      shimmer: 'via-indigo-400/8',
    },
    violet: {
      border: 'hover:border-violet-300/70 dark:hover:border-violet-500/30',
      glow: 'from-violet-400/10 to-purple-400/10',
      shimmer: 'via-violet-400/8',
    },
  }

  const c = accentColors[accent]

  return (
    <motion.div
      initial={initialMap[direction]}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.8, delay }}
      whileHover={{ y: -6, scale: 1.01 }}
      className={`group relative rounded-2xl overflow-hidden cursor-default transition-all duration-500
        bg-white/70 dark:bg-white/[0.04]
        backdrop-blur-xl
        border border-neutral-200/60 dark:border-white/[0.08]
        shadow-[0_8px_40px_-12px_rgba(0,212,255,0.12)] dark:shadow-none
        hover:shadow-[0_20px_60px_-12px_rgba(0,212,255,0.25)] dark:hover:shadow-white/5
        ${c.border}
        ${className}`}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
        <div
          className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{ animation: 'scanLine 3s ease-in-out infinite' }}
        />
      </div>
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
        <div className={`absolute inset-[-100%] animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent ${c.shimmer} to-transparent`} />
      </div>
      <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${c.glow} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-tr from-cyan-500/5 to-blue-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100" />
      <div className="absolute top-0 left-0 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-cyan-400/50 to-transparent" />
        <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-cyan-400/50 to-transparent" />
      </div>
      <div className="absolute bottom-0 right-0 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-l from-cyan-400/50 to-transparent" />
        <div className="absolute bottom-0 right-0 h-full w-[1px] bg-gradient-to-t from-cyan-400/50 to-transparent" />
      </div>
      <div className="relative z-10 p-6 sm:p-8">
        {children}
      </div>
    </motion.div>
  )
}

export default function HeroAnimated() {
  const { t } = useTranslation()

  const floatingIcons = [
    { Icon: Server, label: t('home.animatedHero.floatingServer'), delay: 0, x: '8%', y: '20%' },
    { Icon: Database, label: t('home.animatedHero.floatingPool'), delay: 0.5, x: '92%', y: '25%' },
    { Icon: ShieldCheck, label: t('home.animatedHero.floatingProtection'), delay: 1, x: '5%', y: '70%' },
    { Icon: ArchiveRestore, label: t('home.animatedHero.floatingBackup'), delay: 1.5, x: '95%', y: '65%' },
    { Icon: BadgeCheck, label: t('home.animatedHero.floatingLicense'), delay: 2, x: '15%', y: '85%' },
    { Icon: HardDrive, label: t('home.animatedHero.floatingManagement'), delay: 2.5, x: '85%', y: '80%' },
  ]

  const aiTags = [
    t('home.animatedHero.aiDevTag0'),
    t('home.animatedHero.aiDevTag1'),
    t('home.animatedHero.aiDevTag2'),
    t('home.animatedHero.aiDevTag3'),
  ]

  const skills = [
    { label: t('home.animatedHero.skillFrontend'), level: 90, color: 'from-blue-500 to-indigo-400' },
    { label: t('home.animatedHero.skillAI'), level: 80, color: 'from-violet-500 to-purple-400' },
    { label: t('home.animatedHero.skillDataProtection'), level: 75, color: 'from-cyan-500 to-blue-400' },
    { label: t('home.animatedHero.skillFullstack'), level: 70, color: 'from-indigo-500 to-violet-400' },
  ]

  return (
    <section className="relative min-h-screen overflow-hidden">
      <FluidBackground />
      <DataFlowBackground />

      <div className="absolute inset-0 z-[1] flex items-center pointer-events-none">
        <ScrollingTextRow texts={scrollTexts} />
      </div>

      {floatingIcons.map((item) => (
        <FloatingIcon key={item.label} {...item} />
      ))}

      <div className="relative z-10 min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left: AI Development Card */}
          <div className="lg:col-span-4">
            <HeroCard delay={0.2} direction="left" accent="violet">
              <div className="space-y-5">
                <div className="space-y-2">
                  <span className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-violet-500 font-medium">
                    {t('home.animatedHero.aiDevLabel')}
                  </span>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-800 dark:text-white leading-tight">
                    {t('home.animatedHero.aiDevTitle')}
                  </h2>
                </div>
                <p className="text-sm sm:text-base text-neutral-500 dark:text-white/50 leading-relaxed max-w-sm">
                  {t('home.animatedHero.aiDevDesc')}
                </p>
                <div className="pt-1 flex flex-wrap gap-2">
                  {aiTags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-violet-200 bg-violet-50/80 text-violet-600 text-xs shadow-sm shadow-violet-500/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </HeroCard>
          </div>

          {/* Center: Frontend Development Card */}
          <div className="lg:col-span-5">
            <HeroCard delay={0.4} direction="up" accent="blue" className="text-center lg:text-left">
              <div className="mb-4 sm:mb-6">
                <span className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-blue-500 font-medium">
                  {t('home.animatedHero.frontendLabel')}
                </span>
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-neutral-900 dark:text-white leading-[1.1] mb-4 sm:mb-6">
                <span>{t('home.animatedHero.frontendTitle1')}</span>
                <br />
                <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
                  {t('home.animatedHero.frontendTitle2')}
                </span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-neutral-500 dark:text-white/50 max-w-md mx-auto lg:mx-0 mb-6 sm:mb-8 leading-relaxed">
                {t('home.animatedHero.frontendDesc')}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start items-center">
                <Link href="/blog" className="w-full sm:w-auto">
                  <MagneticButton className="w-full sm:w-auto px-7 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold text-sm hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-shadow duration-300">
                    <span className="flex items-center justify-center gap-2">
                      <BookOpen size={16} />
                      {t('common.browseBlog')}
                    </span>
                  </MagneticButton>
                </Link>
                <Link href="/resume" className="w-full sm:w-auto">
                  <MagneticButton className="w-full sm:w-auto px-7 py-3 rounded-full border-2 border-neutral-200 dark:border-white/20 text-neutral-600 dark:text-white/80 font-semibold text-sm hover:border-blue-400/50 hover:text-blue-600 dark:hover:text-white transition-all duration-300">
                    <span className="flex items-center justify-center gap-2">
                      <FileText size={16} />
                      {t('common.viewResume')}
                    </span>
                  </MagneticButton>
                </Link>
              </div>
            </HeroCard>
          </div>

          {/* Right: Data Protection Experience Card */}
          <div className="lg:col-span-3 hidden lg:block">
            <HeroCard delay={0.6} direction="right" accent="cyan">
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <Database size={14} className="text-cyan-400" />
                  <span className="text-[10px] tracking-[0.3em] uppercase text-cyan-500 font-medium">
                    {t('home.animatedHero.experienceLabel')}
                  </span>
                </div>
                <div className="space-y-4">
                  {skills.map((skill) => (
                    <div key={skill.label} className="space-y-1.5">
                      <div className="flex justify-between text-xs text-neutral-500 dark:text-white/50">
                        <span>{skill.label}</span>
                        <span className="font-medium">{skill.level}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-neutral-100 dark:bg-white/10 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 1.2, delay: 0.8, ease: 'easeOut' }}
                          className={`h-full rounded-full bg-gradient-to-r ${skill.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-neutral-100 dark:border-white/10 flex justify-between text-[10px] text-cyan-500">
                  <span>{t('home.animatedHero.years')}</span>
                  <span>{t('home.animatedHero.company')}</span>
                </div>
              </div>
            </HeroCard>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-widest uppercase text-cyan-400 dark:text-white/30">
            {t('home.animatedHero.scroll')}
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowDown size={16} className="text-cyan-400 dark:text-white/30" />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-50 dark:from-[#050816] to-transparent z-10" />
    </section>
  )
}
