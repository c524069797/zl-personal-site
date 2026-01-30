'use client'

import { AppProgressBar } from 'next-nprogress-bar'

export function LoadingBar() {
  return (
    <AppProgressBar
      height="3px"
      color="#1890ff"
      options={{ showSpinner: false }}
      shallowRouting
    />
  )
}

