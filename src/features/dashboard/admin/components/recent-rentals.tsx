'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Empty } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge } from '@/components/common/status-badge'
import { listRentals } from '@/features/admin/rentals/api/list-rentals'
import { getStatusColor, getStatusLabel } from '@/features/admin/rentals/api/types'
import { formatDate } from '@/lib/utils'

export function RecentRentals() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-recent-rentals'],
    queryFn: () => listRentals({ page: 0, size: 5, sort: 'id,desc' }),
  })

  const items = data?.data.content ?? []

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>最新租赁</CardTitle>
          <CardDescription>近期产生的资产租赁订单</CardDescription>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/rentals">
            查看全部
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)
        ) : items.length === 0 ? (
          <Empty title="暂无租赁订单" />
        ) : (
          items.map(r => (
            <div
              key={r.id}
              className="flex items-center justify-between rounded-xl border bg-background/50 p-3 transition-colors hover:bg-accent/50"
            >
              <div className="space-y-1">
                <div className="text-sm font-medium">{r.assetSku?.name ?? '资产 SKU'}</div>
                <div className="text-xs text-muted-foreground">
                  {r.company?.name ?? '-'} · {r.rentalUser?.name ?? '-'}
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-muted-foreground">{formatDate(r.rentalStartTime)}</span>
                <StatusBadge label={getStatusLabel(r.status)} tone={getStatusColor(r.status) as any} />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
