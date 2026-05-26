'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useUserStore } from '@/stores/use-user-store'
import { useBadgeStore } from '@/stores/use-badge-store'
import { homeForRole, isAdminPath, isCompanyPath, type AppRole } from './roles'

interface Props {
  allow: AppRole[]
  children: React.ReactNode
}

export function RouteGuard({ allow, children }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const hydrated = useUserStore(s => s.hydrated)
  const token = useUserStore(s => s.token)
  const roles = useUserStore(s => s.roles)
  const fetchUserInfo = useUserStore(s => s.fetchUserInfo)
  const startPolling = useBadgeStore(s => s.startPolling)
  const stopPolling = useBadgeStore(s => s.stopPolling)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // 等 persist 中间件完成 localStorage 注水，避免误把"刚载入还未读到 token"判定为未登录
    if (!hydrated) return

    if (!token) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
      return
    }
    if (roles.length === 0) {
      fetchUserInfo()
        .then(role => {
          if (!role || role === 'visitor') {
            router.replace('/403')
          } else if (!allow.includes(role)) {
            router.replace(homeForRole(role))
          } else {
            setReady(true)
          }
        })
        .catch(() => router.replace('/login'))
      return
    }
    const role = roles[0]
    if (!allow.includes(role)) {
      router.replace(homeForRole(role))
      return
    }
    setReady(true)
  }, [hydrated, token, roles, allow, router, pathname, fetchUserInfo])

  useEffect(() => {
    if (!ready) return
    startPolling()
    const onVisibility = () => {
      if (document.visibilityState === 'visible') startPolling()
      else stopPolling()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      stopPolling()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [ready, startPolling, stopPolling])

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>{hydrated ? '正在验证身份…' : '正在恢复登录态…'}</span>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export { isAdminPath, isCompanyPath }
