// i18n 多语言支持主文件

import zhCN from './zh-CN'
import zhTW from './zh-TW'
import en from './en'
import es from './es'

export type Locale = 'zh-CN' | 'zh-TW' | 'en' | 'es'

export const locales: Locale[] = ['zh-CN', 'zh-TW', 'en', 'es']

export const defaultLocale: Locale = 'zh-CN'

export const translations = {
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  'en': en,
  'es': es,
}

// 获取翻译函数
export function getTranslation(locale: Locale = defaultLocale) {
  const t = (key: string, defaultValue?: string): string => {
    const keys = key.split('.')
    let value: unknown = translations[locale]

    for (const k of keys) {
      if (value && typeof value === 'object' && k in (value as Record<string, unknown>)) {
        value = (value as Record<string, unknown>)[k]
      } else {
        // 如果找不到翻译，尝试使用默认语言
        value = translations[defaultLocale]
        for (const k2 of keys) {
          if (value && typeof value === 'object' && k2 in (value as Record<string, unknown>)) {
            value = (value as Record<string, unknown>)[k2]
          } else {
             // 如果默认语言也找不到，返回提供的默认值或键名
            return defaultValue || key
          }
        }
        break
      }
    }

    return typeof value === 'string' ? value : (defaultValue || key)
  }

  return t
}

// 从浏览器获取语言
export function getLocaleFromBrowser(): Locale {
  if (typeof window === 'undefined') {
    return defaultLocale
  }

  const browserLang = navigator.language || (navigator as unknown as { userLanguage: string }).userLanguage

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

// 从localStorage获取语言
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

// 保存语言到localStorage
export function saveLocaleToStorage(locale: Locale): void {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem('locale', locale)
}

// 获取当前语言
export function getCurrentLocale(): Locale {
  const stored = getLocaleFromStorage()
  if (stored) {
    return stored
  }

  return getLocaleFromBrowser()
}

