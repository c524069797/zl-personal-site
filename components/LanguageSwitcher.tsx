'use client'

import { useState, useEffect } from 'react'
import { Select } from 'antd'
import { GlobalOutlined } from '@ant-design/icons'
import { getCurrentLocale, saveLocaleToStorage, getTranslation, type Locale } from '@/lib/i18n'

export function LanguageSwitcher() {
  const [locale, setLocale] = useState<Locale>('zh-CN')

  useEffect(() => {
    setLocale(getCurrentLocale())
  }, [])

  const handleChange = (value: Locale) => {
    setLocale(value)
    saveLocaleToStorage(value)
    // 触发语言变更事件，让所有使用useTranslation的组件重新渲染
    window.dispatchEvent(new CustomEvent('locale-change', { detail: value }))
  }

  const options = [
    { value: 'zh-CN', label: '简体中文' },
    { value: 'zh-TW', label: '繁體中文' },
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
  ]

  return (
    <Select
      value={locale}
      onChange={handleChange}
      style={{ width: 120 }}
      suffixIcon={<GlobalOutlined />}
      options={options}
    />
  )
}

