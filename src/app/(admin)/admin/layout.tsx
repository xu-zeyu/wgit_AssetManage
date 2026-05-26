'use client'

import type { ReactNode } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { RouteGuard } from '@/permissions/route-guard'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RouteGuard allow={['admin']}>
      <AppShell role="admin">{children}</AppShell>
    </RouteGuard>
  )
}
