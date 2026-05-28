'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { listOfficeAreas } from '@/features/company/office-areas/api/office-areas-api'
import { memberFormSchema, type MemberFormValues } from '../schemas/member-schema'
import type { CompanyMember, CreateMemberRequest, UpdateMemberRequest } from '../api/types'

interface Props {
  open: boolean
  initial?: CompanyMember | null
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: CreateMemberRequest | UpdateMemberRequest) => Promise<void> | void
}

export function MemberFormDialog({ open, initial, onOpenChange, onSubmit }: Props) {
  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: { name: '', mobile: '', department: '', position: '', areaId: undefined },
  })

  const areas = useQuery({
    queryKey: ['member-form-office-areas'],
    queryFn: () => listOfficeAreas({ page: 0, size: 100, sort: 'id,desc' }),
    enabled: open,
  })

  useEffect(() => {
    if (!open) return
    form.reset({
      id: initial?.id,
      name: initial?.name ?? '',
      mobile: initial?.mobile ?? '',
      department: initial?.department ?? '',
      position: initial?.position ?? '',
      areaId: initial?.area?.id ?? undefined,
    })
  }, [open, initial, form])

  useEffect(() => {
    if (!open || initial?.area?.id || form.getValues('areaId')) return
    const firstAreaId = areas.data?.data.content?.[0]?.id
    if (firstAreaId) form.setValue('areaId', firstAreaId)
  }, [areas.data, form, initial?.area?.id, open])

  const submit = form.handleSubmit(async values => {
    const payload = {
      name: values.name,
      mobile: values.mobile,
      department: values.department || null,
      position: values.position || '',
      area: values.areaId ? { id: values.areaId } : undefined,
    }

    await onSubmit(initial?.id ? { id: initial.id, ...payload } : payload)
    onOpenChange(false)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial?.id ? '编辑成员' : '新增成员'}</DialogTitle>
          <DialogDescription>维护当前公司的成员联系方式、岗位与办公区域</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>姓名</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="请输入姓名" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>手机号</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="请输入手机号" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>部门</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="例如：研发中心" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>职务</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="例如：前端工程师" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="areaId"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>办公区域</FormLabel>
                  <Select
                    value={field.value ? String(field.value) : 'none'}
                    onValueChange={value => field.onChange(value === 'none' ? undefined : Number(value))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={areas.isLoading ? '加载中...' : '请选择办公区域'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">暂不设置</SelectItem>
                      {(areas.data?.data.content ?? []).map(area => (
                        <SelectItem key={area.id} value={String(area.id)}>
                          {area.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="sm:col-span-2 pt-2">
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
