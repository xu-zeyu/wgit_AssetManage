'use client'

import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/common/page-header'
import { SearchBar } from '@/components/common/search-bar'
import { Pagination } from '@/components/common/pagination'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Empty } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { useConfirm } from '@/hooks/use-confirm'
import { usePolicies } from '@/features/admin/policies/hooks/use-policies'
import { PolicyFormDialog } from '@/features/admin/policies/components/policy-form-dialog'
import type { RentPolicy } from '@/features/admin/policies/api/types'

export default function PoliciesPage() {
  const { filters, setFilters, reset, list, create, update, remove } = usePolicies()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<RentPolicy | null>(null)
  const [draftName, setDraftName] = useState(filters.name)
  const { confirm, node } = useConfirm()

  const data = list.data?.data
  const items = data?.content ?? []

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="租金政策"
        description="为不同客户群体设置租金折扣策略"
        actions={
          <Button
            onClick={() => {
              setEditing(null)
              setDialogOpen(true)
            }}
          >
            <Plus className="size-4" />
            新建策略
          </Button>
        }
      />

      <SearchBar
        onSearch={() => setFilters(f => ({ ...f, name: draftName, page: 1 }))}
        onReset={() => {
          setDraftName('')
          reset()
        }}
      >
        <div className="space-y-1.5">
          <Label htmlFor="policy-search" className="text-xs text-muted-foreground">
            策略名称
          </Label>
          <Input
            id="policy-search"
            value={draftName}
            onChange={e => setDraftName(e.target.value)}
            placeholder="输入策略名"
            className="w-48"
          />
        </div>
      </SearchBar>

      {list.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Empty title="尚未创建任何策略" description="先建立租金策略，再分配给公司租户" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map(p => (
            <Card key={p.id} className="group transition-shadow hover:shadow-md">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{p.name}</h3>
                    <p className="text-xs text-muted-foreground">策略 ID #{p.id}</p>
                  </div>
                  <Badge variant="warning">{(p.discount * 100).toFixed(1)}%</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 text-sm">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditing(p)
                      setDialogOpen(true)
                    }}
                  >
                    <Pencil className="size-4" />
                    编辑
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={async () => {
                      const ok = await confirm({
                        title: '删除策略',
                        description: `确定删除「${p.name}」？`,
                        variant: 'destructive',
                        confirmText: '删除',
                      })
                      if (ok) await remove.mutateAsync(p.id)
                    }}
                  >
                    <Trash2 className="size-4" />
                    删除
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

      <PolicyFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editing}
        onSubmit={async values => {
          if (editing?.id) {
            await update.mutateAsync({ id: editing.id, name: values.name, discount: values.discount })
          } else {
            await create.mutateAsync({ name: values.name, discount: values.discount })
          }
        }}
      />
      {node}
    </div>
  )
}
