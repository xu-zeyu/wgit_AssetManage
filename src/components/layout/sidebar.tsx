'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useBadgeStore } from '@/stores/use-badge-store'
import { navForRole } from '@/permissions/nav-config'
import type { AppRole } from '@/permissions/roles'
import { CompanySwitcher } from './company-switcher'
import { cn } from '@/lib/utils'

interface Props {
  role: AppRole
  onNavigate?: () => void
}

export function Sidebar({ role, onNavigate }: Props) {
  const pathname = usePathname()
  const sections = navForRole(role)
  const badges = useBadgeStore(s => s.count)

  // 最长前缀匹配：避免 `/admin/assets` 同时命中 `/admin` 与 `/admin/assets`
  const activeHref = useMemo(() => {
    let best = ''
    for (const section of sections) {
      for (const item of section.items) {
        const matched =
          pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`))
        if (matched && item.href.length > best.length) best = item.href
      }
    }
    return best
  }, [pathname, sections])

  return (
    <div className="flex h-full flex-col">
      <div className="px-4 py-5">
        {role === 'admin' ? <BrandHeader /> : <CompanySwitcher />}
      </div>
      <Separator />
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-6">
          {sections.map(section => (
            <div key={section.label} className="space-y-2">
              <div className="px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {section.label}
              </div>
              <ul className="space-y-1">
                {section.items.map(item => {
                  const active = item.href === activeHref
                  const count = item.badgeKey ? badges[item.badgeKey] : 0
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        className={cn(
                          'group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors',
                          active
                            ? 'bg-primary/10 text-primary'
                            : 'text-foreground/70 hover:bg-accent hover:text-foreground',
                        )}
                      >
                        {active && (
                          <motion.span
                            layoutId="sidebar-active"
                            className="absolute inset-y-1 left-0 w-1 rounded-r-full bg-primary"
                            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                          />
                        )}
                        <item.icon className="size-4 shrink-0" />
                        <span className="flex-1 truncate">{item.label}</span>
                        {count > 0 && (
                          <Badge variant="warning" className="ml-auto px-2 text-[10px]">
                            {count > 99 ? '99+' : count}
                          </Badge>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </ScrollArea>
      <div className="px-4 py-4 text-xs text-muted-foreground">
        © {new Date().getFullYear()} 唯刚资产管理
      </div>
    </div>
  )
}

function BrandHeader() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-500 text-primary-foreground shadow-sm">
        <span className="text-lg font-bold">W</span>
      </div>
      <div className="leading-tight">
        <div className="text-base font-semibold">唯刚资产</div>
        <div className="text-xs text-muted-foreground">管理后台</div>
      </div>
    </div>
  )
}
