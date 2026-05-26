'use client'

import { Building2, MapPin, Phone, UserCircle2 } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { CompanyMember } from '../api/types'

interface Props {
  data: CompanyMember | null
  open: boolean
  onOpenChange: (v: boolean) => void
}

export function MemberDetailSheet({ data, open, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-md overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>成员详情</SheetTitle>
          <SheetDescription>成员的联系方式与归属信息</SheetDescription>
        </SheetHeader>
        {!data ? null : (
          <div className="mt-6 space-y-6">
            <div className="flex items-center gap-4 rounded-2xl border bg-gradient-to-br from-brand-50/60 to-transparent p-5">
              <Avatar className="size-14">
                <AvatarImage src={`https://robohash.org/${data.user?.id ?? data.id}?set=set4&bgset=bg1`} />
                <AvatarFallback>{(data.name ?? data.user?.nickname ?? '?').charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold tracking-tight">
                  {data.name || data.user?.nickname || data.user?.username || '未命名'}
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {data.user?.username ? `@${data.user.username}` : `#${data.id}`}
                </p>
                {data.area?.name && (
                  <Badge variant="muted" className="mt-2">
                    <MapPin className="mr-1 size-3" />
                    {data.area.name}
                  </Badge>
                )}
              </div>
            </div>

            <Section title="联系方式">
              <Row label="手机号" value={data.mobile ?? '-'} icon={<Phone className="size-3.5" />} />
            </Section>

            <Section title="组织归属">
              <Row label="部门" value={data.department ?? '-'} icon={<Building2 className="size-3.5" />} />
              <Row label="岗位" value={data.position ?? '-'} icon={<UserCircle2 className="size-3.5" />} />
              <Row label="办公区域" value={data.area?.name ?? '-'} icon={<MapPin className="size-3.5" />} />
            </Section>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h4>
      <div className="space-y-2 rounded-2xl border bg-background/40 p-4">{children}</div>
    </div>
  )
}

function Row({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className="flex items-center gap-1 text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="text-right text-foreground">{value || '-'}</span>
    </div>
  )
}
