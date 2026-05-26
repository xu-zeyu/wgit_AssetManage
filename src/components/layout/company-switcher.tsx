'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Building2, Check, ChevronsUpDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCompanyStore } from '@/stores/use-company-store'
import { cn } from '@/lib/utils'

export function CompanySwitcher() {
  const router = useRouter()
  const current = useCompanyStore(s => s.current)
  const list = useCompanyStore(s => s.list)
  const loadManaged = useCompanyStore(s => s.loadManaged)
  const switchCompany = useCompanyStore(s => s.switchCompany)

  useEffect(() => {
    void loadManaged(true)
  }, [loadManaged])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group flex w-full items-center gap-3 rounded-2xl border bg-background/40 px-3 py-2 text-left transition-colors hover:bg-accent">
        <div className="grid size-10 place-items-center overflow-hidden rounded-xl bg-muted text-muted-foreground">
          {current?.icon?.url ? (
            <Image src={current.icon.url} alt="" width={40} height={40} className="size-10 object-cover" />
          ) : (
            <Building2 className="size-5" />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-semibold">{current?.name ?? '选择公司'}</span>
          <span className="truncate text-xs text-muted-foreground">{current?.code ?? '点击切换'}</span>
        </div>
        <ChevronsUpDown className="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>我管理的公司</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {list.length === 0 && (
          <DropdownMenuItem disabled>暂无可切换公司</DropdownMenuItem>
        )}
        {list.map(c => {
          const active = c.id === current?.id
          return (
            <DropdownMenuItem
              key={c.id}
              onClick={() => {
                if (!switchCompany(c)) return
                router.refresh()
              }}
              className={cn(active && 'bg-accent')}
            >
              <div className="grid size-7 place-items-center overflow-hidden rounded-lg bg-muted">
                {c.icon?.url ? (
                  <Image src={c.icon.url} alt="" width={28} height={28} className="size-7 object-cover" />
                ) : (
                  <Building2 className="size-4 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm">{c.name}</div>
                <div className="truncate text-xs text-muted-foreground">{c.code}</div>
              </div>
              {active && <Check className="size-4 text-primary" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
