'use client'

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface Props {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
  pageSizeOptions?: number[]
  /**
   * 是否悬浮固定在底部（默认 true）。在弹窗 / Dialog 内可设为 false。
   */
  floating?: boolean
  /** 总数为 0 时是否仍然显示分页（默认 false） */
  showWhenEmpty?: boolean
  className?: string
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  floating = true,
  showWhenEmpty = false,
  className,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const first = total === 0 ? 0 : (safePage - 1) * pageSize + 1
  const last = Math.min(safePage * pageSize, total)

  if (total === 0 && !showWhenEmpty) return null

  const inner = (
    <div className="flex flex-col items-center justify-between gap-3 px-4 py-2 sm:flex-row">
      <div className="text-xs text-muted-foreground">
        {total === 0 ? '暂无数据' : `第 ${first}-${last} 条 / 共 ${total} 条`}
      </div>
      <div className="flex items-center gap-2">
        {onPageSizeChange && (
          <Select
            value={String(pageSize)}
            onValueChange={v => {
              onPageSizeChange(Number(v))
              onPageChange(1)
            }}
          >
            <SelectTrigger className="h-8 w-[88px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map(opt => (
                <SelectItem key={opt} value={String(opt)}>
                  {opt} 条/页
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <div className="flex items-center gap-1">
          <Button size="icon" variant="outline" disabled={safePage <= 1} onClick={() => onPageChange(1)}>
            <ChevronsLeft className="size-4" />
          </Button>
          <Button size="icon" variant="outline" disabled={safePage <= 1} onClick={() => onPageChange(safePage - 1)}>
            <ChevronLeft className="size-4" />
          </Button>
          <span className="px-2 text-xs tabular-nums text-muted-foreground">
            {safePage} / {totalPages}
          </span>
          <Button
            size="icon"
            variant="outline"
            disabled={safePage >= totalPages}
            onClick={() => onPageChange(safePage + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            disabled={safePage >= totalPages}
            onClick={() => onPageChange(totalPages)}
          >
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )

  if (!floating) {
    return <div className={cn('rounded-2xl border bg-card', className)}>{inner}</div>
  }

  return (
    <div
      className={cn(
        // 悬浮区域：贴近视口底部，留出 safe-area
        'pointer-events-none sticky bottom-4 z-20 pb-[env(safe-area-inset-bottom)]',
        className,
      )}
    >
      <div
        className={cn(
          // 浮动容器：磨砂质感、柔和阴影、大圆角
          'pointer-events-auto mx-auto w-full rounded-2xl border bg-background/85 shadow-lg backdrop-blur',
          'supports-[backdrop-filter]:bg-background/70',
        )}
      >
        {inner}
      </div>
    </div>
  )
}
