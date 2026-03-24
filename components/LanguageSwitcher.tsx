'use client'

import { useState } from 'react'
import { Select } from 'antd'
import { GlobalOutlined } from '@ant-design/icons'
import { getCurrentLocale, saveLocaleToStorage, type Locale } from '@/lib/i18n'

export function LanguageSwitcher() {
  const [locale, setLocale] = useState<Locale>(() => getCurrentLocale())

  const handleChange = (value: Locale) => {
    setLocale(value)
    saveLocaleToStorage(value)
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

