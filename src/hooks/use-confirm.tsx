'use client'

import { useState, useCallback, type ReactNode } from 'react'
import { ConfirmDialog } from '@/components/common/confirm-dialog'

interface ConfirmOptions {
  title?: string
  description?: ReactNode
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
}

export function useConfirm() {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmOptions>({})
  const [resolver, setResolver] = useState<((v: boolean) => void) | null>(null)

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    setOptions(opts)
    setOpen(true)
    return new Promise<boolean>(resolve => setResolver(() => resolve))
  }, [])

  const node = (
    <ConfirmDialog
      open={open}
      onOpenChange={v => {
        setOpen(v)
        if (!v) resolver?.(false)
      }}
      title={options.title}
      description={options.description}
      confirmText={options.confirmText}
      cancelText={options.cancelText}
      variant={options.variant}
      onConfirm={async () => {
        resolver?.(true)
      }}
    />
  )

  return { confirm, node }
}
