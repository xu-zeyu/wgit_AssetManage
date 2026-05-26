'use client'

import Image from 'next/image'
import { Building2, Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import type { Company } from '../api/types'

interface Props {
  data: Company
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}

export function CompanyCard({ data, onView, onEdit, onDelete }: Props) {
  return (
    <Card className="group cursor-pointer overflow-hidden transition-shadow hover:shadow-md" onClick={onView}>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start gap-3">
          <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-muted">
            {data.icon?.url ? (
              <Image src={data.icon.url} alt={data.name} width={48} height={48} className="size-12 object-cover" />
            ) : (
              <Building2 className="size-5 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <h3 className="line-clamp-1 text-base font-semibold">{data.name}</h3>
                <p className="text-xs text-muted-foreground">编码 · {data.code}</p>
              </div>
              <div onClick={e => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8 -mt-1">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36">
                    <DropdownMenuItem onClick={onView}>
                      <Eye className="size-4" />
                      查看详情
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onEdit}>
                      <Pencil className="size-4" />
                      编辑
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={onDelete}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="size-4" />
                      删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-1 text-xs text-muted-foreground">
          <Row label="信用代码" value={data.creditCode || '-'} />
          <Row label="办公地址" value={data.address || '-'} />
          <Row label="管理员" value={data.admin?.nickname || '-'} />
        </div>
        <div className="flex items-center justify-between border-t pt-3">
          <Badge variant="warning">{data.rentPolicy?.name ?? '未设政策'}</Badge>
          <span className="text-[11px] text-muted-foreground">ID #{data.id}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground/70">{label}</span>
      <span className="line-clamp-1 max-w-[60%] text-right text-foreground/80">{value}</span>
    </div>
  )
}
