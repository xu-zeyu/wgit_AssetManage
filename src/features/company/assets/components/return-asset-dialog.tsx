'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  assetName?: string
  onSubmit: (reason: string) => Promise<void> | void
}

export function ReturnAssetDialog({ open, onOpenChange, assetName, onSubmit }: Props) {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) setReason('')
  }, [open])

  async function handle() {
    setLoading(true)
    try {
      await onSubmit(reason.trim())
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={v => !loading && onOpenChange(v)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>退租资产</DialogTitle>
          <DialogDescription>
            {assetName ? `即将退租「${assetName}」，` : ''}请填写退租原因
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="return-reason">退租原因</Label>
          <Textarea
            id="return-reason"
            rows={4}
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="例如：员工离职、设备闲置、转交他人等"
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>
            取消
          </Button>
          <Button variant="destructive" onClick={handle} disabled={!reason.trim() || loading}>
            {loading && <Spinner className="mr-1" />}
            确认退租
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
