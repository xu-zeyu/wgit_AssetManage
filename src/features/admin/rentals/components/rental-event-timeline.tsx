'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  CheckCircle,
  Play,
  Wrench,
  DollarSign,
  RotateCcw,
  Archive,
  Clock,
  Eye,
  Copy,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { formatDateTime } from '@/lib/utils'
import {
  type ActionRecord,
  type ActionType,
  getActionLabel,
  getActionColor,
} from '../api/types'

const ACTION_ICONS: Record<ActionType, React.ComponentType<{ className?: string }>> = {
  RECEIVE: CheckCircle,
  USE: Play,
  REPAIR_APPLY: Wrench,
  REPAIR: Wrench,
  COMPENSATE: DollarSign,
  RETURN_APPLY: RotateCcw,
  RETURN: Archive,
}

interface Props {
  records?: ActionRecord[]
  className?: string
}

export function RentalEventTimeline({ records, className }: Props) {
  const [detailData, setDetailData] = useState<string | null>(null)

  if (!records || records.length === 0) {
    return (
      <div className={cn('py-10 text-center text-sm text-muted-foreground', className)}>
        暂无操作记录
      </div>
    )
  }

  return (
    <div className={cn('relative', className)}>
      {/* Vertical timeline line */}
      <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-amber-400 via-emerald-400 to-gray-300" />

      <div className="space-y-5">
        {records.map((record, idx) => (
          <TimelineItem
            key={record.id ?? idx}
            record={record}
            index={idx}
            onViewData={d => setDetailData(d)}
          />
        ))}
      </div>

      <DataDetailDialog
        open={detailData !== null}
        data={detailData}
        onClose={() => setDetailData(null)}
      />
    </div>
  )
}

function TimelineItem({
  record,
  index,
  onViewData,
}: {
  record: ActionRecord
  index: number
  onViewData: (data: string) => void
}) {
  const Icon = ACTION_ICONS[record.actionType] ?? Archive
  const color = getActionColor(record.actionType)

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.25 }}
      className="relative pl-12"
    >
      {/* Dot */}
      <div
        className="absolute left-[12px] top-5 flex size-[15px] items-center justify-center rounded-full border-2 border-background shadow-sm"
        style={{ backgroundColor: color }}
      >
        <Icon className="size-[8px] text-white" />
      </div>

      {/* Card */}
      <div className="rounded-2xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <Badge
            variant="outline"
            className="gap-1 px-2.5 py-0.5 text-xs font-medium"
            style={{ borderColor: color, color }}
          >
            <Icon className="size-3" />
            {getActionLabel(record.actionType)}
          </Badge>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3" />
            {formatDateTime(record.createdTime)}
          </div>
        </div>

        {/* Body */}
        <div className="flex items-center gap-3">
          <Avatar className="size-10 ring-2 ring-border/50">
            <AvatarFallback className="bg-amber-50 text-amber-700 text-xs font-medium">
              {(record.operator.nickname || record.operator.username || '?').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">
              {record.operator.nickname || record.operator.username || '未知'}
            </p>
            <p className="text-xs text-muted-foreground">操作人员</p>
          </div>
          {record.rentalOrder && (
            <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
              #{record.rentalOrder.id}
            </span>
          )}
        </div>

        {/* Footer */}
        {record.data && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => onViewData(record.data!)}
            >
              <Eye className="size-3" />
              查看详情
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function DataDetailDialog({
  open,
  data,
  onClose,
}: {
  open: boolean
  data: string | null
  onClose: () => void
}) {
  const formatted = (() => {
    if (!data) return ''
    try {
      return JSON.stringify(JSON.parse(data), null, 2)
    } catch {
      return data
    }
  })()

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>数据详情</DialogTitle>
          <DialogDescription>操作记录的原始数据内容</DialogDescription>
        </DialogHeader>
        <pre className="max-h-[50vh] overflow-auto rounded-xl bg-muted/60 p-4 text-xs leading-relaxed text-foreground/80">
          {formatted || '无数据'}
        </pre>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="size-3.5 mr-1" />
            关闭
          </Button>
          <Button
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(formatted)
              toast.success('已复制到剪贴板')
            }}
          >
            <Copy className="size-3.5 mr-1" />
            复制内容
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
