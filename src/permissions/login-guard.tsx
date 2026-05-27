'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/stores/use-user-store'
import { homeForRole } from './roles'

interface Props {
  children: ReactNode
}

export function LoginGuard({ children }: Props) {
  const router = useRouter()
  const hydrated = useUserStore(s => s.hydrated)
  const token = useUserStore(s => s.token)
  const roles = useUserStore(s => s.roles)
  const fetchUserInfo = useUserStore(s => s.fetchUserInfo)
  const [allow, setAllow] = useState(false)

  useEffect(() => {
    if (!hydrated) return

    if (!token) {
      setAllow(true)
      return
    }

    if (roles.length > 0) {
      router.replace(homeForRole(roles[0]))
      return
    }

    fetchUserInfo()
      .then(role => {
        if (role && role !== 'visitor') {
          router.replace(homeForRole(role))
        } else {
          setAllow(true)
        }
      })
      .catch(() => setAllow(true))
  }, [hydrated, token, roles, router, fetchUserInfo])

  if (!allow) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>{hydrated ? '正在跳转…' : '正在恢复登录态…'}</span>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
