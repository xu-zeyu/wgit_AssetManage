'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { listRentals } from '../api/list-rentals'
import { deployAsset, repairAsset, returnAsset } from '../api/rental-actions'
import type { RentalOrderQuery, RentalStatus } from '../api/types'

interface Filters {
  status?: RentalStatus
  page: number
  pageSize: number
}

const initial: Filters = { page: 1, pageSize: 10 }

export function useRentals() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<Filters>(initial)

  const list = useQuery({
    queryKey: ['admin-rentals', filters],
    queryFn: () =>
      listRentals({
        status: filters.status,
        size: filters.pageSize,
        page: filters.page - 1,
        sort: 'id,desc',
      } satisfies RentalOrderQuery),
  })

  const deploy = useMutation({
    mutationFn: ({ id, code, imageId }: { id: number; code: string; imageId: number }) =>
      deployAsset(id, code, imageId),
    onSuccess: () => {
      toast.success('资产已安装')
      queryClient.invalidateQueries({ queryKey: ['admin-rentals'] })
    },
  })

  const repair = useMutation({
    mutationFn: ({ id, remark }: { id: number; remark?: string }) => repairAsset(id, remark),
    onSuccess: () => {
      toast.success('维修申请已提交')
      queryClient.invalidateQueries({ queryKey: ['admin-rentals'] })
    },
  })

  const ret = useMutation({
    mutationFn: ({ id, remark }: { id: number; remark?: string }) => returnAsset(id, remark),
    onSuccess: () => {
      toast.success('退租申请已提交')
      queryClient.invalidateQueries({ queryKey: ['admin-rentals'] })
    },
  })

  return {
    filters,
    setFilters,
    reset: () => setFilters(initial),
    list,
    deploy,
    repair,
    ret,
  }
}
