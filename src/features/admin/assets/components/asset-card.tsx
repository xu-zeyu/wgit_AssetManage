'use client'

import Image from 'next/image'
import { Box, Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatPrice } from '@/lib/utils'
import type { AssetSku } from '../api/types'

interface Props {
  data: AssetSku
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}

export function AssetCard({ data, onView, onEdit, onDelete }: Props) {
  const image = data.images?.[0]?.url
  return (
    <Card className="group cursor-pointer overflow-hidden transition-shadow hover:shadow-md" onClick={onView}>
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        {image ? (
          <Image src={image} alt={data.name} fill sizes="320px" className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <Box className="size-8" />
          </div>
        )}
        <div className="absolute right-2 top-2" onClick={e => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="size-8 rounded-full">
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
              <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
                <Trash2 className="size-4" />
                删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {data.category && (
          <Badge variant="warning" className="absolute left-2 top-2">
            {data.category}
          </Badge>
        )}
      </div>
      <CardContent className="space-y-3 p-4">
        <div>
          <h3 className="line-clamp-1 text-base font-semibold">{data.name}</h3>
          <p className="line-clamp-1 text-xs text-muted-foreground">{data.spec || '无规格'}</p>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div>
            <div className="text-xs text-muted-foreground">租金 / 月</div>
            <div className="text-base font-semibold text-brand-600">{formatPrice(data.rentPrice)}</div>
          </div>
          <Badge variant="muted">{data.code}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
