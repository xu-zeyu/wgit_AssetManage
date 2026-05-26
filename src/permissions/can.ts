'use client'

import { useUserStore } from '@/stores/use-user-store'
import type { AppRole } from './roles'

export function useRole(): AppRole | null {
  const roles = useUserStore(s => s.roles)
  return roles[0] ?? null
}

export function useHasRole(...allowed: AppRole[]) {
  const role = useRole()
  return role ? allowed.includes(role) : false
}

export function useHasPermission(code: string) {
  const userInfo = useUserStore(s => s.userInfo)
  if (!userInfo) return false
  return userInfo.roles.some(r => r.permissions?.some(p => p.code === code)) ?? false
}
