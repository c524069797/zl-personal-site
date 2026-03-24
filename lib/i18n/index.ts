// i18n 多语言支持主文件

import zhCN from './zh-CN'
import zhTW from './zh-TW'
import en from './en'
import es from './es'

export type Locale = 'zh-CN' | 'zh-TW' | 'en' | 'es'

interface TranslationObject {
  [key: string]: string | TranslationObject
}

type TranslationValue = string | TranslationObject

type BrowserNavigator = Navigator & {
  userLanguage?: string
}

export const locales: Locale[] = ['zh-CN', 'zh-TW', 'en', 'es']

export const defaultLocale: Locale = 'zh-CN'

export const translations: Record<Locale, TranslationValue> = {
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  en,
  es,
}

const getNestedTranslation = (value: TranslationValue, keys: string[]) => {
  let currentValue: TranslationValue | undefined = value

  for (const key of keys) {
    if (!currentValue || typeof currentValue === 'string' || !(key in currentValue)) {
      return null
    }
    currentValue = currentValue[key]
  }

  return typeof currentValue === 'string' ? currentValue : null
}

export function getTranslation(locale: Locale = defaultLocale) {
  return (key: string): string => {
    const keys = key.split('.')
    const currentValue = getNestedTranslation(translations[locale], keys)

    if (currentValue) {
      return currentValue
    }

    return getNestedTranslation(translations[defaultLocale], keys) || key
  }
}

export function getLocaleFromBrowser(): Locale {
  if (typeof window === 'undefined') {
    return defaultLocale
  }

  const browserLang = navigator.language || (navigator as BrowserNavigator).userLanguage || defaultLocale

  if (browserLang.startsWith('zh')) {
    if (browserLang.includes('TW') || browserLang.includes('HK') || browserLang.includes('MO')) {
      return 'zh-TW'
    }
    return 'zh-CN'
  }

  if (browserLang.startsWith('es')) {
    return 'es'
  }

  if (browserLang.startsWith('en')) {
    return 'en'
  }

  return defaultLocale
}

export function getLocaleFromStorage(): Locale | null {
  if (typeof window === 'undefined') {
    return null
  }

  const stored = localStorage.getItem('locale')

  if (stored && locales.includes(stored as Locale)) {
    return stored as Locale
  }

  return null
}

export function saveLocaleToStorage(locale: Locale): void {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem('locale', locale)
}

export function getCurrentLocale(): Locale {
  const stored = getLocaleFromStorage()

  if (stored) {
    return stored
  }

  return getLocaleFromBrowser()
}

