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
  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[locale]

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // 如果找不到翻译，尝试使用默认语言
        value = translations[defaultLocale]
        for (const k2 of keys) {
          if (value && typeof value === 'object' && k2 in value) {
            value = value[k2]
          } else {
            return key
          }
        }
        break
      }
    }

    return typeof value === 'string' ? value : key
  }

  return t
}

// 从浏览器获取语言
export function getLocaleFromBrowser(): Locale {
  if (typeof window === 'undefined') {
    return defaultLocale
  }

  const browserLang = navigator.language || (navigator as any).userLanguage

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

