'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useCurrentCompanyId } from '@/hooks/use-current-company-id'
import { listCompanyAssets } from '../api/list-company-assets'
import type { CompanyAssetQuery, CompanyAssetStatus } from '../api/types'

interface Filters {
  status?: CompanyAssetStatus
  skuCategory?: string
  areaName?: string
  page: number
  pageSize: number
}

const initial: Filters = { page: 1, pageSize: 12 }

export function useCompanyAssets() {
  const currentCompanyId = useCurrentCompanyId()
  const [filters, setFilters] = useState<Filters>(initial)

  const list = useQuery({
    queryKey: ['company-assets', currentCompanyId, filters],
    queryFn: () =>
      listCompanyAssets({
        status: filters.status,
        skuCategory: filters.skuCategory,
        areaName: filters.areaName,
        page: filters.page - 1,
        size: filters.pageSize,
        sort: 'id,desc',
      } satisfies CompanyAssetQuery),
  })

  return { filters, setFilters, reset: () => setFilters(initial), list }
}
