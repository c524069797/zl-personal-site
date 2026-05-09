'use client'

import { useEffect } from 'react'
import { Button, Result } from 'antd'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Result
        status="error"
        title="页面出错了"
        subTitle={error.message || '发生了意外错误，请尝试刷新页面。'}
        extra={
          <Button type="primary" onClick={reset}>
            重试
          </Button>
        }
      />
    </div>
  )
}
