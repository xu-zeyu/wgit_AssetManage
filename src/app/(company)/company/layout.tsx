'use client'

import type { ReactNode } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { RouteGuard } from '@/permissions/route-guard'

export default function CompanyLayout({ children }: { children: ReactNode }) {
  return (
    <RouteGuard allow={['company']}>
      <AppShell role="company">{children}</AppShell>
    </RouteGuard>
  )
}
