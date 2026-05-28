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
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { ImageUpload } from '@/components/common/image-upload'
import { listCompanies } from '@/features/admin/companies/api/list-companies'
import { listAssetSkuCategories } from '../api/list-asset-skus'
import { assetSkuFormSchema, type AssetSkuFormValues } from '../schemas/asset-schema'
import type { AssetSku, CreateAssetSkuRequest, UpdateAssetSkuRequest } from '../api/types'

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  initial?: AssetSku | null
  onSubmit: (payload: CreateAssetSkuRequest | UpdateAssetSkuRequest) => Promise<void> | void
}

export function AssetFormDialog({ open, onOpenChange, initial, onSubmit }: Props) {
  const form = useForm<AssetSkuFormValues>({
    resolver: zodResolver(assetSkuFormSchema),
    defaultValues: { name: '', rentPrice: 0, companyIds: [], images: [] } as AssetSkuFormValues,
  })

  const companies = useQuery({
    queryKey: ['admin-asset-form-companies'],
    queryFn: () => listCompanies({ page: 0, size: 50, sort: 'id,desc' }),
    enabled: open,
  })

  const categories = useQuery({
    queryKey: ['admin-asset-form-categories'],
    queryFn: () => listAssetSkuCategories(),
    enabled: open,
  })
  const categoryOptions = (categories.data?.data ?? []).filter(category => category.trim().length > 0)

  useEffect(() => {
    if (!open) return
    form.reset({
      id: initial?.id,
      code: initial?.code,
      name: initial?.name ?? '',
      spec: initial?.spec ?? '',
      category: initial?.category ?? '',
      useTarget: initial?.useTarget ?? '',
      rentPrice: initial?.rentPrice ?? 0,
      purchaseChannel: initial?.purchaseChannel ?? '',
      purchaseTime: initial?.purchaseTime ?? '',
      purchasePrice: initial?.purchasePrice ?? 0,
      afterSale: initial?.afterSale ?? '',
      remark: initial?.remark ?? '',
      companyIds: initial?.companies?.map(c => c.id) ?? [],
      images: initial?.images?.map(i => ({ id: i.id, url: i.url })) ?? [],
    } as AssetSkuFormValues)
  }, [open, initial, form])

  const submit = form.handleSubmit(async values => {
    try {
      const base = {
        name: values.name,
        spec: values.spec,
        useTarget: values.useTarget,
        category: values.category,
        purchaseChannel: values.purchaseChannel || null,
        purchaseTime: values.purchaseTime || null,
        purchasePrice: values.purchasePrice ?? null,
        afterSale: values.afterSale || null,
        rentPrice: values.rentPrice,
        remark: values.remark || null,
        companies: values.companyIds.map(id => ({ id })),
        images: (values.images ?? []).map(i => ({ id: i.id })),
      }
      if (initial?.id) {
        await onSubmit({ ...base, id: initial.id, code: initial.code })
      } else {
        await onSubmit(base)
      }
      onOpenChange(false)
    } catch (e: any) {
      toast.error(e?.response?.data?.message || '提交失败')
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{initial?.id ? '编辑资产' : '新增资产'}</DialogTitle>
          <DialogDescription>维护资产基础信息与可租用的公司范围</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>资产名称</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="请输入名称" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="spec"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>规格</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="如：15.6 寸 / 16G+512G" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>分类</FormLabel>
                  <Select value={field.value || undefined} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择分类" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoryOptions.map(c => (
                        <SelectItem key={c} value={c}>
                          {c}
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
              name="rentPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>月租金（元）</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={field.value as number}
                      onChange={e => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="useTarget"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>使用对象</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="如：开发人员、销售人员等" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyIds"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>可租用公司</FormLabel>
                  <FormControl>
                    <CompanyMultiSelect
                      value={field.value ?? []}
                      onChange={field.onChange}
                      options={companies.data?.data.content ?? []}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>主图</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value?.[0] ?? null}
                      onChange={v => field.onChange(v ? [v] : [])}
                      size="lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="remark"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>备注</FormLabel>
                  <FormControl>
                    <Textarea
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      placeholder="补充信息"
                      rows={3}
                    />
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

function CompanyMultiSelect({
  value,
  onChange,
  options,
}: {
  value: number[]
  onChange: (next: number[]) => void
  options: Array<{ id: number; name: string; code: string }>
}) {
  function toggle(id: number) {
    if (value.includes(id)) onChange(value.filter(v => v !== id))
    else onChange([...value, id])
  }

  if (options.length === 0) {
    return <p className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">暂无可选公司</p>
  }

  return (
    <div className="flex flex-wrap gap-2 rounded-xl border bg-background p-3">
      {options.map(o => {
        const active = value.includes(o.id)
        return (
          <button
            type="button"
            key={o.id}
            onClick={() => toggle(o.id)}
            className={
              'rounded-full border px-3 py-1 text-xs transition-colors ' +
              (active
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground')
            }
          >
            <Badge
              variant={active ? 'default' : 'outline'}
              className={active ? 'border-transparent bg-primary/0' : 'border-transparent'}
            >
              {o.name}
            </Badge>
          </button>
        )
      })}
    </div>
  )
}
