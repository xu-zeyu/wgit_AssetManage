'use client'

import { useState } from 'react'
import { Eye, MapPin, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/common/page-header'
import { Pagination } from '@/components/common/pagination'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Empty } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useConfirm } from '@/hooks/use-confirm'
import { useOfficeAreas } from '@/features/company/office-areas/hooks/use-office-areas'
import { AreaFormDialog } from '@/features/company/office-areas/components/area-form-dialog'
import { AreaDetailSheet } from '@/features/company/office-areas/components/area-detail-sheet'
import type { OfficeArea } from '@/features/company/office-areas/api/types'

export default function OfficeAreaPage() {
  const { filters, setFilters, list, create, update, remove } = useOfficeAreas()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<OfficeArea | null>(null)
  const [detail, setDetail] = useState<OfficeArea | null>(null)
  const { confirm, node } = useConfirm()

  const data = list.data?.data
  const items = data?.content ?? []

  async function handleDelete(a: OfficeArea) {
    const ok = await confirm({
      title: '删除区域',
      description: `确定删除「${a.name}」？`,
      variant: 'destructive',
      confirmText: '删除',
    })
    if (ok) await remove.mutateAsync(a.id)
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="办公区域"
        description="维护用于资产盘点的物理区域信息"
        actions={
          <Button
            onClick={() => {
              setEditing(null)
              setDialogOpen(true)
            }}
          >
            <Plus className="size-4" />
            新建区域
          </Button>
        }
      />

      {list.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Empty title="暂无办公区域" description="建议至少添加一个办公区域以方便资产管理" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(a => (
            <Card
              key={a.id}
              className="group cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => setDetail(a)}
            >
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid size-10 place-items-center rounded-2xl bg-brand-100/60 text-brand-600">
                      <MapPin className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{a.name}</h3>
                      {a.address && <p className="text-xs text-muted-foreground">{a.address}</p>}
                    </div>
                  </div>
                  <div onClick={e => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem onClick={() => setDetail(a)}>
                          <Eye className="size-4" />
                          查看详情
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setEditing(a)
                            setDialogOpen(true)
                          }}
                        >
                          <Pencil className="size-4" />
                          编辑
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(a)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="size-4" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                {a.remark && <p className="text-xs text-muted-foreground">{a.remark}</p>}
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

      <AreaFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editing}
        onSubmit={async values => {
          if (editing?.id) {
            await update.mutateAsync({ id: editing.id, ...values })
          } else {
            await create.mutateAsync(values)
          }
        }}
      />
      <AreaDetailSheet
        data={detail}
        open={detail !== null}
        onOpenChange={v => !v && setDetail(null)}
        onEdit={() => {
          if (!detail) return
          setEditing(detail)
          setDetail(null)
          setDialogOpen(true)
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
