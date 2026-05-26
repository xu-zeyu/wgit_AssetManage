'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useCurrentCompanyId } from '@/hooks/use-current-company-id'
import { createInventoryTask, listInventoryTasks } from '../api/inventory-api'
import type { InventoryStatus } from '../api/types'

interface Filters {
  status?: InventoryStatus
  page: number
  pageSize: number
}

const initial: Filters = { page: 1, pageSize: 10 }

export function useInventory() {
  const currentCompanyId = useCurrentCompanyId()
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<Filters>(initial)

  const list = useQuery({
    queryKey: ['company-inventory', currentCompanyId, filters],
    queryFn: () =>
      listInventoryTasks({
        status: filters.status,
        size: filters.pageSize,
        page: filters.page - 1,
        sort: 'id,desc',
      }),
  })

  const create = useMutation({
    mutationFn: (payload: { areaId?: number; planInventoryDate?: string }) => createInventoryTask(payload),
    onSuccess: () => {
      toast.success('盘点任务已创建')
      queryClient.invalidateQueries({ queryKey: ['company-inventory'] })
    },
  })

  return { filters, setFilters, reset: () => setFilters(initial), list, create }
}
