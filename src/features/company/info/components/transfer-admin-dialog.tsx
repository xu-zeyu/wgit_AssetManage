'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { listUsers } from '@/features/admin/companies/api/list-users'

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  onSubmit: (adminId: number) => Promise<void> | void
}

export function TransferAdminDialog({ open, onOpenChange, onSubmit }: Props) {
  const [value, setValue] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const users = useQuery({
    queryKey: ['transfer-admin-users'],
    queryFn: () => listUsers({ size: 50, page: 0, sort: 'id,asc' }),
    enabled: open,
  })

  async function handle() {
    if (!value) return
    setLoading(true)
    try {
      await onSubmit(value)
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>更换公司管理员</DialogTitle>
          <DialogDescription>更换后当前账号将失去管理权限，请谨慎操作</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label>新的管理员</Label>
          <Select value={value ? String(value) : undefined} onValueChange={v => setValue(Number(v))}>
            <SelectTrigger>
              <SelectValue placeholder={users.isLoading ? '加载中...' : '请选择'} />
            </SelectTrigger>
            <SelectContent>
              {(users.data?.data.content ?? []).map(u => (
                <SelectItem key={u.id} value={String(u.id)}>
                  {u.username} ({u.nickname})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>
            取消
          </Button>
          <Button onClick={handle} disabled={!value || loading} variant="destructive">
            {loading && <Spinner className="mr-1" />}
            确定更换
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
