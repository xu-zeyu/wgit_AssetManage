'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/common/page-header'
import { SearchBar } from '@/components/common/search-bar'
import { Pagination } from '@/components/common/pagination'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Empty } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { useConfirm } from '@/hooks/use-confirm'
import { useCompanies } from '@/features/admin/companies/hooks/use-companies'
import { CompanyFormDialog } from '@/features/admin/companies/components/company-form-dialog'
import { CompanyDetailSheet } from '@/features/admin/companies/components/company-detail-sheet'
import { CompanyCard } from '@/features/admin/companies/components/company-card'
import type { Company } from '@/features/admin/companies/api/types'

export default function AdminCompaniesPage() {
  const { filters, setFilters, reset, list, create, update, remove } = useCompanies()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Company | null>(null)
  const [detail, setDetail] = useState<Company | null>(null)
  const [draftName, setDraftName] = useState(filters.name)
  const [draftCode, setDraftCode] = useState(filters.code)
  const { confirm, node } = useConfirm()

  const data = list.data?.data
  const items = data?.content ?? []

  async function handleDelete(c: Company) {
    const ok = await confirm({
      title: '删除公司',
      description: `确定删除「${c.name}」？此操作不可撤销。`,
      confirmText: '删除',
      variant: 'destructive',
    })
    if (ok) await remove.mutateAsync(c.id)
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="公司管理"
        description="维护平台租户的基础信息、管理员与租金政策"
        actions={
          <Button
            onClick={() => {
              setEditing(null)
              setDialogOpen(true)
            }}
          >
            <Plus className="size-4" />
            新建公司
          </Button>
        }
      />

      <SearchBar
        onSearch={() => setFilters(f => ({ ...f, name: draftName, code: draftCode, page: 1 }))}
        onReset={() => {
          setDraftName('')
          setDraftCode('')
          reset()
        }}
      >
        <div className="space-y-1.5">
          <Label htmlFor="search-name" className="text-xs text-muted-foreground">
            公司名称
          </Label>
          <Input
            id="search-name"
            value={draftName}
            onChange={e => setDraftName(e.target.value)}
            placeholder="输入公司名"
            className="w-48"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="search-code" className="text-xs text-muted-foreground">
            公司编码
          </Label>
          <Input
            id="search-code"
            value={draftCode}
            onChange={e => setDraftCode(e.target.value)}
            placeholder="输入公司编码"
            className="w-48"
          />
        </div>
      </SearchBar>

      {list.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Empty
          title="还没有公司"
          description="先创建一个公司，再为其配置管理员与租金政策"
          action={
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="size-4" />
              新建公司
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map(c => (
            <CompanyCard
              key={c.id}
              data={c}
              onView={() => setDetail(c)}
              onEdit={() => {
                setEditing(c)
                setDialogOpen(true)
              }}
              onDelete={() => handleDelete(c)}
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

      <CompanyFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editing}
        onSubmit={async payload => {
          if (editing?.id) {
            await update.mutateAsync({ ...payload, id: editing.id })
          } else {
            await create.mutateAsync(payload)
          }
        }}
      />
      <CompanyDetailSheet
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
