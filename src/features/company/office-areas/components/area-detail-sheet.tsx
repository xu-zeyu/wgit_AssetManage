'use client'

import { MapPin, Pencil, Trash2, UserRound } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { OfficeArea } from '../api/types'

interface Props {
  data: OfficeArea | null
  open: boolean
  onOpenChange: (v: boolean) => void
  onEdit: () => void
  onDelete: () => void
}

export function AreaDetailSheet({ data, open, onOpenChange, onEdit, onDelete }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-md overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>区域详情</SheetTitle>
          <SheetDescription>办公区域的位置与管理信息</SheetDescription>
        </SheetHeader>
        {!data ? null : (
          <div className="mt-6 space-y-6">
            <div className="flex items-center gap-4 rounded-2xl border bg-gradient-to-br from-brand-50/60 to-transparent p-5">
              <div className="grid size-12 place-items-center rounded-2xl bg-brand-100/60 text-brand-600">
                <MapPin className="size-6" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold tracking-tight">{data.name}</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">区域 ID #{data.id}</p>
              </div>
            </div>

            <Section title="位置信息">
              <Row label="地址" value={data.address || '-'} />
              <Row label="备注" value={data.remark || '-'} />
            </Section>

            <Section title="负责人">
              <Row label="管理员" value={data.admin?.nickname || '-'} icon={<UserRound className="size-3.5" />} />
              <Row label="账号 ID" value={data.admin?.id ? `#${data.admin.id}` : '-'} />
            </Section>

            <Separator />

            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={onDelete} className="text-destructive hover:text-destructive">
                <Trash2 className="size-4" />
                删除
              </Button>
              <Button onClick={onEdit}>
                <Pencil className="size-4" />
                编辑
              </Button>
            </div>
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
