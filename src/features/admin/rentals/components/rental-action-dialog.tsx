'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { ImageUpload } from '@/components/common/image-upload'

export type RentalAction = 'deploy' | 'repair' | 'return'

interface Props {
  action: RentalAction | null
  open: boolean
  onOpenChange: (v: boolean) => void
  onSubmit: (
    action: RentalAction,
    payload: { code?: string; imageId?: number; remark?: string },
  ) => Promise<void> | void
}

const TITLE_MAP: Record<RentalAction, { title: string; description: string }> = {
  deploy: { title: '安装资产', description: '请输入资产编码并上传安装现场图' },
  repair: { title: '申请维修', description: '请填写需要维修的具体说明' },
  return: { title: '申请退租', description: '请填写退租原因或备注' },
}

export function RentalActionDialog({ action, open, onOpenChange, onSubmit }: Props) {
  const [code, setCode] = useState('')
  const [image, setImage] = useState<{ id: number; url: string } | null>(null)
  const [remark, setRemark] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setCode('')
      setImage(null)
      setRemark('')
    }
  }, [open])

  if (!action) return null
  const meta = TITLE_MAP[action]
  const canSubmit =
    action === 'deploy' ? code.trim().length > 0 && image : true

  async function handle() {
    if (!action) return
    setLoading(true)
    try {
      await onSubmit(action, {
        code: action === 'deploy' ? code.trim() : undefined,
        imageId: action === 'deploy' ? image?.id : undefined,
        remark: action === 'deploy' ? undefined : remark,
      })
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{meta.title}</DialogTitle>
          <DialogDescription>{meta.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {action === 'deploy' ? (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="asset-code">资产编码</Label>
                <Input id="asset-code" value={code} onChange={e => setCode(e.target.value)} placeholder="请输入资产编码" />
              </div>
              <div className="space-y-1.5">
                <Label>资产照片</Label>
                <ImageUpload value={image} onChange={setImage} size="lg" />
              </div>
            </>
          ) : (
            <div className="space-y-1.5">
              <Label htmlFor="remark">备注</Label>
              <Textarea
                id="remark"
                rows={4}
                value={remark}
                onChange={e => setRemark(e.target.value)}
                placeholder="请填写说明"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>
            取消
          </Button>
          <Button onClick={handle} disabled={!canSubmit || loading}>
            {loading && <Spinner className="mr-1" />}
            提交
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
