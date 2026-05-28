'use client'

import { useState } from 'react'
import { Search, Users, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

export interface AssetApplicationMemberOption {
  id: number
  name: string
  department?: string
  areaName?: string
}

interface Props {
  options: AssetApplicationMemberOption[]
  value: number[]
  onChange: (next: number[]) => void
}

export function AssetApplicationMemberPicker({ options, value, onChange }: Props) {
  const [availableSearch, setAvailableSearch] = useState('')
  const [selectedSearch, setSelectedSearch] = useState('')
  const selectedSet = new Set(value)
  const available = options.filter(member => !selectedSet.has(member.id))
  const chosen = options.filter(member => selectedSet.has(member.id))
  const visibleAvailable = filterMembers(available, availableSearch)
  const visibleChosen = filterMembers(chosen, selectedSearch)

  function addMembers(ids: number[]) {
    onChange(Array.from(new Set([...value, ...ids])))
  }

  function removeMembers(ids: number[]) {
    const removing = new Set(ids)
    onChange(value.filter(id => !removing.has(id)))
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr]">
      <MemberPanel
        title="可选成员"
        count={available.length}
        search={availableSearch}
        searchPlaceholder="搜索成员"
        emptyText="暂无可选成员"
        onSearchChange={setAvailableSearch}
        action={
          <Button type="button" variant="ghost" size="sm" onClick={() => addMembers(visibleAvailable.map(item => item.id))}>
            全选筛选结果
          </Button>
        }
      >
        {visibleAvailable.map(member => (
          <MemberRow key={member.id} member={member} onClick={() => addMembers([member.id])} />
        ))}
      </MemberPanel>

      <div className="hidden items-center justify-center lg:flex">
        <div className="rounded-2xl border bg-muted/40 p-3 text-xs text-muted-foreground">选择成员后提交申领</div>
      </div>

      <MemberPanel
        title="已选择"
        count={chosen.length}
        search={selectedSearch}
        searchPlaceholder="搜索已选成员"
        emptyText="尚未选择成员"
        onSearchChange={setSelectedSearch}
        action={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeMembers(visibleChosen.map(item => item.id))}
            disabled={chosen.length === 0}
          >
            清空筛选结果
          </Button>
        }
      >
        {visibleChosen.map(member => (
          <MemberRow key={member.id} member={member} onClick={() => removeMembers([member.id])} removable />
        ))}
      </MemberPanel>
    </div>
  )
}

function MemberPanel({
  title,
  count,
  search,
  onSearchChange,
  searchPlaceholder,
  emptyText,
  action,
  children,
}: {
  title: string
  count: number
  search: string
  onSearchChange: (value: string) => void
  searchPlaceholder: string
  emptyText: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-[1.5rem] border bg-background">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Users className="size-4 text-brand-600" />
          <span className="text-sm font-medium">{title}</span>
          <Badge variant="muted">{count}</Badge>
        </div>
        {action}
      </div>
      <div className="p-4">
        <div className="relative mb-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={e => onSearchChange(e.target.value)} placeholder={searchPlaceholder} className="pl-9" />
        </div>
        <ScrollArea className="h-64 pr-3">
          {hasChildren(children) ? (
            <div className="space-y-2">{children}</div>
          ) : (
            <div className="rounded-2xl border border-dashed px-3 py-8 text-center text-sm text-muted-foreground">{emptyText}</div>
          )}
        </ScrollArea>
      </div>
    </div>
  )
}

function MemberRow({
  member,
  onClick,
  removable,
}: {
  member: AssetApplicationMemberOption
  onClick: () => void
  removable?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-2xl border bg-muted/20 px-3 py-3 text-left transition hover:border-brand-300 hover:bg-brand-50/60"
    >
      <div className="min-w-0">
        <div className="line-clamp-1 text-sm font-medium">{member.name}</div>
        <div className="mt-1 flex flex-wrap gap-1 text-[11px] text-muted-foreground">
          {member.department && <span>{member.department}</span>}
          {member.areaName && <span>{member.areaName}</span>}
          {!member.department && !member.areaName && <span>未补充组织信息</span>}
        </div>
      </div>
      {removable ? (
        <span className="rounded-full bg-background p-1">
          <X className="size-4 text-muted-foreground" />
        </span>
      ) : (
        <span className="text-sm font-medium text-brand-600">添加</span>
      )}
    </button>
  )
}

function filterMembers(options: AssetApplicationMemberOption[], keyword: string) {
  const normalized = keyword.trim().toLowerCase()
  if (!normalized) return options
  return options.filter(member =>
    [member.name, member.department, member.areaName].filter(Boolean).some(value => value!.toLowerCase().includes(normalized)),
  )
}

function hasChildren(children: React.ReactNode) {
  return Array.isArray(children) ? children.length > 0 : Boolean(children)
}
