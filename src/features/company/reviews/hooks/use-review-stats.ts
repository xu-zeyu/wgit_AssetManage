'use client'

import { useQueries } from '@tanstack/react-query'
import { useCurrentCompanyId } from '@/hooks/use-current-company-id'
import { listApplications } from '../api/reviews-api'
import type { ApplicationStatus } from '../api/types'

const KEYS: ApplicationStatus[] = ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED']

export function useReviewStats() {
  const currentCompanyId = useCurrentCompanyId()
  const queries = useQueries({
    queries: KEYS.map(status => ({
      queryKey: ['company-review-stats', currentCompanyId, status],
      queryFn: () => listApplications({ status, page: 0, size: 1, sort: 'id,desc' }),
    })),
  })

  const loading = queries.some(q => q.isLoading)
  const stats = KEYS.reduce<Record<ApplicationStatus, number>>(
    (acc, key, idx) => ({ ...acc, [key]: queries[idx].data?.data.totalElements ?? 0 }),
    {} as Record<ApplicationStatus, number>,
  )
  return { stats, loading }
}
