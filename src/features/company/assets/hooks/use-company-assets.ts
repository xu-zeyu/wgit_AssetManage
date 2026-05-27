'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useCurrentCompanyId } from '@/hooks/use-current-company-id'
import { listCompanyAssets, returnCompanyAssets } from '../api/list-company-assets'
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
  const queryClient = useQueryClient()
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

  const returnAssets = useMutation({
    mutationFn: ({ ids, reason }: { ids: number[]; reason: string }) =>
      returnCompanyAssets(ids, reason),
    onSuccess: () => {
      toast.success('退租成功')
      queryClient.invalidateQueries({ queryKey: ['company-assets'] })
    },
  })

  return { filters, setFilters, reset: () => setFilters(initial), list, returnAssets }
}
