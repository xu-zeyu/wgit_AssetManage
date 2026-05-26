'use client'

import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { navForRole } from '@/permissions/nav-config'
import type { AppRole } from '@/permissions/roles'

interface Props {
  role: AppRole
}

export function Breadcrumb({ role }: Props) {
  const pathname = usePathname()
  const sections = navForRole(role)

  let best: { sectionLabel: string; itemLabel: string; href: string } | null = null

  for (const section of sections) {
    for (const item of section.items) {
      const exact = pathname === item.href
      const prefix = item.href !== '/' && pathname.startsWith(`${item.href}/`)
      if (!exact && !prefix) continue
      if (!best || item.href.length > best.href.length) {
        best = { sectionLabel: section.label, itemLabel: item.label, href: item.href }
      }
    }
  }

  const trail: Array<{ label: string }> = best
    ? [{ label: best.sectionLabel }, { label: best.itemLabel }]
    : [{ label: role === 'admin' ? '管理后台' : '公司后台' }]

  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground">
      {trail.map((item, idx) => (
        <span key={`${item.label}-${idx}`} className="flex items-center gap-1">
          {idx > 0 && <ChevronRight className="size-3.5 opacity-60" />}
          <span className={idx === trail.length - 1 ? 'font-medium text-foreground' : ''}>{item.label}</span>
        </span>
      ))}
    </nav>
  )
}
