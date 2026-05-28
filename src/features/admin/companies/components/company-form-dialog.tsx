'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { ImageUpload } from '@/components/common/image-upload'
import { listUsers } from '../api/list-users'
import { listPolicyOptions } from '@/features/admin/policies/api/list-policies'
import { companyFormSchema, type CompanyFormValues } from '../schemas/company-schema'
import type { Company, CreateCompanyRequest, UpdateCompanyRequest } from '../api/types'

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  initial?: Company | null
  onSubmit: (payload: CreateCompanyRequest | UpdateCompanyRequest) => Promise<void> | void
}

export function CompanyFormDialog({ open, onOpenChange, initial, onSubmit }: Props) {
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: { name: '', code: '', creditCode: '', address: '' } as CompanyFormValues,
  })

  useEffect(() => {
    if (!open) return
    form.reset({
      id: initial?.id,
      name: initial?.name ?? '',
      code: initial?.code ?? '',
      creditCode: initial?.creditCode ?? '',
      address: initial?.address ?? '',
      adminId: initial?.admin?.id as number | undefined,
      rentPolicyId: initial?.rentPolicy?.id as number | undefined,
      icon: initial?.icon ?? null,
    } as CompanyFormValues)
  }, [open, initial, form])

  const users = useQuery({
    queryKey: ['admin-companies', 'users'],
    queryFn: () => listUsers({ size: 50, page: 0, sort: 'id,asc' }),
    enabled: open,
  })

  const policies = useQuery({
    queryKey: ['admin-companies', 'policies'],
    queryFn: () => listPolicyOptions(),
    enabled: open,
  })

  const handleSubmit = form.handleSubmit(async values => {
    try {
      const payload = {
        id: values.id,
        name: values.name,
        code: values.code,
        creditCode: values.creditCode || null,
        address: values.address || '',
        admin: { id: values.adminId },
        rentPolicy: { id: values.rentPolicyId },
        icon: values.icon ? { id: values.icon.id } : null,
      }
      await onSubmit(payload)
      onOpenChange(false)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || '提交失败')
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initial?.id ? '编辑公司' : '新建公司'}</DialogTitle>
          <DialogDescription>填写公司基础信息与管理员配置</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>公司名称</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="请输入公司名称" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>公司编码</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="请输入公司编码" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="creditCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>统一社会信用代码</FormLabel>
                  <FormControl>
                    <Input
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      placeholder="请输入统一信用代码"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>办公地址</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="请输入办公地址" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="adminId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>管理员</FormLabel>
                  <Select
                    value={field.value ? String(field.value) : undefined}
                    onValueChange={v => field.onChange(Number(v))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={users.isLoading ? '加载中...' : '请选择管理员'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(users.data?.data.content ?? []).map(u => (
                        <SelectItem key={u.id} value={String(u.id)}>
                          {u.username} ({u.nickname})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rentPolicyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>租金政策</FormLabel>
                  <Select
                    value={field.value ? String(field.value) : undefined}
                    onValueChange={v => field.onChange(Number(v))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={policies.isLoading ? '加载中...' : '请选择租金政策'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(policies.data?.data ?? []).map(p => (
                        <SelectItem key={p.id} value={String(p.id)}>
                          {p.name} · 折扣 {(p.discount * 100).toFixed(0)}%
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>公司图标</FormLabel>
                  <FormControl>
                    <ImageUpload value={field.value ?? null} onChange={field.onChange} size="md" />
                  </FormControl>
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
