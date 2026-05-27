'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Box, Eye, LogOut } from 'lucide-react'
import { PageHeader } from '@/components/common/page-header'
import { SearchBar } from '@/components/common/search-bar'
import { Pagination } from '@/components/common/pagination'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Empty } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge } from '@/components/common/status-badge'
import { useCompanyAssets } from '@/features/company/assets/hooks/use-company-assets'
import { CompanyAssetDetailSheet } from '@/features/company/assets/components/company-asset-detail-sheet'
import { ReturnAssetDialog } from '@/features/company/assets/components/return-asset-dialog'
import {
  COMPANY_ASSET_STATUS,
  type CompanyAsset,
  type CompanyAssetStatus,
} from '@/features/company/assets/api/types'

const STATUS_TONE: Record<CompanyAssetStatus, 'warning' | 'success' | 'secondary'> = {
  PREPARING: 'warning',
  USING: 'success',
  RETURNED: 'secondary',
}

export default function CompanyAssetsPage() {
  const { filters, setFilters, reset, list, returnAssets } = useCompanyAssets()
  const [draft, setDraft] = useState({
    status: filters.status as string | undefined,
    skuCategory: filters.skuCategory ?? '',
    areaName: filters.areaName ?? '',
  })
  const [detail, setDetail] = useState<CompanyAsset | null>(null)
  const [returnTarget, setReturnTarget] = useState<CompanyAsset | null>(null)

  const data = list.data?.data
  const items = data?.content ?? []

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader title="资产列表" description="查看公司当前的资产分布与使用情况" />

      <SearchBar
        onSearch={() =>
          setFilters({
            ...filters,
            page: 1,
            status: (draft.status as CompanyAssetStatus | undefined) || undefined,
            skuCategory: draft.skuCategory || undefined,
            areaName: draft.areaName || undefined,
          })
        }
        onReset={() => {
          setDraft({ status: undefined, skuCategory: '', areaName: '' })
          reset()
        }}
      >
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">状态</Label>
          <Select
            value={draft.status ?? 'all'}
            onValueChange={v => setDraft({ ...draft, status: v === 'all' ? undefined : v })}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="全部" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              {COMPANY_ASSET_STATUS.map(s => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">分类</Label>
          <Input
            value={draft.skuCategory}
            onChange={e => setDraft({ ...draft, skuCategory: e.target.value })}
            placeholder="输入分类"
            className="w-40"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">区域</Label>
          <Input
            value={draft.areaName}
            onChange={e => setDraft({ ...draft, areaName: e.target.value })}
            placeholder="输入区域"
            className="w-40"
          />
        </div>
      </SearchBar>

      {list.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-60 rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Empty title="暂无资产" description="资产分配后会出现在这里" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map(a => (
            <Card
              key={a.id}
              className="group cursor-pointer overflow-hidden transition-shadow hover:shadow-md"
              onClick={() => setDetail(a)}
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                {a.images?.[0]?.url ? (
                  <Image src={a.images[0].url} alt={a.assetAssetSkuName} fill sizes="280px" className="object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center text-muted-foreground">
                    <Box className="size-7" />
                  </div>
                )}
                <div className="absolute left-2 top-2">
                  <StatusBadge
                    label={COMPANY_ASSET_STATUS.find(s => s.value === a.status)?.label ?? a.status}
                    tone={STATUS_TONE[a.status]}
                  />
                </div>
              </div>
              <CardContent className="space-y-2 p-4 text-sm">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="line-clamp-1 font-semibold">{a.assetAssetSkuName}</div>
                    <div className="line-clamp-1 text-xs text-muted-foreground">{a.assetAssetSkuSpec || '-'}</div>
                  </div>
                  <Badge variant="muted">{a.assetCode}</Badge>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <Row label="使用者" value={a.rentalUserName || '-'} />
                  <Row label="部门" value={a.rentalUserDepartment || '-'} />
                  <Row label="区域" value={a.rentalUserRentalUserAreaName || '-'} />
                </div>
                <div className="flex items-center justify-end gap-1 border-t pt-2" onClick={e => e.stopPropagation()}>
                  {(a.status !== 'RETURNED' && a.rentalOrderStatus === 'RENTING' ) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setReturnTarget(a)}
                    >
                      <LogOut className="size-4" />
                      退租
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="-mr-2" onClick={() => setDetail(a)}>
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

      <CompanyAssetDetailSheet
        data={detail}
        open={detail !== null}
        onOpenChange={v => !v && setDetail(null)}
      />

      <ReturnAssetDialog
        open={returnTarget !== null}
        onOpenChange={v => !v && setReturnTarget(null)}
        assetName={returnTarget?.assetAssetSkuName}
        onSubmit={async reason => {
          if (!returnTarget) return
          await returnAssets.mutateAsync({ ids: [returnTarget.id], reason })
          setReturnTarget(null)
        }}
      />
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground/70">{label}</span>
      <span className="line-clamp-1 max-w-[60%] text-right text-foreground/80">{value}</span>
    </div>
  )
}
