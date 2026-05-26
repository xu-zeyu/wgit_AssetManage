'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useCurrentCompanyId } from '@/hooks/use-current-company-id'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { listOfficeAreas } from '@/features/company/office-areas/api/office-areas-api'

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  onSubmit: (payload: { areaId?: number; planInventoryDate?: string }) => Promise<void> | void
}

export function InventoryCreateDialog({ open, onOpenChange, onSubmit }: Props) {
  const currentCompanyId = useCurrentCompanyId()
  const [areaId, setAreaId] = useState<number | null>(null)
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(false)

  const areas = useQuery({
    queryKey: ['inventory-create-areas', currentCompanyId],
    queryFn: () => listOfficeAreas({ page: 0, size: 50, sort: 'id,desc' }),
    enabled: open,
  })

  async function handle() {
    setLoading(true)
    try {
      await onSubmit({ areaId: areaId ?? undefined, planInventoryDate: date || undefined })
      onOpenChange(false)
      setAreaId(null)
      setDate('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>新建盘点任务</DialogTitle>
          <DialogDescription>选择办公区域与计划盘点日期</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>办公区域</Label>
            <Select value={areaId ? String(areaId) : ''} onValueChange={v => setAreaId(Number(v))}>
              <SelectTrigger>
                <SelectValue placeholder={areas.isLoading ? '加载中...' : '请选择区域'} />
              </SelectTrigger>
              <SelectContent>
                {(areas.data?.data.content ?? []).map(a => (
                  <SelectItem key={a.id} value={String(a.id)}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>计划日期</Label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>
            取消
          </Button>
          <Button onClick={handle} disabled={loading}>
            {loading && <Spinner className="mr-1" />}
            创建
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
