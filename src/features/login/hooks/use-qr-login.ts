'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import QRCode from 'qrcode'
import { toast } from 'sonner'
import { checkQrStatusApi, createQrSessionApi, getTokenByCodeApi } from '@/services/auth/auth-api'
import { useUserStore } from '@/stores/use-user-store'
import { homeForRole } from '@/permissions/roles'

export type QrStatus = 'loading' | 'waiting' | 'scanned' | 'confirmed' | 'expired'

const POLL_INTERVAL_MS = 2000
const MAX_POLLS = 150

export function useQrLogin(active: boolean) {
  const router = useRouter()
  const params = useSearchParams()
  const loginByQrCode = useUserStore(s => s.loginByQrCode)

  const [qrImage, setQrImage] = useState('')
  const [qrId, setQrId] = useState('')
  const [status, setStatus] = useState<QrStatus>('loading')

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pollCountRef = useRef(0)

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const finalizeLogin = useCallback(
    async (code: string) => {
      stop()
      setStatus('confirmed')
      try {
        const tokenRes = await getTokenByCodeApi(code)
        if (tokenRes.code !== '200') {
          toast.error('登录失败，请重新扫码')
          setStatus('expired')
          return
        }
        const { accessToken, refreshToken } = tokenRes.data
        const role = await loginByQrCode(accessToken, refreshToken)
        if (!role || role === 'visitor') {
          toast.error('当前账号没有访问权限')
          setStatus('expired')
          return
        }
        toast.success('登录成功')
        const redirect = params.get('redirect')
        router.replace(redirect && redirect !== '/' ? redirect : homeForRole(role))
      } catch {
        toast.error('登录失败，请重新扫码')
        setStatus('expired')
      }
    },
    [loginByQrCode, params, router, stop],
  )

  const startPolling = useCallback(
    (qrcodeId: string) => {
      stop()
      pollCountRef.current = 0
      timerRef.current = setInterval(async () => {
        pollCountRef.current += 1
        if (pollCountRef.current > MAX_POLLS) {
          stop()
          setStatus('expired')
          return
        }
        try {
          const res = await checkQrStatusApi(qrcodeId)
          if (res.code !== '200') return
          const { status: qrState, code } = res.data
          if (qrState === 'PENDING') setStatus('waiting')
          else if (qrState === 'SCANNED') setStatus('scanned')
          else if (qrState === 'EXPIRED') {
            stop()
            setStatus('expired')
          } else if (qrState === 'CONFIRMED' && code) {
            await finalizeLogin(code)
          }
        } catch {
          // 容忍少量网络错误
        }
      }, POLL_INTERVAL_MS)
    },
    [finalizeLogin, stop],
  )

  const generate = useCallback(async () => {
    stop()
    setStatus('loading')
    setQrImage('')
    try {
      const res = await createQrSessionApi()
      const code: any = res as any
      const qrcodeId: string = code.data?.qrcodeId || code.data?.qrcode_id || code.data?.id || code.data
      if (!qrcodeId) {
        setStatus('expired')
        return
      }
      const dataUrl = await QRCode.toDataURL(qrcodeId, {
        width: 224,
        margin: 2,
        color: { dark: '#1F1F1F', light: '#FFFFFF' },
      })
      setQrId(qrcodeId)
      setQrImage(dataUrl)
      setStatus('waiting')
      startPolling(qrcodeId)
    } catch {
      setStatus('expired')
    }
  }, [startPolling, stop])

  useEffect(() => {
    if (!active) return
    void generate()
    return () => stop()
  }, [active, generate, stop])

  return { qrImage, qrId, status, refresh: generate }
}
