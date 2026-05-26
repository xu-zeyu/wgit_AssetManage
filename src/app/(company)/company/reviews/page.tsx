'use client'

import { useState } from 'react'
import { Check, Clock, Eye, Phone, X, MapPin, Building2, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '@/components/common/page-header'
import { Pagination } from '@/components/common/pagination'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Empty } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useReviews } from '@/features/company/reviews/hooks/use-reviews'
import { useReviewStats } from '@/features/company/reviews/hooks/use-review-stats'
import { APPLICATION_STATUS_LABEL, type ApplicationStatus, type AssetApplication } from '@/features/company/reviews/api/types'
import { useConfirm } from '@/hooks/use-confirm'
import { RejectDialog } from '@/features/company/reviews/components/reject-dialog'
import { ReviewDetailSheet } from '@/features/company/reviews/components/review-detail-sheet'
import { formatDateTime } from '@/lib/utils'

const STATUS_TONE: Record<ApplicationStatus, 'warning' | 'success' | 'info' | 'destructive' | 'secondary'> = {
  PENDING: 'warning',
  APPROVED: 'success',
  PENDING_DEPLOY: 'info',
  PENDING_RECEIVE: 'info',
  REJECTED: 'destructive',
  COMPLETED: 'secondary',
}

const TABS: Array<{ value: 'all' | ApplicationStatus; label: string }> = [
  { value: 'PENDING', label: '待审核' },
  { value: 'APPROVED', label: '已通过' },
  { value: 'REJECTED', label: '已拒绝' },
  { value: 'COMPLETED', label: '已完成' },
  { value: 'all', label: '全部' },
]

