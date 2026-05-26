'use client'

import type { ReactNode } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Props {
  children: ReactNode
  onSearch: () => void
  onReset: () => void
  className?: string
}

export function SearchBar({ children, onSearch, onReset, className }: Props) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-end gap-3 rounded-2xl border bg-card p-4 shadow-sm',
        className,
      )}
    >
      <div className="flex flex-1 flex-wrap items-end gap-3">{children}</div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onReset}>
          <X className="size-4" />
          重置
        </Button>
        <Button size="sm" onClick={onSearch}>
          <Search className="size-4" />
          查询
        </Button>
      </div>
    </div>
  )
}
