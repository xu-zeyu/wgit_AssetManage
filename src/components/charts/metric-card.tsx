import type { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface Props {
  label: string
  value: ReactNode
  hint?: string
  icon?: ReactNode
  loading?: boolean
  tone?: 'brand' | 'success' | 'info' | 'muted'
  className?: string
}

const TONE: Record<NonNullable<Props['tone']>, string> = {
  brand: 'from-brand-300/30 to-brand-100/20 text-brand-600',
  success: 'from-success/20 to-success/5 text-success',
  info: 'from-info/20 to-info/5 text-info',
  muted: 'from-muted to-muted/40 text-muted-foreground',
}

export function MetricCard({ label, value, hint, icon, loading, tone = 'brand', className }: Props) {
  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <div className={cn('absolute -right-10 -top-10 size-32 rounded-full bg-gradient-to-br opacity-70', TONE[tone])} />
      <CardContent className="relative space-y-2 p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
          {icon && (
            <div className={cn('grid size-9 place-items-center rounded-xl bg-background/80 shadow-sm', TONE[tone])}>
              {icon}
            </div>
          )}
        </div>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="text-3xl font-semibold tracking-tight">{value}</div>
        )}
        {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
      </CardContent>
    </Card>
  )
}
