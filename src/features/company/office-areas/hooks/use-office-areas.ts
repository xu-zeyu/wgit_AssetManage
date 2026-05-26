'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useCurrentCompanyId } from '@/hooks/use-current-company-id'
import {
  createOfficeArea,
  deleteOfficeArea,
  listOfficeAreas,
  updateOfficeArea,
} from '../api/office-areas-api'
import type { CreateOfficeAreaRequest, UpdateOfficeAreaRequest } from '../api/types'

const initial = { page: 1, pageSize: 12 }

export function useOfficeAreas() {
  const currentCompanyId = useCurrentCompanyId()
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState(initial)

  const list = useQuery({
    queryKey: ['company-office-areas', currentCompanyId, filters],
    queryFn: () =>
      listOfficeAreas({ page: filters.page - 1, size: filters.pageSize, sort: 'id,desc' }),
  })

  const create = useMutation({
    mutationFn: (payload: CreateOfficeAreaRequest) => createOfficeArea(payload),
    onSuccess: () => {
      toast.success('创建成功')
      queryClient.invalidateQueries({ queryKey: ['company-office-areas'] })
    },
  })

  const update = useMutation({
    mutationFn: (payload: UpdateOfficeAreaRequest) => updateOfficeArea(payload),
    onSuccess: () => {
      toast.success('更新成功')
      queryClient.invalidateQueries({ queryKey: ['company-office-areas'] })
    },
  })

  const remove = useMutation({
    mutationFn: (id: number) => deleteOfficeArea(id),
    onSuccess: () => {
      toast.success('删除成功')
      queryClient.invalidateQueries({ queryKey: ['company-office-areas'] })
    },
  })

  return { filters, setFilters, list, create, update, remove }
}
