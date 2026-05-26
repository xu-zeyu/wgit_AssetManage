'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserRound } from 'lucide-react'
import { PageHeader } from '@/components/common/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Spinner } from '@/components/ui/spinner'
import { ImageUpload } from '@/components/common/image-upload'
import { useCompanyInfo } from '@/features/company/info/hooks/use-company-info'
import { TransferAdminDialog } from '@/features/company/info/components/transfer-admin-dialog'
import { companyInfoFormSchema, type CompanyInfoFormValues } from '@/features/company/info/schemas/info-schema'

export default function CompanyInfoPage() {
  const { info, update, transfer } = useCompanyInfo()
  const [transferOpen, setTransferOpen] = useState(false)

  const form = useForm<CompanyInfoFormValues>({
    resolver: zodResolver(companyInfoFormSchema),
    defaultValues: { id: 0, name: '', creditCode: '', address: '', icon: null },
  })

  useEffect(() => {
    if (!info.data?.data) return
    const d = info.data.data
    form.reset({
      id: d.id,
      name: d.name ?? '',
      creditCode: d.creditCode ?? '',
      address: d.address ?? '',
      icon: d.icon ? { id: d.icon.id, url: d.icon.url } : null,
    })
  }, [info.data, form])

  const submit = form.handleSubmit(async values => {
    await update.mutateAsync({
      id: values.id,
      name: values.name,
      creditCode: values.creditCode || '',
      address: values.address || '',
      icon: values.icon ? { id: values.icon.id } : undefined,
    })
  })

  if (info.isLoading || !info.data?.data) {
    return (
      <div className="space-y-4">
        <PageHeader title="公司信息" description="维护当前公司的基础资料" />
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    )
  }

  const data = info.data.data

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader title="公司信息" description="维护当前公司的基础资料" />

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>基础信息</CardTitle>
            <CardDescription>更新公司名称、信用代码及地址等信息</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>公司名称</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>信用代码</FormLabel>
                      <FormControl>
                        <Input value={field.value ?? ''} onChange={field.onChange} />
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
                      <FormLabel>办公地址</FormLabel>
                      <FormControl>
                        <Input value={field.value ?? ''} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>公司 Logo</FormLabel>
                      <FormControl>
                        <ImageUpload value={field.value ?? null} onChange={field.onChange} size="lg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="sm:col-span-2 flex justify-end">
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Spinner className="mr-1" />}
                    保存
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>管理员</CardTitle>
            <CardDescription>当前公司管理员账号</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 rounded-2xl border bg-background/50 p-4">
              <Avatar className="size-12">
                <AvatarImage src={`https://robohash.org/${data.admin?.id}?set=set4&bgset=bg1`} />
                <AvatarFallback>{data.admin?.nickname?.charAt(0) ?? '?'}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="font-medium">{data.admin?.nickname || data.admin?.username}</div>
                <div className="text-xs text-muted-foreground">@{data.admin?.username}</div>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={() => setTransferOpen(true)}>
              <UserRound className="size-4" />
              更换管理员
            </Button>
          </CardContent>
        </Card>
      </div>

      <TransferAdminDialog
        open={transferOpen}
        onOpenChange={setTransferOpen}
        onSubmit={async id => {
          await transfer.mutateAsync(id)
        }}
      />
    </div>
  )
}
