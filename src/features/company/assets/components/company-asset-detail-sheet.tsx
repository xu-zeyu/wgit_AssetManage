'use client'

import Image from 'next/image'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from '@/components/common/status-badge'
import { COMPANY_ASSET_STATUS, type CompanyAsset, type CompanyAssetStatus } from '../api/types'

interface Props {
  data: CompanyAsset | null
  open: boolean
  onOpenChange: (v: boolean) => void
}

const STATUS_TONE: Record<CompanyAssetStatus, 'warning' | 'success' | 'secondary'> = {
  PREPARING: 'warning',
  USING: 'success',
  RETURNED: 'secondary',
}

export function CompanyAssetDetailSheet({ data, open, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-md overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>资产详情</SheetTitle>
          <SheetDescription>资产编码、使用人与使用区域</SheetDescription>
        </SheetHeader>
        {!data ? null : (
          <div className="mt-6 space-y-6">
            <div className="overflow-hidden rounded-2xl border">
              {data.images?.[0]?.url ? (
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                  <Image src={data.images[0].url} alt={data.assetAssetSkuName} fill sizes="480px" className="object-cover" />
                </div>
              ) : null}
              <div className="space-y-2 p-4">
                <h2 className="text-base font-semibold tracking-tight">{data.assetAssetSkuName}</h2>
                <p className="text-xs text-muted-foreground">{data.assetAssetSkuSpec || '无规格'}</p>
                <div className="flex items-center justify-between pt-1">
                  <Badge variant="muted">{data.assetCode}</Badge>
                  <StatusBadge
                    label={COMPANY_ASSET_STATUS.find(s => s.value === data.status)?.label ?? data.status}
                    tone={STATUS_TONE[data.status]}
                  />
                </div>
              </div>
            </div>

            <Section title="使用人">
              <Row label="姓名" value={data.rentalUserName || '-'} />
              <Row label="手机" value={data.rentalUserMobile || '-'} />
              <Row label="部门" value={data.rentalUserDepartment || '-'} />
              <Row label="所在区域" value={data.rentalUserRentalUserAreaName || '-'} />
            </Section>

            <Section title="资产信息">
              <Row label="资产 ID" value={`#${data.assetId}`} />
              <Row label="分类" value={data.assetAssetSkuCategory || '-'} />
              <Row label="备注" value={data.remark || '-'} />
            </Section>

            {data.rentalOrderStatus && (
              <Section title="关联租赁状态">
                <Badge variant="info">{data.rentalOrderStatus}</Badge>
              </Section>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h4>
      <div className="space-y-2 rounded-2xl border bg-background/40 p-4">{children}</div>
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
