'use client'

import { useState } from 'react'
import { Eye, Plus } from 'lucide-react'
import { PageHeader } from '@/components/common/page-header'
import { SearchBar } from '@/components/common/search-bar'
import { Pagination } from '@/components/common/pagination'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Empty } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge } from '@/components/common/status-badge'
import { useInventory } from '@/features/company/inventory/hooks/use-inventory'
import { INVENTORY_STATUS_LABEL, type InventoryStatus, type InventoryTask } from '@/features/company/inventory/api/types'
import { InventoryCreateDialog } from '@/features/company/inventory/components/inventory-create-dialog'
import { InventoryDetailSheet } from '@/features/company/inventory/components/inventory-detail-sheet'
import { formatDate } from '@/lib/utils'

const STATUS_TONE: Record<InventoryStatus, 'warning' | 'info' | 'success'> = {
  PENDING: 'warning',
  INVENTORYING: 'info',
  COMPLETED: 'success',
}

export default function InventoryPage() {
  const { filters, setFilters, list, create } = useInventory()
  const [open, setOpen] = useState(false)
  const [detail, setDetail] = useState<InventoryTask | null>(null)

  const data = list.data?.data
  const items = data?.content ?? []

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="盘点任务"
        description="按办公区域创建并跟踪资产盘点进度"
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" />
            新建任务
          </Button>
        }
      />

      <SearchBar
        onSearch={() => setFilters(f => ({ ...f, page: 1 }))}
        onReset={() => setFilters({ page: 1, pageSize: 10 })}
      >
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">状态</Label>
          <Select
            value={filters.status ?? 'all'}
            onValueChange={v =>
              setFilters({ ...filters, status: v === 'all' ? undefined : (v as InventoryStatus), page: 1 })
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="全部" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              {Object.entries(INVENTORY_STATUS_LABEL).map(([v, l]) => (
                <SelectItem key={v} value={v}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </SearchBar>

      {list.isLoading ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Empty title="暂无盘点任务" description="新建一个盘点任务以追踪资产分布" />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {items.map(t => (
            <Card
              key={t.id}
              className="group cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => setDetail(t)}
            >
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold">{t.area?.name ?? '未指定区域'}</h3>
                    <p className="text-xs text-muted-foreground">计划日期 · {formatDate(t.planInventoryDate)}</p>
                  </div>
                  <StatusBadge label={INVENTORY_STATUS_LABEL[t.status]} tone={STATUS_TONE[t.status]} />
                </div>
                <div className="grid grid-cols-3 gap-3 rounded-xl bg-muted/40 p-3 text-center text-xs">
                  <Stat label="计划" value={t.planInventoryCount} />
                  <Stat label="已盘" value={t.completedInventoryCount} />
                  <Stat label="异常" value={t.abnormalInventoryCount} tone="destructive" />
                </div>
                <div className="flex items-center justify-between border-t pt-3">
                  <div className="text-xs text-muted-foreground">盘点人：{t.inventoryUser?.name ?? '-'}</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-mr-2"
                    onClick={e => {
                      e.stopPropagation()
                      setDetail(t)
                    }}
                  >
                    <Eye className="size-4" />
                    详情
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Pagination
        page={filters.page}
        pageSize={filters.pageSize}
        total={data?.totalElements ?? 0}
        onPageChange={p => setFilters(f => ({ ...f, page: p }))}
        onPageSizeChange={s => setFilters(f => ({ ...f, pageSize: s }))}
      />

      <InventoryCreateDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={async payload => {
          await create.mutateAsync(payload)
        }}
      />
      <InventoryDetailSheet data={detail} open={detail !== null} onOpenChange={v => !v && setDetail(null)} />
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
  tone?: 'destructive' | 'default'
}) {
  return (
    <div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className={`text-lg font-semibold tabular-nums ${tone === 'destructive' ? 'text-destructive' : ''}`}>
        {value}
      </div>
    </div>
  )
}
