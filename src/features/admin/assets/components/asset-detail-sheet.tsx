'use client'

import Image from 'next/image'
import { Box, Calendar, Coins, Eye, Pencil, ShoppingBag, Trash2 } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatDate, formatPrice } from '@/lib/utils'
import type { AssetSku } from '../api/types'

interface Props {
  data: AssetSku | null
  open: boolean
  onOpenChange: (v: boolean) => void
  onEdit: () => void
  onDelete: () => void
}

export function AssetDetailSheet({ data, open, onOpenChange, onEdit, onDelete }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-md overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>资产详情</SheetTitle>
          <SheetDescription>资产 SKU 的完整信息及可租用范围</SheetDescription>
        </SheetHeader>
        {!data ? null : (
          <div className="mt-6 space-y-6">
            <div className="overflow-hidden rounded-2xl border">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                {data.images?.[0]?.url ? (
                  <Image src={data.images[0].url} alt={data.name} fill sizes="480px" className="object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center text-muted-foreground">
                    <Box className="size-8" />
                  </div>
                )}
                {data.category && (
                  <Badge variant="warning" className="absolute left-3 top-3">
                    {data.category}
                  </Badge>
                )}
              </div>
              <div className="space-y-2 p-4">
                <h2 className="text-base font-semibold tracking-tight">{data.name}</h2>
                <p className="text-xs text-muted-foreground">{data.spec || '无规格'}</p>
                <div className="flex items-center justify-between pt-2">
                  <Badge variant="muted">{data.code}</Badge>
                  <div className="text-right">
                    <div className="text-[11px] text-muted-foreground">月租金</div>
                    <div className="text-lg font-semibold text-brand-600">{formatPrice(data.rentPrice)}</div>
                  </div>
                </div>
              </div>
            </div>

            <Section title="采购信息" icon={<ShoppingBag className="size-3.5" />}>
              <Row label="采购渠道" value={data.purchaseChannel || '-'} />
              <Row label="采购日期" value={formatDate(data.purchaseTime)} />
              <Row label="采购单价" value={formatPrice(data.purchasePrice)} />
              <Row label="售后" value={data.afterSale || '-'} />
            </Section>

            <Section title="使用信息" icon={<Calendar className="size-3.5" />}>
              <Row label="使用对象" value={data.useTarget || '-'} />
              <Row label="备注" value={data.remark || '-'} />
            </Section>

            <Section title="可租用公司" icon={<Coins className="size-3.5" />}>
              {data.companies?.length ? (
                <div className="flex flex-wrap gap-2">
                  {data.companies.map(c => (
                    <Badge key={c.id} variant="outline" className="border-brand-200 text-brand-700">
                      {c.name ?? `#${c.id}`}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">未配置可租用公司</p>
              )}
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

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {icon}
        {title}
      </h4>
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
