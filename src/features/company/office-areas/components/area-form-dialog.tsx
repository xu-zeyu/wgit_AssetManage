'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'
import { officeAreaFormSchema, type OfficeAreaFormValues } from '../schemas/area-schema'
import type { OfficeArea } from '../api/types'

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  initial?: OfficeArea | null
  onSubmit: (values: OfficeAreaFormValues) => Promise<void> | void
}

export function AreaFormDialog({ open, onOpenChange, initial, onSubmit }: Props) {
  const form = useForm<OfficeAreaFormValues>({
    resolver: zodResolver(officeAreaFormSchema),
    defaultValues: { name: '', address: '', remark: '' },
  })

  useEffect(() => {
    if (!open) return
    form.reset({
      id: initial?.id,
      name: initial?.name ?? '',
      address: initial?.address ?? '',
      remark: initial?.remark ?? '',
    })
  }, [open, initial, form])

  const submit = form.handleSubmit(async v => {
    await onSubmit(v)
    onOpenChange(false)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initial?.id ? '编辑办公区域' : '新建办公区域'}</DialogTitle>
          <DialogDescription>方便资产盘点与归属管理</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={submit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>区域名称</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="例如：研发中心 1F" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>地址</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="详细地址" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="remark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>备注</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} placeholder="补充说明" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button variant="ghost" type="button" onClick={() => onOpenChange(false)}>
                取消
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Spinner className="mr-1" />}
                提交
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
