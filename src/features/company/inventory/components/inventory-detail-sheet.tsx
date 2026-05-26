'use client'

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from '@/components/common/status-badge'
import { INVENTORY_STATUS_LABEL, type InventoryStatus, type InventoryTask } from '../api/types'
import { formatDate } from '@/lib/utils'

interface Props {
  data: InventoryTask | null
  open: boolean
  onOpenChange: (v: boolean) => void
}

const TONE: Record<InventoryStatus, 'warning' | 'info' | 'success'> = {
  PENDING: 'warning',
  INVENTORYING: 'info',
  COMPLETED: 'success',
}

export function InventoryDetailSheet({ data, open, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-md overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>盘点任务详情</SheetTitle>
          <SheetDescription>查看盘点进度与异常情况</SheetDescription>
        </SheetHeader>
        {!data ? null : (
          <div className="mt-6 space-y-6">
            <div className="rounded-2xl border bg-gradient-to-br from-brand-50/60 to-transparent p-5">
              <div className="text-xs text-muted-foreground">盘点区域</div>
              <div className="mt-1 text-lg font-semibold tracking-tight">{data.area?.name ?? '未指定'}</div>
              <div className="mt-3 flex items-center gap-2">
                <StatusBadge label={INVENTORY_STATUS_LABEL[data.status]} tone={TONE[data.status]} />
                <Badge variant="muted">任务 #{data.id}</Badge>
              </div>
            </div>

            <Section title="进度统计">
              <div className="grid grid-cols-3 gap-3">
                <Stat label="计划数量" value={data.planInventoryCount} />
                <Stat label="待盘点" value={data.pendingInventoryCount} tone="warning" />
                <Stat label="已盘点" value={data.completedInventoryCount} tone="success" />
                <Stat label="实际盘到" value={data.actualInventoryCount} />
                <Stat label="异常" value={data.abnormalInventoryCount} tone="destructive" />
              </div>
            </Section>

            <Section title="时间与负责人">
              <Row label="计划日期" value={formatDate(data.planInventoryDate)} />
              <Row label="盘点人" value={data.inventoryUser?.name ?? '-'} />
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right text-foreground">{value || '-'}</span>
    </div>
  )
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone?: 'warning' | 'success' | 'destructive'
}) {
  const toneClass =
    tone === 'warning'
      ? 'text-warning'
      : tone === 'success'
        ? 'text-success'
        : tone === 'destructive'
          ? 'text-destructive'
          : ''
  return (
    <div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className={`text-xl font-semibold tabular-nums ${toneClass}`}>{value}</div>
    </div>
  )
}
