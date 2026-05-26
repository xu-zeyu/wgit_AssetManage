'use client'

import { useQueries } from '@tanstack/react-query'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { listRentals } from '@/features/admin/rentals/api/list-rentals'
import { RENTAL_STATUS_OPTIONS, type RentalStatus } from '@/features/admin/rentals/api/types'

const COLORS: Record<RentalStatus, string> = {
  PENDING_DEPLOY: '#F59E0B',
  PENDING_RECEIVE: '#FBBF24',
  RENTING: '#22C55E',
  REPAIR_APPLYING: '#0EA5E9',
  RETURN_APPLYING: '#A855F7',
  RETURNED: '#94A3B8',
}

export function RentalStatusChart() {
  const queries = useQueries({
    queries: RENTAL_STATUS_OPTIONS.map(opt => ({
      queryKey: ['rental-status-count', opt.value],
      queryFn: () => listRentals({ status: opt.value, page: 0, size: 1, sort: 'id,desc' }),
    })),
  })

  const loading = queries.some(q => q.isLoading)
  const data = RENTAL_STATUS_OPTIONS.map((opt, idx) => ({
    name: opt.label,
    status: opt.value,
    value: queries[idx].data?.data.totalElements ?? 0,
  })).filter(d => d.value > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>租赁状态分布</CardTitle>
        <CardDescription>实时统计当前各状态租赁订单数量</CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : data.length === 0 ? (
          <div className="grid h-full place-items-center text-sm text-muted-foreground">暂无数据</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius="50%"
                outerRadius="85%"
                paddingAngle={3}
                stroke="hsl(var(--background))"
                strokeWidth={2}
              >
                {data.map(d => (
                  <Cell key={d.status} fill={COLORS[d.status]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid hsl(var(--border))',
                  background: 'hsl(var(--popover))',
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
