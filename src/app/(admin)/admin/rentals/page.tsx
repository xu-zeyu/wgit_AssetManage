'use client'

import { useState } from 'react'
import { Eye, MoreHorizontal, PackageCheck, RotateCcw, Wrench } from 'lucide-react'
import { PageHeader } from '@/components/common/page-header'
import { SearchBar } from '@/components/common/search-bar'
import { Pagination } from '@/components/common/pagination'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Empty } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { StatusBadge } from '@/components/common/status-badge'
import { useRentals } from '@/features/admin/rentals/hooks/use-rentals'
import { RENTAL_STATUS_OPTIONS, getStatusColor, getStatusLabel, type RentalStatus } from '@/features/admin/rentals/api/types'
import { RentalDetailSheet } from '@/features/admin/rentals/components/rental-detail-sheet'
import { RentalActionDialog, type RentalAction } from '@/features/admin/rentals/components/rental-action-dialog'
import { formatDate, formatPrice } from '@/lib/utils'

export default function AdminRentalsPage() {
  const { filters, setFilters, list, deploy, repair, ret } = useRentals()
  const [detailId, setDetailId] = useState<number | null>(null)
  const [action, setAction] = useState<RentalAction | null>(null)
  const [actionId, setActionId] = useState<number | null>(null)

  const data = list.data?.data
  const items = data?.content ?? []

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader title="资产租赁" description="跟踪租赁订单的全生命周期状态" />

      <SearchBar
        onSearch={() => setFilters(f => ({ ...f, page: 1 }))}
        onReset={() => setFilters({ page: 1, pageSize: 10 })}
      >
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">状态筛选</Label>
          <Select
            value={filters.status ?? 'all'}
            onValueChange={v => setFilters({ ...filters, status: v === 'all' ? undefined : (v as RentalStatus), page: 1 })}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="全部状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              {RENTAL_STATUS_OPTIONS.map(o => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </SearchBar>

      <Card>
        <CardContent className="p-0">
          {list.isLoading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <Empty title="暂无租赁订单" className="m-4" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>订单</TableHead>
                  <TableHead>承租公司</TableHead>
                  <TableHead>使用人</TableHead>
                  <TableHead>月租</TableHead>
                  <TableHead>起止时间</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map(r => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div className="font-medium">{r.assetSku?.name ?? '-'}</div>
                      <div className="text-xs text-muted-foreground">#{r.id} · {r.assetSku?.spec ?? '-'}</div>
                    </TableCell>
                    <TableCell>{r.company?.name ?? '-'}</TableCell>
                    <TableCell>
                      <div>{r.rentalUser?.name ?? '-'}</div>
                      <div className="text-xs text-muted-foreground">{r.rentalUser?.mobile ?? '-'}</div>
                    </TableCell>
                    <TableCell className="font-semibold text-brand-600">{formatPrice(r.rentalPrice)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(r.rentalStartTime)} ~ {formatDate(r.rentalEndTime)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge label={getStatusLabel(r.status)} tone={getStatusColor(r.status) as any} />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => setDetailId(r.id)}>
                            <Eye className="size-4" />
                            查看详情
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {r.status === 'PENDING_DEPLOY' && (
                            <DropdownMenuItem
                              onClick={() => {
                                setActionId(r.id)
                                setAction('deploy')
                              }}
                            >
                              <PackageCheck className="size-4" />
                              安装
                            </DropdownMenuItem>
                          )}
                          {r.status === 'REPAIR_APPLYING' && (
                            <DropdownMenuItem
                              onClick={() => {
                                setActionId(r.id)
                                setAction('repair')
                              }}
                            >
                              <Wrench className="size-4" />
                              处理维修
                            </DropdownMenuItem>
                          )}
                          {r.status === 'RETURN_APPLYING' && (
                            <DropdownMenuItem
                              onClick={() => {
                                setActionId(r.id)
                                setAction('return')
                              }}
                            >
                              <RotateCcw className="size-4" />
                              处理退租
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Pagination
        page={filters.page}
        pageSize={filters.pageSize}
        total={data?.totalElements ?? 0}
        onPageChange={p => setFilters(f => ({ ...f, page: p }))}
        onPageSizeChange={s => setFilters(f => ({ ...f, pageSize: s }))}
      />

      <RentalDetailSheet id={detailId} open={detailId !== null} onOpenChange={v => !v && setDetailId(null)} />
      <RentalActionDialog
        action={action}
        open={action !== null}
        onOpenChange={v => !v && setAction(null)}
        onSubmit={async (a, payload) => {
          if (actionId === null) return
          if (a === 'deploy' && payload.code && payload.imageId !== undefined) {
            await deploy.mutateAsync({ id: actionId, code: payload.code, imageId: payload.imageId })
          } else if (a === 'repair') {
            await repair.mutateAsync({ id: actionId, remark: payload.remark })
          } else if (a === 'return') {
            await ret.mutateAsync({ id: actionId, remark: payload.remark })
          }
        }}
      />
    </div>
  )
}
