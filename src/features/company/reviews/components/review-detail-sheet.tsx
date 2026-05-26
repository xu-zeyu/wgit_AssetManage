'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { APPLICATION_STATUS_LABEL, type AssetApplication } from '../api/types'
import { formatDateTime } from '@/lib/utils'

interface Props {
  data: AssetApplication | null
  open: boolean
  onOpenChange: (v: boolean) => void
}

export function ReviewDetailSheet({ data, open, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-md overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>申请详情</SheetTitle>
          <SheetDescription>查看员工资产申请的完整信息</SheetDescription>
        </SheetHeader>
        {!data ? null : (
          <div className="mt-6 space-y-6 text-sm">
            <div className="rounded-2xl border bg-gradient-to-br from-brand-50/60 to-transparent p-5">
              <div className="text-xs text-muted-foreground">申请的资产</div>
              <div className="mt-1 text-lg font-semibold tracking-tight">{data.assetSku?.name ?? '-'}</div>
              <div className="mt-3 flex items-center gap-2">
                <Badge variant="warning">{APPLICATION_STATUS_LABEL[data.status]}</Badge>
                <span className="text-xs text-muted-foreground">申请编号 #{data.id}</span>
              </div>
            </div>

            <Section title="申请人">
              <div className="flex items-center gap-3">
                <Avatar className="size-12">
                  <AvatarImage src={`https://robohash.org/${data.rentalUser?.user?.id ?? data.id}?set=set4&bgset=bg1`} />
                  <AvatarFallback>{data.rentalUser?.name?.charAt(0) ?? '?'}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="font-medium">{data.rentalUser?.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {data.rentalUser?.user?.username ? `@${data.rentalUser.user.username}` : '-'}
                  </div>
                </div>
              </div>
              <Separator className="my-3" />
              <Row label="手机号" value={data.rentalUser?.mobile ?? '-'} />
              <Row label="部门" value={data.rentalUser?.department ?? '-'} />
              <Row label="所在区域" value={data.rentalUser?.area?.name ?? '-'} />
            </Section>

            <Section title="时间线">
              <Row label="申请时间" value={formatDateTime(data.applyTime)} />
              <Row label="审核时间" value={formatDateTime(data.auditTime)} />
              <Row label="创建时间" value={formatDateTime(data.createdTime)} />
            </Section>

            {data.rejectReason && (
              <Section title="拒绝原因" tone="destructive">
                <p className="text-sm text-destructive">{data.rejectReason}</p>
              </Section>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

function Section({
  title,
  children,
  tone,
}: {
  title: string
  children: React.ReactNode
  tone?: 'destructive'
}) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h4>
      <div
        className={
          'space-y-2 rounded-2xl border p-4 ' +
          (tone === 'destructive' ? 'bg-destructive/5 border-destructive/30' : 'bg-background/40')
        }
      >
        {children}
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right text-foreground">{value || '-'}</span>
    </div>
  )
}
