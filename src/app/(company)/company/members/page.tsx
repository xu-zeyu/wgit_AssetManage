'use client'

import { useState } from 'react'
import { Phone, UserCircle2 } from 'lucide-react'
import { PageHeader } from '@/components/common/page-header'
import { SearchBar } from '@/components/common/search-bar'
import { Pagination } from '@/components/common/pagination'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Empty } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { useMembers } from '@/features/company/members/hooks/use-members'
import { MemberDetailSheet } from '@/features/company/members/components/member-detail-sheet'
import type { CompanyMember } from '@/features/company/members/api/types'

export default function CompanyMembersPage() {
  const { filters, setFilters, reset, list } = useMembers()
  const [draft, setDraft] = useState(filters)
  const [detail, setDetail] = useState<CompanyMember | null>(null)

  const data = list.data?.data
  const items = data?.content ?? []

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader title="成员管理" description="维护当前公司的成员目录" />

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
        <Empty title="暂无成员" description="可联系平台管理员或员工 APP 端添加成员" />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map(m => (
            <Card
              key={m.id}
              className="group cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => setDetail(m)}
            >
              <CardContent className="flex items-center gap-3 p-4">
                <Avatar className="size-12">
                  <AvatarImage src={`https://robohash.org/${m.user?.id ?? m.id}?set=set4&bgset=bg1`} />
                  <AvatarFallback>{(m.name ?? m.user?.nickname ?? '?').charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="line-clamp-1 text-sm font-semibold">
                      {m.name || m.user?.nickname || m.user?.username || '未命名'}
                    </h3>
                    {m.area?.name && <Badge variant="muted">{m.area.name}</Badge>}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {m.mobile && (
                      <span className="inline-flex items-center gap-1">
                        <Phone className="size-3" />
                        {m.mobile}
                      </span>
                    )}
                    {m.department && (
                      <span className="inline-flex items-center gap-1">
                        <UserCircle2 className="size-3" />
                        {m.department}
                      </span>
                    )}
                  </div>
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

      <MemberDetailSheet data={detail} open={detail !== null} onOpenChange={v => !v && setDetail(null)} />
    </div>
  )
}
