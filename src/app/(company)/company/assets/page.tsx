'use client'

import { useEffect, useState } from 'react'
import { Plus, Printer, X } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/common/page-header'
import { SearchBar } from '@/components/common/search-bar'
import { Pagination } from '@/components/common/pagination'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Empty } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { useCompanyAssets } from '@/features/company/assets/hooks/use-company-assets'
import { printCompanyAssets } from '@/features/company/assets/api/list-company-assets'
import { AssetApplicationDialog } from '@/features/company/assets/components/asset-application-dialog'
import { CompanyAssetCard } from '@/features/company/assets/components/company-asset-card'
import { CompanyAssetDetailSheet } from '@/features/company/assets/components/company-asset-detail-sheet'
import { ReturnAssetDialog } from '@/features/company/assets/components/return-asset-dialog'
import { printAssetLabels } from '@/features/company/assets/lib/print-asset-labels'
import { COMPANY_ASSET_STATUS, type CompanyAsset, type CompanyAssetStatus } from '@/features/company/assets/api/types'

export default function CompanyAssetsPage() {
  const { filters, setFilters, reset, list, returnAssets, applyAssets } = useCompanyAssets()
  const [draft, setDraft] = useState({
    status: filters.status as string | undefined,
    skuCategory: filters.skuCategory ?? '',
    areaName: filters.areaName ?? '',
  })
  const [applicationOpen, setApplicationOpen] = useState(false)
  const [detail, setDetail] = useState<CompanyAsset | null>(null)
  const [returnTarget, setReturnTarget] = useState<CompanyAsset | null>(null)
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const data = list.data?.data
  const items = data?.content ?? []
  const selectedAssets = items.filter(asset => selectedIds.includes(asset.id))

  useEffect(() => {
    const visibleIds = new Set((data?.content ?? []).map(asset => asset.id))
    setSelectedIds(prev => prev.filter(id => visibleIds.has(id)))
  }, [data?.content])

  async function handlePrint(targets: CompanyAsset[]) {
    if (targets.length === 0) return
    try {
      await printAssetLabels(targets)
      await printCompanyAssets(targets.map(asset => asset.id))
      await list.refetch()
      toast.success(`已发起 ${targets.length} 张标签打印`)
      setSelectedIds([])
    } catch {
      toast.error('打印失败，请稍后重试')
    }
  }

  function toggleSelected(id: number) {
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]))
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="资产列表"
        description="查看公司当前的资产分布与使用情况"
        actions={
          <>
            {selectedIds.length > 0 && (
              <>
                <Button variant="secondary" onClick={() => handlePrint(selectedAssets)}>
                  <Printer className="size-4" />
                  打印已选 {selectedIds.length} 项
                </Button>
                <Button variant="ghost" onClick={() => setSelectedIds([])}>
                  <X className="size-4" />
                  清空选择
                </Button>
              </>
            )}
            <Button onClick={() => setApplicationOpen(true)}>
              <Plus className="size-4" />
              新增资产
            </Button>
          </>
        }
      />

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
        <Empty title="暂无资产" description="可通过新增资产发起申领，并在这里追踪资产分布" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map(a => (
            <CompanyAssetCard
              key={a.id}
              asset={a}
              selected={selectedIds.includes(a.id)}
              onToggleSelected={() => toggleSelected(a.id)}
              onDetail={() => setDetail(a)}
              onReturn={() => setReturnTarget(a)}
              onPrint={() => handlePrint([a])}
            />
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

      <AssetApplicationDialog
        open={applicationOpen}
        onOpenChange={setApplicationOpen}
        onSubmit={async payload => {
          const response = await applyAssets.mutateAsync(payload)
          return response.data
        }}
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
