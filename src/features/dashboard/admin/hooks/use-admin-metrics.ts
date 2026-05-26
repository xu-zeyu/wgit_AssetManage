'use client'

import { useQuery } from '@tanstack/react-query'
import { listCompanies } from '@/features/admin/companies/api/list-companies'
import { listAssetSkus } from '@/features/admin/assets/api/list-asset-skus'
import { listRentals, getRentalCount } from '@/features/admin/rentals/api/list-rentals'
import { listPolicies } from '@/features/admin/policies/api/list-policies'

const TOTAL_PARAMS = { page: 0, size: 1, sort: 'id,desc' }

export function useAdminMetrics() {
  const companies = useQuery({
    queryKey: ['admin-metrics', 'companies'],
    queryFn: () => listCompanies(TOTAL_PARAMS),
  })
  const skus = useQuery({
    queryKey: ['admin-metrics', 'skus'],
    queryFn: () => listAssetSkus(TOTAL_PARAMS),
  })
  const rentals = useQuery({
    queryKey: ['admin-metrics', 'rentals'],
    queryFn: () => listRentals(TOTAL_PARAMS),
  })
  const policies = useQuery({
    queryKey: ['admin-metrics', 'policies'],
    queryFn: () => listPolicies(TOTAL_PARAMS),
  })
  const pending = useQuery({
    queryKey: ['admin-metrics', 'pending'],
    queryFn: () => getRentalCount(),
  })

  return {
    companies: companies.data?.data.totalElements ?? 0,
    skus: skus.data?.data.totalElements ?? 0,
    rentals: rentals.data?.data.totalElements ?? 0,
    policies: policies.data?.data.totalElements ?? 0,
    pendingRentals: pending.data?.data ?? 0,
    loading:
      companies.isLoading || skus.isLoading || rentals.isLoading || policies.isLoading || pending.isLoading,
  }
}
