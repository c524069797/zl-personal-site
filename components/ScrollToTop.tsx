'use client'

import { FloatButton } from 'antd'

export default function ScrollToTop() {
  return (
    <FloatButton.BackTop 
      style={{ right: 24, bottom: 24 }}
      visibilityHeight={400}
    />
  )
}
