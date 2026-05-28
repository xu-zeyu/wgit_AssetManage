'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/common/page-header'
import { SearchBar } from '@/components/common/search-bar'
import { Pagination } from '@/components/common/pagination'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Empty } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useConfirm } from '@/hooks/use-confirm'
import { useMembers } from '@/features/company/members/hooks/use-members'
import { MemberCard } from '@/features/company/members/components/member-card'
import { MemberFormDialog } from '@/features/company/members/components/member-form-dialog'
import { MemberDetailSheet } from '@/features/company/members/components/member-detail-sheet'
import type { CompanyMember } from '@/features/company/members/api/types'

export default function CompanyMembersPage() {
  const { filters, setFilters, reset, list, create, update, remove } = useMembers()
  const [draft, setDraft] = useState(filters)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<CompanyMember | null>(null)
  const [detail, setDetail] = useState<CompanyMember | null>(null)
  const { confirm, node } = useConfirm()

  const data = list.data?.data
  const items = data?.content ?? []

  async function handleDelete(member: CompanyMember) {
    const ok = await confirm({
      title: '删除成员',
      description: `确定删除「${member.name || member.user?.nickname || member.user?.username || '该成员'}」？`,
      variant: 'destructive',
      confirmText: '删除',
    })
    if (ok) await remove.mutateAsync(member.id)
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="成员管理"
        description="维护当前公司的成员目录"
        actions={
          <Button
            onClick={() => {
              setEditing(null)
              setDialogOpen(true)
            }}
          >
            <Plus className="size-4" />
            新增成员
          </Button>
        }
      />

      <SearchBar
        onSearch={() => setFilters({ ...draft, page: 1 })}
        onReset={() => {
          setDraft({ name: '', mobile: '', page: 1, pageSize: 10 })
          reset()
        }}
      >
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">姓名</Label>
          <Input
            value={draft.name}
            onChange={e => setDraft({ ...draft, name: e.target.value })}
            placeholder="输入姓名"
            className="w-44"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">手机号</Label>
          <Input
            value={draft.mobile}
            onChange={e => setDraft({ ...draft, mobile: e.target.value })}
            placeholder="输入手机号"
            className="w-44"
          />
        </div>
      </SearchBar>

      {list.isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Empty title="暂无成员" description="先新增成员，补齐公司通讯录与办公区域归属" />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map(m => (
            <MemberCard
              key={m.id}
              member={m}
              onOpen={() => setDetail(m)}
              onEdit={() => {
                setEditing(m)
                setDialogOpen(true)
              }}
              onDelete={() => handleDelete(m)}
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

      <MemberFormDialog
        open={dialogOpen}
        initial={editing}
        onOpenChange={open => {
          setDialogOpen(open)
          if (!open) setEditing(null)
        }}
        onSubmit={async values => {
          if ('id' in values && values.id) {
            await update.mutateAsync(values)
          } else {
            await create.mutateAsync(values)
          }
        }}
      />
      <MemberDetailSheet
        data={detail}
        open={detail !== null}
        onOpenChange={v => !v && setDetail(null)}
        onEdit={() => {
          if (!detail) return
          setEditing(detail)
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
