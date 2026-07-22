'use client'

import { motion } from 'framer-motion'
import { Zap, Layout, Box } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

type HeroMode = 'animated' | 'simple' | '3d'

interface ModeToggleProps {
  mode: HeroMode
  onToggle: () => void
}

export default function ModeToggle({ mode, onToggle }: ModeToggleProps) {
  const { t } = useTranslation()

  const config: Record<HeroMode, { icon: React.ReactNode; label: string }> = {
    '3d': { icon: <Box size={18} className="text-cyan-500" />, label: t('home.modeToggle.threeD') },
    animated: { icon: <Zap size={18} className="text-amber-500" />, label: t('home.modeToggle.animated') },
    simple: { icon: <Layout size={18} className="text-indigo-500" />, label: t('home.modeToggle.simple') },
  }

  const current = config[mode]

  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full border border-neutral-200 dark:border-white/10 bg-white/80 dark:bg-white/10 backdrop-blur-md shadow-lg hover:shadow-xl transition-shadow duration-300"
      title={t('home.modeToggle.switchStyle')}
    >
      <motion.div
        key={mode}
        initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="flex h-5 w-5 items-center justify-center"
      >
        {current.icon}
      </motion.div>
      <span className="text-xs font-medium text-neutral-600 dark:text-white/70">
        {current.label}
      </span>
    </motion.button>
  )
}
