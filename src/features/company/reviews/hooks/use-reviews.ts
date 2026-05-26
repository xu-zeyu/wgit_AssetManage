'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useCurrentCompanyId } from '@/hooks/use-current-company-id'
import { approveApplication, listApplications, rejectApplication } from '../api/reviews-api'
import type { ApplicationStatus } from '../api/types'

interface Filters {
  status?: ApplicationStatus
  page: number
  pageSize: number
}

const initial: Filters = { status: 'PENDING', page: 1, pageSize: 10 }

export function useReviews() {
  const currentCompanyId = useCurrentCompanyId()
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<Filters>(initial)

  const list = useQuery({
    queryKey: ['company-reviews', currentCompanyId, filters],
    queryFn: () =>
      listApplications({
        status: filters.status,
        size: filters.pageSize,
        page: filters.page - 1,
        sort: 'id,desc',
      }),
  })

  const approve = useMutation({
    mutationFn: (id: number) => approveApplication(id),
    onSuccess: () => {
      toast.success('已通过审核')
      queryClient.invalidateQueries({ queryKey: ['company-reviews'] })
    },
  })

  const reject = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) => rejectApplication(id, reason),
    onSuccess: () => {
      toast.success('已拒绝该申请')
      queryClient.invalidateQueries({ queryKey: ['company-reviews'] })
    },
  })

  return { filters, setFilters, list, approve, reject }
}
