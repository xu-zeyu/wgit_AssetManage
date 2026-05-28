'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { listCompanyMembers } from '@/features/company/members/api/list-members'
import { listCompanyAssetSkuOptions } from '../api/list-asset-sku-options'
import type { ApplyCompanyAssetsRequest, ApplyCompanyAssetResult } from '../api/types'
import { assetApplicationSchema, type AssetApplicationFormValues } from '../schemas/asset-application-schema'
import {
  AssetApplicationMemberPicker,
  type AssetApplicationMemberOption,
} from './asset-application-member-picker'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: ApplyCompanyAssetsRequest) => Promise<ApplyCompanyAssetResult[]>
}

export function AssetApplicationDialog({ open, onOpenChange, onSubmit }: Props) {
  const form = useForm<AssetApplicationFormValues>({
    resolver: zodResolver(assetApplicationSchema),
    defaultValues: { assetSkuId: '', userIds: [] },
  })

  const assetSkus = useQuery({
    queryKey: ['company-asset-application-skus'],
    queryFn: () => listCompanyAssetSkuOptions({ page: 0, size: 1000, sort: 'id,desc' }),
    enabled: open,
  })

  const members = useQuery({
    queryKey: ['company-asset-application-members'],
    queryFn: () => listCompanyMembers({ page: 0, size: 500, sort: 'id,desc' }),
    enabled: open,
  })

  const memberOptions: AssetApplicationMemberOption[] = (members.data?.data.content ?? [])
    .filter(member => member.user?.id)
    .map(member => ({
      id: member.user!.id,
      name: member.name || member.user?.nickname || member.user?.username || `成员 ${member.id}`,
      department: member.department ?? undefined,
      areaName: member.area?.name ?? undefined,
    }))

  useEffect(() => {
    if (!open) return
    form.reset({ assetSkuId: '', userIds: [] })
  }, [form, open])

  useEffect(() => {
    if (!open || form.getValues('assetSkuId')) return
    const firstSku = assetSkus.data?.data.content?.[0]
    if (firstSku) form.setValue('assetSkuId', String(firstSku.id))
  }, [assetSkus.data, form, open])

  const submit = form.handleSubmit(async values => {
    const results = await onSubmit({
      applyAssets: [{ assetSkuId: Number(values.assetSkuId), quantity: 1 }],
      userIds: values.userIds,
    })

    const success = results.filter(item => item.success)
    const failed = results.filter(item => !item.success)
    if (success.length === results.length) {
      toast.success(`已提交 ${success.length} 条资产申领`)
      onOpenChange(false)
      return
    }

    if (success.length > 0) {
      const reasons = failed.map(item => item.reason).filter(Boolean).join('；')
      toast.success(`成功 ${success.length} 条，失败 ${failed.length} 条`)
      if (reasons) toast.error(reasons)
      onOpenChange(false)
      return
    }

    const reasons = failed.map(item => item.reason).filter(Boolean).join('；')
    form.setError('root', { message: reasons || '资产申领失败，请稍后重试' })
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>新增资产</DialogTitle>
          <DialogDescription>选择资产标的与申领取人，提交后将发起资产申领流程</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={submit} className="space-y-5">
            <FormField
              control={form.control}
              name="assetSkuId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>资产标的</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={assetSkus.isLoading ? '加载中...' : '请选择资产标的'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(assetSkus.data?.data.content ?? []).map(asset => (
                        <SelectItem key={asset.id} value={String(asset.id)}>
                          {asset.name}
                          {asset.spec ? ` · ${asset.spec}` : ''}
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
              name="userIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>申领取人</FormLabel>
                  <FormControl>
                    <AssetApplicationMemberPicker options={memberOptions} value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root?.message && (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {form.formState.errors.root.message}
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                取消
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting || assetSkus.isLoading || members.isLoading || memberOptions.length === 0}
              >
                {form.formState.isSubmitting && <Spinner className="mr-1" />}
                提交申领
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
