'use client'

import Image from 'next/image'
import { Box, Eye, LogOut, Printer } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/common/status-badge'
import { COMPANY_ASSET_STATUS, type CompanyAsset, type CompanyAssetStatus } from '../api/types'

const STATUS_TONE: Record<CompanyAssetStatus, 'warning' | 'success' | 'secondary'> = {
  PREPARING: 'warning',
  USING: 'success',
  RETURNED: 'secondary',
}

interface Props {
  asset: CompanyAsset
  selected: boolean
  onToggleSelected: () => void
  onDetail: () => void
  onReturn: () => void
  onPrint: () => void
}

export function CompanyAssetCard({ asset, selected, onToggleSelected, onDetail, onReturn, onPrint }: Props) {
  return (
    <Card
      className={`group cursor-pointer overflow-hidden transition-shadow hover:shadow-md ${selected ? 'ring-2 ring-brand-300' : ''}`}
      onClick={onDetail}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        {asset.images?.[0]?.url ? (
          <Image src={asset.images[0].url} alt={asset.assetAssetSkuName} fill sizes="280px" className="object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center text-muted-foreground">
            <Box className="size-7" />
          </div>
        )}
        <div className="absolute left-2 top-2">
          <StatusBadge
            label={COMPANY_ASSET_STATUS.find(item => item.value === asset.status)?.label ?? asset.status}
            tone={STATUS_TONE[asset.status]}
          />
        </div>
        <label
          className="absolute right-2 top-2 flex items-center gap-2 rounded-full bg-background/90 px-2 py-1 text-xs shadow-sm"
          onClick={event => event.stopPropagation()}
        >
          <input type="checkbox" checked={selected} onChange={onToggleSelected} className="size-3.5 accent-[var(--brand-500)]" />
          选择
        </label>
      </div>
      <CardContent className="space-y-2 p-4 text-sm">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="line-clamp-1 font-semibold">{asset.assetAssetSkuName}</div>
            <div className="line-clamp-1 text-xs text-muted-foreground">{asset.assetAssetSkuSpec || '-'}</div>
          </div>
          <Badge variant="muted">{asset.assetCode}</Badge>
        </div>
        <div className="space-y-1 text-xs text-muted-foreground">
          <Row label="使用者" value={asset.rentalUserName || '-'} />
          <Row label="部门" value={asset.rentalUserDepartment || '-'} />
          <Row label="区域" value={asset.rentalUserRentalUserAreaName || '-'} />
        </div>
        <div className="flex items-center justify-end gap-1 border-t pt-2" onClick={event => event.stopPropagation()}>
          {asset.status !== 'RETURNED' && asset.rentalOrderStatus === 'RENTING' && (
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={onReturn}>
              <LogOut className="size-4" />
              退租
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onPrint}>
            <Printer className="size-4" />
            打印
            {asset.printCount ? ` (${asset.printCount})` : ''}
          </Button>
          <Button variant="ghost" size="sm" className="-mr-2" onClick={onDetail}>
            <Eye className="size-4" />
            详情
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground/70">{label}</span>
      <span className="line-clamp-1 max-w-[60%] text-right text-foreground/80">{value}</span>
    </div>
  )
}
