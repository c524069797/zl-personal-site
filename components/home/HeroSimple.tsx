'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from 'framer-motion'
import {
  BookOpen,
  FileText,
  Github,
  Twitter,
  Mail,
  Shield,
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import ParticleBackground from './ParticleBackground'
import DataFlowBackground from './DataFlowBackground'

export default function HeroSimple() {
  const { t } = useTranslation()
  const heroRef = useRef<HTMLDivElement>(null)
  const heroMouseX = useMotionValue(0)
  const heroMouseY = useMotionValue(0)
  const heroRotateX = useSpring(useTransform(heroMouseY, [-0.5, 0.5], [3, -3]), {
    stiffness: 150,
    damping: 20,
  })
  const heroRotateY = useSpring(useTransform(heroMouseX, [-0.5, 0.5], [-3, 3]), {
    stiffness: 150,
    damping: 20,
  })

  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95])
  const heroTranslateY = useTransform(scrollY, [0, 400], [0, 60])

  const handleHeroMouseMove = (e: React.MouseEvent) => {
    const rect = heroRef.current?.getBoundingClientRect()
    if (!rect) return
    heroMouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    heroMouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleHeroMouseLeave = () => {
    heroMouseX.set(0)
    heroMouseY.set(0)
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  }

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  return (
    <motion.div
      style={{ opacity: heroOpacity, scale: heroScale, y: heroTranslateY }}
    >
      <div
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Dark mode background */}
        <div
          className="absolute inset-0 dark:block hidden"
          style={{ background: 'linear-gradient(135deg, #050816 0%, #0a0f2c 50%, #050816 100%)' }}
        />

        {/* Data flow background - light mode only */}
        <div className="dark:hidden absolute inset-0 z-0">
          <DataFlowBackground />
        </div>

        {/* Particle canvas - dark mode only */}
        <div className="dark:block hidden absolute inset-0 z-0">
          <ParticleBackground />
        </div>

        {/* Radial glow center */}
        <div className="absolute inset-0 z-[1]">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)',
            }}
          />
        </div>

        {/* Hero content */}
        <motion.div
          style={{
            rotateX: heroRotateX,
            rotateY: heroRotateY,
            transformPerspective: 1200,
          }}
          className="relative z-10 text-center px-4 sm:px-6 w-full max-w-5xl mx-auto"
        >
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="mb-4 sm:mb-6">
              <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-cyan-200 dark:border-cyan-500/30 bg-white/60 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 text-xs sm:text-sm backdrop-blur-sm shadow-sm shadow-cyan-500/10">
                <Shield size={14} />
                {t('home.simpleHero.badge')}
              </span>
            </motion.div>

            {/* Avatar + Name row */}
            <motion.div variants={fadeInUp} className="mb-4 sm:mb-6 flex flex-col items-center">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-pulse-slow shadow-lg shadow-cyan-500/30" />
                <div className="absolute inset-[2px] rounded-full overflow-hidden bg-white dark:bg-[#0c0f1a]">
                  <Image
                    src="/my-profile.png"
                    alt={t('home.simpleHero.avatarAlt')}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeInUp}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 dark:from-white dark:via-cyan-200 dark:to-blue-400 bg-clip-text text-transparent">
                {t('home.simpleHero.title')}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              className="text-sm sm:text-lg md:text-xl text-neutral-500 dark:text-white/60 max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed px-2"
            >
              {t('home.simpleHero.subtitle')}
            </motion.p>

            {/* Vision tagline */}
            <motion.div variants={fadeInUp} className="mb-6 sm:mb-8">
              <p className="text-xs sm:text-sm text-cyan-500 dark:text-white/40 tracking-wide">
                {t('home.simpleHero.tagline')}
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-0"
            >
              <Link href="/blog" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto px-8 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold text-sm sm:text-base shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-shadow duration-300"
                >
                  <span className="flex items-center justify-center gap-2">
                    <BookOpen size={18} />
                    {t('common.browseBlog')}
                  </span>
                </motion.button>
              </Link>
              <Link href="/resume" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto px-8 py-3 sm:py-3.5 rounded-full border-2 border-cyan-200 dark:border-white/20 text-cyan-600 dark:text-white/80 font-semibold text-sm sm:text-base bg-white/50 dark:bg-transparent backdrop-blur-sm hover:border-cyan-400/50 hover:text-cyan-700 dark:hover:text-white transition-all duration-300"
                >
                  <span className="flex items-center justify-center gap-2">
                    <FileText size={18} />
                    {t('common.viewResume')}
                  </span>
                </motion.button>
              </Link>
            </motion.div>

            {/* Social links */}
            <motion.div variants={fadeInUp} className="mt-8 sm:mt-10 flex justify-center gap-3">
              {[
                { icon: <Github size={16} />, href: 'https://github.com/c524069797', label: 'GitHub' },
                { icon: <Twitter size={16} />, href: 'https://twitter.com', label: 'Twitter' },
                { icon: <Mail size={16} />, href: 'mailto:chenzhuo995@gmail.com', label: 'Email' },
              ].map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-xl border border-cyan-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] backdrop-blur-sm flex items-center justify-center text-cyan-400 dark:text-white/50 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-400/50 transition-colors duration-300 shadow-sm"
                  aria-label={s.label}
                >
                  {s.icon}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-neutral-50 dark:from-[#050816] via-white/80 dark:via-[#050816]/80 to-transparent z-10" />
      </div>
    </motion.div>
  )
}