export default function ReviewsPage() {
  const { filters, setFilters, list, approve, reject } = useReviews()
  const { stats, loading: statsLoading } = useReviewStats()
  const { confirm, node } = useConfirm()
  const [rejectId, setRejectId] = useState<number | null>(null)
  const [detail, setDetail] = useState<AssetApplication | null>(null)

  const data = list.data?.data
  const items = data?.content ?? []
  const activeTab = filters.status ?? 'all'

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader title="资产审核" description="集中处理员工的资产申请、跟踪审核结果" />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="待审核" value={stats.PENDING} loading={statsLoading} icon={<Clock className="size-4" />} tone="warning" />
        <StatCard label="已通过" value={stats.APPROVED} loading={statsLoading} icon={<CheckCircle2 className="size-4" />} tone="success" />
        <StatCard label="已拒绝" value={stats.REJECTED} loading={statsLoading} icon={<X className="size-4" />} tone="destructive" />
        <StatCard label="已完成" value={stats.COMPLETED} loading={statsLoading} icon={<Check className="size-4" />} tone="muted" />
      </div>

      <Tabs
        value={activeTab}
        onValueChange={v => setFilters({ ...filters, status: v === 'all' ? undefined : (v as ApplicationStatus), page: 1 })}
      >
        <TabsList className="h-auto flex-wrap p-1">
          {TABS.map(t => (
            <TabsTrigger key={t.value} value={t.value} className="gap-1.5">
              {t.label}
              {t.value !== 'all' && (
                <span className="rounded-full bg-muted-foreground/10 px-1.5 py-0.5 text-[10px] tabular-nums text-muted-foreground">
                  {stats[t.value as ApplicationStatus]}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {list.isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Empty
          title="暂无符合条件的申请"
          description={activeTab === 'PENDING' ? '当前没有待审核的申请' : '可切换其他状态查看'}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {items.map(app => (
            <ReviewItem
              key={app.id}
              data={app}
              onView={() => setDetail(app)}
              onApprove={async () => {
                const ok = await confirm({
                  title: '审核通过',
                  description: `确认通过「${app.rentalUser?.name}」的资产申请？`,
                  confirmText: '通过',
                })
                if (ok) await approve.mutateAsync(app.id)
              }}
              onReject={() => setRejectId(app.id)}
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

      <RejectDialog
        open={rejectId !== null}
        onOpenChange={v => !v && setRejectId(null)}
        onSubmit={async reason => {
          if (rejectId !== null) await reject.mutateAsync({ id: rejectId, reason })
        }}
      />
      <ReviewDetailSheet data={detail} open={detail !== null} onOpenChange={v => !v && setDetail(null)} />
      {node}
    </div>
  )
}

function StatCard({
  label,
  value,
  loading,
  icon,
  tone,
}: {
  label: string
  value: number
  loading?: boolean
  icon: React.ReactNode
  tone: 'warning' | 'success' | 'destructive' | 'muted'
}) {
  const toneClass = {
    warning: 'from-warning/15 to-transparent text-warning',
    success: 'from-success/15 to-transparent text-success',
    destructive: 'from-destructive/15 to-transparent text-destructive',
    muted: 'from-muted to-transparent text-muted-foreground',
  }[tone]
  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute -right-8 -top-8 size-28 rounded-full bg-gradient-to-br opacity-80 ${toneClass}`} />
      <CardContent className="relative space-y-2 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{label}</span>
          <div className={`grid size-8 place-items-center rounded-xl bg-background/80 shadow-sm ${toneClass}`}>{icon}</div>
        </div>
        {loading ? <Skeleton className="h-7 w-16" /> : <div className="text-2xl font-semibold tabular-nums">{value}</div>}
      </CardContent>
    </Card>
  )
}

interface ItemProps {
  data: AssetApplication
  onView: () => void
  onApprove: () => void
  onReject: () => void
}

function ReviewItem({ data, onView, onApprove, onReject }: ItemProps) {
  const pending = data.status === 'PENDING'
  return (
    <Card className="group transition-shadow hover:shadow-md">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start gap-3">
          <Avatar className="size-12">
            <AvatarImage src={`https://robohash.org/${data.rentalUser?.user?.id ?? data.id}?set=set4&bgset=bg1`} />
            <AvatarFallback>{data.rentalUser?.name?.charAt(0) ?? '?'}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="line-clamp-1 text-base font-semibold">{data.rentalUser?.name ?? '匿名'}</h3>
              <Badge variant={STATUS_TONE[data.status] as any}>{APPLICATION_STATUS_LABEL[data.status]}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">申请编号 #{data.id} · {formatDateTime(data.applyTime)}</p>
          </div>
        </div>

        <div className="rounded-xl bg-muted/40 px-3 py-2">
          <div className="text-[11px] text-muted-foreground">申请的资产</div>
          <div className="mt-0.5 line-clamp-1 text-sm font-medium text-foreground">{data.assetSku?.name ?? '-'}</div>
        </div>

        <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground sm:grid-cols-3">
          <InfoChip icon={<Phone className="size-3.5" />} label={data.rentalUser?.mobile ?? '-'} />
          <InfoChip icon={<Building2 className="size-3.5" />} label={data.rentalUser?.department || '未填部门'} />
          <InfoChip icon={<MapPin className="size-3.5" />} label={data.rentalUser?.area?.name || '未指定区域'} />
        </div>

        {data.rejectReason && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            拒绝原因：{data.rejectReason}
          </div>
        )}

        <Separator />

        <div className="flex items-center justify-between gap-2">
          <Button variant="ghost" size="sm" onClick={onView}>
            <Eye className="size-4" />
            查看详情
          </Button>
          {pending && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onReject} className="text-destructive hover:text-destructive">
                <X className="size-4" />
                拒绝
              </Button>
              <Button size="sm" onClick={onApprove}>
                <Check className="size-4" />
                通过
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function InfoChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg bg-background px-2 py-1.5">
      <span className="text-muted-foreground/70">{icon}</span>
      <span className="line-clamp-1 text-foreground/80">{label}</span>
    </div>
  )
}
