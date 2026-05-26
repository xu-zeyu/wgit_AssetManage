'use client'

import { Box, ClipboardCheck, MapPin, Users } from 'lucide-react'
import { useQueries, useQuery } from '@tanstack/react-query'
import { PageHeader } from '@/components/common/page-header'
import { MetricCard } from '@/components/charts/metric-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useUserStore } from '@/stores/use-user-store'
import { useCompanyStore } from '@/stores/use-company-store'
import { listCompanyAssets } from '@/features/company/assets/api/list-company-assets'
import { listCompanyMembers } from '@/features/company/members/api/list-members'
import { listOfficeAreas } from '@/features/company/office-areas/api/office-areas-api'
import { getApplicationCount } from '@/features/company/reviews/api/reviews-api'
import { COMPANY_ASSET_STATUS } from '@/features/company/assets/api/types'

const totalParams = { page: 0, size: 1, sort: 'id,desc' as const }

export default function CompanyDashboardPage() {
  const name = useUserStore(s => s.name)
  const current = useCompanyStore(s => s.current)

  const assets = useQuery({
    queryKey: ['company-dash', 'assets', current?.id],
    queryFn: () => listCompanyAssets(totalParams),
  })
  const members = useQuery({
    queryKey: ['company-dash', 'members', current?.id],
    queryFn: () => listCompanyMembers(totalParams),
  })
  const areas = useQuery({
    queryKey: ['company-dash', 'areas', current?.id],
    queryFn: () => listOfficeAreas(totalParams),
  })
  const pending = useQuery({
    queryKey: ['company-dash', 'pending', current?.id],
    queryFn: () => getApplicationCount(),
  })

  const statusQueries = useQueries({
    queries: COMPANY_ASSET_STATUS.map(opt => ({
      queryKey: ['company-dash', 'asset-status', opt.value, current?.id],
      queryFn: () => listCompanyAssets({ status: opt.value, page: 0, size: 1, sort: 'id,desc' }),
    })),
  })

  const loading = assets.isLoading || members.isLoading || areas.isLoading || pending.isLoading

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={`你好，${name || '管理员'}`}
        description={current?.name ? `当前公司：${current.name}` : '请选择公司开始管理'}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="公司资产"
          value={assets.data?.data.totalElements ?? 0}
          hint="已纳入管理的资产数量"
          icon={<Box className="size-4" />}
          loading={loading}
          tone="brand"
        />
        <MetricCard
          label="公司成员"
          value={members.data?.data.totalElements ?? 0}
          hint="加入当前公司的成员"
          icon={<Users className="size-4" />}
          loading={loading}
          tone="info"
        />
        <MetricCard
          label="办公区域"
          value={areas.data?.data.totalElements ?? 0}
          hint="已配置的办公地点"
          icon={<MapPin className="size-4" />}
          loading={loading}
          tone="success"
        />
        <MetricCard
          label="待审核"
          value={pending.data?.data ?? 0}
          hint="员工资产申请待处理"
          icon={<ClipboardCheck className="size-4" />}
          loading={loading}
          tone="muted"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>资产状态</CardTitle>
          <CardDescription>按当前状态查看公司资产分布</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {COMPANY_ASSET_STATUS.map((opt, idx) => (
            <div key={opt.value} className="rounded-xl border bg-background/50 p-4">
              <div className="text-xs text-muted-foreground">{opt.label}</div>
              <div className="mt-2 text-2xl font-semibold tabular-nums">
                {statusQueries[idx].data?.data.totalElements ?? 0}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
