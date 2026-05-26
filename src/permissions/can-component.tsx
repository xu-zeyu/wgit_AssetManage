'use client'

import type { ReactNode } from 'react'
import { useHasPermission, useHasRole } from './can'
import type { AppRole } from './roles'

interface CanRoleProps {
  roles: AppRole[]
  fallback?: ReactNode
  children: ReactNode
}

export function CanRole({ roles, fallback = null, children }: CanRoleProps) {
  const allowed = useHasRole(...roles)
  return <>{allowed ? children : fallback}</>
}

interface CanPermissionProps {
  code: string
  fallback?: ReactNode
  children: ReactNode
}

export function CanPermission({ code, fallback = null, children }: CanPermissionProps) {
  const allowed = useHasPermission(code)
  return <>{allowed ? children : fallback}</>
}
