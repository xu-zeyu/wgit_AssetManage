'use client'

import Image from 'next/image'
import { Building2, Pencil, Trash2 } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import type { Company } from '../api/types'

interface Props {
  data: Company | null
  open: boolean
  onOpenChange: (v: boolean) => void
  onEdit: () => void
  onDelete: () => void
}

export function CompanyDetailSheet({ data, open, onOpenChange, onEdit, onDelete }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-md overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>公司详情</SheetTitle>
          <SheetDescription>查看公司基础信息、管理员与租金政策</SheetDescription>
        </SheetHeader>
        {!data ? null : (
          <div className="mt-6 space-y-6">
            <div className="flex items-center gap-4 rounded-2xl border bg-gradient-to-br from-brand-50/60 to-transparent p-5">
              <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-muted">
                {data.icon?.url ? (
                  <Image src={data.icon.url} alt={data.name} width={56} height={56} className="size-14 object-cover" />
                ) : (
                  <Building2 className="size-6 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold tracking-tight">{data.name}</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">编码 · {data.code}</p>
                <Badge variant="warning" className="mt-2">{data.rentPolicy?.name ?? '未设政策'}</Badge>
              </div>
            </div>

            <Section title="基础信息">
              <Row label="公司 ID" value={`#${data.id}`} />
              <Row label="信用代码" value={data.creditCode || '-'} />
              <Row label="办公地址" value={data.address || '-'} />
            </Section>

            <Section title="管理员">
              <Row label="账号 ID" value={data.admin?.id ? `#${data.admin.id}` : '-'} />
              <Row label="昵称" value={data.admin?.nickname || '-'} />
            </Section>

            <Section title="租金政策">
              <Row label="策略 ID" value={data.rentPolicy?.id ? `#${data.rentPolicy.id}` : '-'} />
              <Row label="策略名称" value={data.rentPolicy?.name || '-'} />
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right text-foreground">{value || '-'}</span>
    </div>
  )
}
