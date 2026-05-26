'use client'

import Image from 'next/image'
import { Check, Loader2, RefreshCw, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useQrLogin } from '../hooks/use-qr-login'
import { cn } from '@/lib/utils'

interface Props {
  active: boolean
}

const STATUS_META = {
  loading: { tone: 'muted', text: '正在生成二维码' },
  waiting: { tone: 'muted', text: '请使用手机扫码登录' },
  scanned: { tone: 'info', text: '扫码成功，请在手机端确认' },
  confirmed: { tone: 'success', text: '登录成功，正在跳转' },
  expired: { tone: 'warning', text: '二维码已过期，请刷新' },
} as const

export function QrForm({ active }: Props) {
  const { qrImage, status, refresh } = useQrLogin(active)
  const meta = STATUS_META[status]

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative grid size-56 place-items-center overflow-hidden rounded-2xl border bg-white shadow-sm">
        {qrImage ? (
          <Image src={qrImage} alt="二维码登录" width={224} height={224} className="size-56" unoptimized />
        ) : (
          <Skeleton className="size-56 rounded-2xl" />
        )}
        {status !== 'waiting' && status !== 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/90 backdrop-blur">
            <Overlay status={status} />
          </div>
        )}
      </div>
      <p
        className={cn(
          'text-sm font-medium',
          meta.tone === 'success' && 'text-success',
          meta.tone === 'info' && 'text-info',
          meta.tone === 'warning' && 'text-warning',
          meta.tone === 'muted' && 'text-muted-foreground',
        )}
      >
        {meta.text}
      </p>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={refresh}
        disabled={status === 'scanned' || status === 'loading'}
      >
        <RefreshCw className="size-4" />
        刷新二维码
      </Button>
    </div>
  )
}

function Overlay({ status }: { status: 'scanned' | 'confirmed' | 'expired' }) {
  if (status === 'scanned') {
    return (
      <>
        <Loader2 className="size-8 animate-spin text-info" />
        <span className="text-sm text-muted-foreground">等待手机端确认</span>
      </>
    )
  }
  if (status === 'confirmed') {
    return (
      <>
        <Check className="size-8 text-success" />
        <span className="text-sm text-muted-foreground">登录成功</span>
      </>
    )
  }
  return (
    <>
      <X className="size-8 text-destructive" />
      <span className="text-sm text-muted-foreground">二维码已过期</span>
    </>
  )
}
