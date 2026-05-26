'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  onSubmit: (reason: string) => Promise<void> | void
}

export function RejectDialog({ open, onOpenChange, onSubmit }: Props) {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>拒绝申请</DialogTitle>
          <DialogDescription>请填写拒绝原因，便于员工了解情况</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="reason">拒绝原因</Label>
          <Textarea
            id="reason"
            rows={4}
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="例如：库存不足，请稍后重新申请"
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>
            取消
          </Button>
          <Button variant="destructive" onClick={handle} disabled={!reason.trim() || loading}>
            {loading && <Spinner className="mr-1" />}
            提交拒绝
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
