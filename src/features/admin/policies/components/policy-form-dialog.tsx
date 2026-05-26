'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { policyFormSchema, type PolicyFormValues } from '../schemas/policy-schema'
import type { RentPolicy } from '../api/types'

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  initial?: RentPolicy | null
  onSubmit: (values: PolicyFormValues) => Promise<void> | void
}

export function PolicyFormDialog({ open, onOpenChange, initial, onSubmit }: Props) {
  const form = useForm<PolicyFormValues>({
    resolver: zodResolver(policyFormSchema),
    defaultValues: { name: '', discount: 1 },
  })

  useEffect(() => {
    if (!open) return
    form.reset({
      id: initial?.id,
      name: initial?.name ?? '',
      discount: initial?.discount ?? 1,
    })
  }, [open, initial, form])

  const submit = form.handleSubmit(async values => {
    await onSubmit(values)
    onOpenChange(false)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initial?.id ? '编辑租金政策' : '新建租金政策'}</DialogTitle>
          <DialogDescription>策略折扣以 0~1 之间的小数表示，例如 0.85 代表 85 折</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={submit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>策略名称</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="例如：A 级客户" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>折扣</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step={0.01}
                      min={0}
                      max={1}
                      value={field.value as number}
                      onChange={e => field.onChange(e.target.valueAsNumber)}
                      placeholder="0 ~ 1 之间"
                    />
                  </FormControl>
                  <FormDescription>当前折扣展示：{((field.value || 0) * 100).toFixed(1)}%</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
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
