'use client'

import { useEffect } from 'react'
import { TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4">
      <div className="max-w-md space-y-4 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-3xl bg-destructive/10 text-destructive">
          <TriangleAlert className="size-7" />
        </div>
        <h1 className="text-2xl font-semibold">页面出错了</h1>
        <p className="text-sm text-muted-foreground">
          {error.message || '请稍后再试或联系系统管理员'}
        </p>
        <Button onClick={reset}>重试</Button>
      </div>
    </main>
  )
}
