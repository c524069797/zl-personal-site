'use client'

import { AppProgressBar } from 'next-nprogress-bar'

export function LoadingBar() {
  return (
    <AppProgressBar
      height="4px"
      color="#06b6d4"
      options={{
        showSpinner: true,
        trickleSpeed: 150,
        speed: 300,
        minimum: 0.1,
      }}
      shallowRouting={false}
    />
  )
}
