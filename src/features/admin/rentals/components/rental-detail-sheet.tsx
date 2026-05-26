'use client'

import { useQuery } from '@tanstack/react-query'
import { Calendar, Clock, User, Building2, Hash, FileText, Tag, Package } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge } from '@/components/common/status-badge'
import { Separator } from '@/components/ui/separator'
import { getRentalDetails } from '../api/list-rentals'
import { getStatusColor, getStatusLabel } from '../api/types'
import { cn, formatDate, formatPrice } from '@/lib/utils'
import { RentalEventTimeline } from './rental-event-timeline'

interface Props {
  id: number | null
  open: boolean
  onOpenChange: (v: boolean) => void
}

export function RentalDetailSheet({ id, open, onOpenChange }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-rental-detail', id],
    queryFn: () => getRentalDetails(id as number),
    enabled: open && id !== null,
  })

  const order = data?.data

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-xl overflow-y-auto sm:max-w-xl">
        <SheetHeader className="space-y-1">
          <SheetTitle>租赁订单详情</SheetTitle>
          <SheetDescription>查看该笔租赁订单的完整信息与操作记录</SheetDescription>
        </SheetHeader>

        {isLoading || !order ? (
          <DetailSkeleton />
        ) : (
          <div className="mt-6 space-y-6">
            {/* Asset header */}
            <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-5 dark:from-amber-950/20 dark:to-orange-950/20">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <h3 className="text-lg font-bold text-foreground truncate">
                    {order.assetSku?.name ?? '未命名资产'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    规格：{order.assetSku?.spec ?? '-'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    订单 #{order.id}
                  </p>
                </div>
                <StatusBadge
                  label={getStatusLabel(order.status)}
                  tone={getStatusColor(order.status) as any}
                  className="shrink-0"
                />
              </div>
            </div>

            {/* Key info grid */}
            <div className="grid grid-cols-2 gap-3">
              <InfoCard
                icon={<Tag className="size-4" />}
                label="租赁费用"
                value={formatPrice(order.rentalPrice)}
                accent
              />
              <InfoCard
                icon={<Calendar className="size-4" />}
                label="起始时间"
                value={formatDate(order.rentalStartTime)}
              />
              <InfoCard
                icon={<Calendar className="size-4" />}
                label="结束时间"
                value={formatDate(order.rentalEndTime)}
              />
              <InfoCard
                icon={<Hash className="size-4" />}
                label="资产编号"
                value={order.asset?.code ?? '-'}
              />
            </div>

            <Separator />

            {/* User info */}
            <Section title="租用人信息" icon={<User className="size-4" />}>
              <div className="grid grid-cols-2 gap-3">
                <InfoCard label="姓名" value={order.rentalUser?.name ?? '-'} />
                <InfoCard label="手机号" value={order.rentalUser?.mobile ?? '-'} />
                <InfoCard label="部门" value={order.rentalUser?.department ?? '-'} className="col-span-2" />
              </div>
            </Section>

            {/* Company info */}
            <Section title="所属公司" icon={<Building2 className="size-4" />}>
              <div className="grid grid-cols-2 gap-3">
                <InfoCard label="公司名称" value={order.company?.name ?? '-'} />
                <InfoCard label="公司编码" value={order.company?.code ?? '-'} />
              </div>
            </Section>

            {/* Asset detail */}
            {order.asset && (
              <Section title="资产信息" icon={<Package className="size-4" />}>
                <div className="grid grid-cols-2 gap-3">
                  <InfoCard label="资产 ID" value={String(order.asset.id)} />
                  <InfoCard label="资产编码" value={order.asset.code} />
                </div>
              </Section>
            )}

            {/* Remark */}
            <Section title="备注" icon={<FileText className="size-4" />}>
              <p className="text-sm text-muted-foreground rounded-2xl border bg-background/40 p-4">
                {order.remark || '暂无备注'}
              </p>
            </Section>

            {/* Event timeline */}
            <Section title="操作记录" icon={<Clock className="size-4" />}>
              <div className="rounded-2xl border bg-background/40 p-4">
                <RentalEventTimeline records={order.asset?.actionRecords} />
              </div>
            </Section>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

function Section({
  title,
  icon,
  children,
}: {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h4>
      </div>
      {children}
    </div>
  )
}

function InfoCard({
  label,
  value,
  icon,
  accent,
  className,
}: {
  label: string
  value: string
  icon?: React.ReactNode
  accent?: boolean
  className?: string
}) {
  return (
    <div className={cn(
      'rounded-2xl border bg-background/40 p-3.5 space-y-1',
      accent && 'border-amber-200 bg-amber-50/30 dark:border-amber-800/30 dark:bg-amber-950/10',
      className,
    )}>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className={cn('text-sm font-semibold', accent && 'text-amber-700 dark:text-amber-400')}>
        {value || '-'}
      </p>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="mt-6 space-y-6">
      <Skeleton className="h-24 w-full rounded-2xl" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-16 rounded-2xl" />
        <Skeleton className="h-16 rounded-2xl" />
        <Skeleton className="h-16 rounded-2xl" />
        <Skeleton className="h-16 rounded-2xl" />
      </div>
      <Skeleton className="h-px w-full" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-16 rounded-2xl" />
          <Skeleton className="h-16 rounded-2xl" />
          <Skeleton className="h-16 rounded-2xl col-span-2" />
        </div>
      </div>
    </div>
  )
}
