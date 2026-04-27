'use client'

import { motion } from 'framer-motion'
import { Zap, Layout } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

interface ModeToggleProps {
  mode: 'animated' | 'simple'
  onToggle: () => void
}

export default function ModeToggle({ mode, onToggle }: ModeToggleProps) {
  const { t } = useTranslation()

  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full border border-neutral-200 dark:border-white/10 bg-white/80 dark:bg-white/10 backdrop-blur-md shadow-lg hover:shadow-xl transition-shadow duration-300"
      title={mode === 'animated' ? t('home.modeToggle.switchToSimple') : t('home.modeToggle.switchToAnimated')}
    >
      <div className="relative w-5 h-5">
        <motion.div
          initial={false}
          animate={{
            opacity: mode === 'animated' ? 1 : 0,
            rotate: mode === 'animated' ? 0 : -90,
          }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0"
        >
          <Zap size={18} className="text-amber-500" />
        </motion.div>
        <motion.div
          initial={false}
          animate={{
            opacity: mode === 'simple' ? 1 : 0,
            rotate: mode === 'simple' ? 0 : 90,
          }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0"
        >
          <Layout size={18} className="text-indigo-500" />
        </motion.div>
      </div>
      <span className="text-xs font-medium text-neutral-600 dark:text-white/70">
        {mode === 'animated' ? t('home.modeToggle.animated') : t('home.modeToggle.simple')}
      </span>
    </motion.button>
  )
}
