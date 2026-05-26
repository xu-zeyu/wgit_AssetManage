'use client'

import { Building2, Box, ClipboardList, FileBadge, AlertCircle } from 'lucide-react'
import { PageHeader } from '@/components/common/page-header'
import { MetricCard } from '@/components/charts/metric-card'
import { useUserStore } from '@/stores/use-user-store'
import { useAdminMetrics } from '@/features/dashboard/admin/hooks/use-admin-metrics'
import { RentalStatusChart } from '@/features/dashboard/admin/components/rental-status-chart'
import { RecentRentals } from '@/features/dashboard/admin/components/recent-rentals'

export default function AdminDashboardPage() {
  const name = useUserStore(s => s.name)
  const m = useAdminMetrics()

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={`你好，${name || '管理员'}`}
        description="资产、租赁与公司协作全景一览"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="资产 SKU"
          value={m.skus}
          hint="平台已收录的资产种类"
          icon={<Box className="size-4" />}
          loading={m.loading}
          tone="brand"
        />
        <MetricCard
          label="租赁订单"
          value={m.rentals}
          hint="累计租赁订单数量"
          icon={<ClipboardList className="size-4" />}
          loading={m.loading}
          tone="info"
        />
        <MetricCard
          label="管理公司"
          value={m.companies}
          hint="已开通的企业租户"
          icon={<Building2 className="size-4" />}
          loading={m.loading}
          tone="success"
        />
        <MetricCard
          label="待处理"
          value={m.pendingRentals}
          hint="包含待安装与申请中的订单"
          icon={<AlertCircle className="size-4" />}
          loading={m.loading}
          tone="muted"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <RentalStatusChart />
        <RecentRentals />
      </div>

      <MetricCard
        label="租金政策"
        value={m.policies}
        hint="不同折扣策略已配置数量"
        icon={<FileBadge className="size-4" />}
        loading={m.loading}
        tone="brand"
      />
    </div>
  )
}
