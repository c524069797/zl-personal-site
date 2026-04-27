'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Server,
  Database,
  ShieldCheck,
  ArchiveRestore,
  BadgeCheck,
  ScanEye,
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

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
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

export default function CoreExpertise() {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const expertiseItems = [
    {
      icon: Server,
      title: t('home.coreExpertise.item0Title'),
      subtitle: t('home.coreExpertise.item0Subtitle'),
      description: t('home.coreExpertise.item0Desc'),
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-500/10',
      textColor: 'text-cyan-600',
      borderColor: 'border-cyan-200/60',
      shadowColor: 'shadow-cyan-500/15',
    },
    {
      icon: Database,
      title: t('home.coreExpertise.item1Title'),
      subtitle: t('home.coreExpertise.item1Subtitle'),
      description: t('home.coreExpertise.item1Desc'),
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200/60',
      shadowColor: 'shadow-blue-500/15',
    },
    {
      icon: ShieldCheck,
      title: t('home.coreExpertise.item2Title'),
      subtitle: t('home.coreExpertise.item2Subtitle'),
      description: t('home.coreExpertise.item2Desc'),
      color: 'from-indigo-500 to-violet-500',
      bgColor: 'bg-indigo-500/10',
      textColor: 'text-indigo-600',
      borderColor: 'border-indigo-200/60',
      shadowColor: 'shadow-indigo-500/15',
    },
    {
      icon: ArchiveRestore,
      title: t('home.coreExpertise.item3Title'),
      subtitle: t('home.coreExpertise.item3Subtitle'),
      description: t('home.coreExpertise.item3Desc'),
      color: 'from-violet-500 to-purple-500',
      bgColor: 'bg-violet-500/10',
      textColor: 'text-violet-600',
      borderColor: 'border-violet-200/60',
      shadowColor: 'shadow-violet-500/15',
    },
    {
      icon: BadgeCheck,
      title: t('home.coreExpertise.item4Title'),
      subtitle: t('home.coreExpertise.item4Subtitle'),
      description: t('home.coreExpertise.item4Desc'),
      color: 'from-purple-500 to-fuchsia-500',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200/60',
      shadowColor: 'shadow-purple-500/15',
    },
    {
      icon: ScanEye,
      title: t('home.coreExpertise.item5Title'),
      subtitle: t('home.coreExpertise.item5Subtitle'),
      description: t('home.coreExpertise.item5Desc'),
      color: 'from-fuchsia-500 to-pink-500',
      bgColor: 'bg-fuchsia-500/10',
      textColor: 'text-fuchsia-600',
      borderColor: 'border-fuchsia-200/60',
      shadowColor: 'shadow-fuchsia-500/15',
    },
  ]

  return (
    <section ref={ref} className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-10 sm:mb-14"
      >
        <span className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-cyan-500 font-medium mb-3 block">
          {t('home.coreExpertise.sectionSubtitle')}
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-800 dark:text-white mb-3">
          {t('home.coreExpertise.sectionTitle')}
        </h2>
        <p className="text-sm sm:text-base text-neutral-400 dark:text-white/40 max-w-lg mx-auto">
          {t('home.coreExpertise.sectionDesc')}
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6"
      >
        {expertiseItems.map((item) => {
          const Icon = item.icon
          return (
            <motion.div
              key={item.title}
              variants={fadeInUp}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`group relative flex flex-col items-center text-center rounded-2xl border ${item.borderColor} dark:border-white/[0.08]
                bg-white/60 dark:bg-white/[0.04]
                backdrop-blur-xl
                p-5 sm:p-6
                cursor-default
                transition-all duration-500
                shadow-[0_4px_24px_-6px_rgba(0,0,0,0.06)] dark:shadow-none
                hover:shadow-lg ${item.shadowColor}
                hover:border-neutral-300 dark:hover:border-white/15`}
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
                <div
                  className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{ animation: 'scanLine 3s ease-in-out infinite' }}
                />
              </div>
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
                <div className="absolute inset-[-100%] animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-cyan-500/[0.04] to-transparent" />
              </div>
              <div className="absolute top-0 left-0 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-cyan-400/30 to-transparent" />
                <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-cyan-400/30 to-transparent" />
              </div>
              <div className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                <Icon size={26} strokeWidth={1.5} />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300" />
              </div>
              <h3 className={`font-bold text-sm sm:text-base ${item.textColor} mb-0.5 group-hover:translate-y-0 transition-transform duration-300`}>
                {item.title}
              </h3>
              <span className="text-[10px] tracking-wider uppercase text-neutral-400 dark:text-white/30 mb-2">
                {item.subtitle}
              </span>
              <motion.p
                className="text-xs text-neutral-500 dark:text-white/50 leading-relaxed overflow-hidden"
                initial={{ opacity: 0.7, height: 'auto' }}
                whileHover={{ opacity: 1 }}
              >
                {item.description}
              </motion.p>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
