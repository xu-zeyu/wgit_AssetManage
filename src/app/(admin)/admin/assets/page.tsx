'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/common/page-header'
import { SearchBar } from '@/components/common/search-bar'
import { Pagination } from '@/components/common/pagination'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Empty } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { useAssetSkus } from '@/features/admin/assets/hooks/use-asset-skus'
import { AssetCard } from '@/features/admin/assets/components/asset-card'
import { AssetFormDialog } from '@/features/admin/assets/components/asset-form-dialog'
import { AssetDetailSheet } from '@/features/admin/assets/components/asset-detail-sheet'
import { useConfirm } from '@/hooks/use-confirm'
import type { AssetSku } from '@/features/admin/assets/api/types'

export default function AdminAssetsPage() {
  const { filters, setFilters, reset, list, categories, create, update, remove } = useAssetSkus()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<AssetSku | null>(null)
  const [detail, setDetail] = useState<AssetSku | null>(null)
  const [draft, setDraft] = useState(filters)
  const { confirm, node } = useConfirm()

  const data = list.data?.data
  const items = data?.content ?? []
  const allCategories = (categories.data?.data ?? []).filter(category => category.trim().length > 0)

  async function handleDelete(item: AssetSku) {
    const ok = await confirm({
      title: '删除资产',
      description: `确定删除「${item.name}」？`,
      variant: 'destructive',
      confirmText: '删除',
    })
    if (ok) await remove.mutateAsync(item.id)
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="资产列表"
        description="管理平台资产 SKU 与可租用公司范围"
        actions={
          <Button
            onClick={() => {
              setEditing(null)
              setOpen(true)
            }}
          >
            <Plus className="size-4" />
            新增资产
          </Button>
        }
      />

      <SearchBar
        onSearch={() => setFilters({ ...draft, page: 1 })}
        onReset={() => {
          setDraft({ name: '', code: '', category: '', spec: '', page: 1, pageSize: 12 })
          reset()
        }}
      >
        <FilterInput label="名称" value={draft.name} onChange={v => setDraft({ ...draft, name: v })} />
        <FilterInput label="编码" value={draft.code} onChange={v => setDraft({ ...draft, code: v })} />
        <FilterInput label="规格" value={draft.spec} onChange={v => setDraft({ ...draft, spec: v })} />
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">分类</Label>
          <Select
            value={draft.category || 'all'}
            onValueChange={v => setDraft({ ...draft, category: v === 'all' ? '' : v })}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="全部分类" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部分类</SelectItem>
              {allCategories.map(c => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </SearchBar>

      {list.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Empty title="暂无资产" description="新增资产 SKU，并配置可租用的公司" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map(item => (
            <AssetCard
              key={item.id}
              data={item}
              onView={() => setDetail(item)}
              onEdit={() => {
                setEditing(item)
                setOpen(true)
              }}
              onDelete={() => handleDelete(item)}
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

      <AssetFormDialog
        open={open}
        onOpenChange={setOpen}
        initial={editing}
        onSubmit={async payload => {
          if (editing?.id) await update.mutateAsync(payload as any)
          else await create.mutateAsync(payload as any)
        }}
      />
      <AssetDetailSheet
        data={detail}
        open={detail !== null}
        onOpenChange={v => !v && setDetail(null)}
        onEdit={() => {
          if (!detail) return
          setEditing(detail)
          setDetail(null)
          setOpen(true)
        }}
        onDelete={async () => {
          if (!detail) return
          const target = detail
          setDetail(null)
          await handleDelete(target)
        }}
      />
      {node}
    </div>
  )
}

function FilterInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input value={value} onChange={e => onChange(e.target.value)} placeholder={`输入${label}`} className="w-40" />
    </div>
  )
}
