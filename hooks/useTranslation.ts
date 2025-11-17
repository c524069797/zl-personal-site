'use client'

import { useState, useEffect } from 'react'
import { getCurrentLocale, getTranslation, type Locale } from '@/lib/i18n'

export function useTranslation() {
  const [locale, setLocale] = useState<Locale>(getCurrentLocale())
  const t = getTranslation(locale)

  useEffect(() => {
    const handleLocaleChange = (event: CustomEvent<Locale>) => {
      setLocale(event.detail)
    }

    window.addEventListener('locale-change', handleLocaleChange as EventListener)

    return () => {
      window.removeEventListener('locale-change', handleLocaleChange as EventListener)
    }
  }, [])

  return { t, locale }
}

