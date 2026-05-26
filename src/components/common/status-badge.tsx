import { Badge, type BadgeProps } from '@/components/ui/badge'

interface Props {
  label: string
  tone?: 'success' | 'warning' | 'destructive' | 'info' | 'secondary' | 'muted' | 'default'
  className?: string
}

const TONE_MAP: Record<NonNullable<Props['tone']>, BadgeProps['variant']> = {
  success: 'success',
  warning: 'warning',
  destructive: 'destructive',
  info: 'info',
  secondary: 'secondary',
  muted: 'muted',
  default: 'default',
}

export function StatusBadge({ label, tone = 'secondary', className }: Props) {
  return (
    <Badge variant={TONE_MAP[tone]} className={className}>
      <span className="size-1.5 rounded-full bg-current mr-1.5 opacity-60" />
      {label}
    </Badge>
  )
}
