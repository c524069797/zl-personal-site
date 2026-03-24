'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMounted(true)
    }, 0)

    return () => window.clearTimeout(timer)
  }, [])

  if (!mounted) {
    return (
      <div className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 dark:border-white dark:bg-gray-800 dark:text-white">
        💻
      </div>
    )
  }

  const handleToggle = () => {
    const currentTheme = theme || 'system'

    if (currentTheme === 'light') {
      setTheme('dark')
    } else if (currentTheme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getIcon = () => {
    const currentTheme = theme || 'system'

    if (currentTheme === 'system') {
      return '💻'
    }
    if (resolvedTheme === 'dark') {
      return '🌙'
    }
    return '☀️'
  }

  return (
    <button
      onClick={handleToggle}
      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
      aria-label="切换主题"
      type="button"
    >
      {getIcon()}
    </button>
  )
}

