'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useCurrentCompanyId } from '@/hooks/use-current-company-id'
import { listCompanyMembers } from '../api/list-members'
import type { CompanyMemberQuery } from '../api/types'

const initial = { name: '', mobile: '', page: 1, pageSize: 10 }

export function useMembers() {
  const currentCompanyId = useCurrentCompanyId()
  const [filters, setFilters] = useState(initial)

  const list = useQuery({
    queryKey: ['company-members', currentCompanyId, filters],
    queryFn: () =>
      listCompanyMembers({
        name: filters.name || undefined,
        mobile: filters.mobile || undefined,
        size: filters.pageSize,
        page: filters.page - 1,
        sort: 'id,desc',
      } satisfies CompanyMemberQuery),
  })

  return { filters, setFilters, reset: () => setFilters(initial), list }
}
