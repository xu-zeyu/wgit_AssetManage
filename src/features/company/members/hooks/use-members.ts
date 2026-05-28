'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useCurrentCompanyId } from '@/hooks/use-current-company-id'
import { createCompanyMember } from '../api/create-member'
import { deleteCompanyMember } from '../api/delete-member'
import { listCompanyMembers } from '../api/list-members'
import { updateCompanyMember } from '../api/update-member'
import type { CompanyMemberQuery, CreateMemberRequest, UpdateMemberRequest } from '../api/types'

const initial = { name: '', mobile: '', page: 1, pageSize: 10 }

export function useMembers() {
  const currentCompanyId = useCurrentCompanyId()
  const queryClient = useQueryClient()
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

  const create = useMutation({
    mutationFn: (payload: CreateMemberRequest) => createCompanyMember(payload),
    onSuccess: () => {
      toast.success('创建成功')
      queryClient.invalidateQueries({ queryKey: ['company-members'] })
    },
  })

  const update = useMutation({
    mutationFn: (payload: UpdateMemberRequest) => updateCompanyMember(payload),
    onSuccess: () => {
      toast.success('更新成功')
      queryClient.invalidateQueries({ queryKey: ['company-members'] })
    },
  })

  const remove = useMutation({
    mutationFn: (id: number) => deleteCompanyMember(id),
    onSuccess: () => {
      toast.success('删除成功')
      queryClient.invalidateQueries({ queryKey: ['company-members'] })
    },
  })

  return { filters, setFilters, reset: () => setFilters(initial), list, create, update, remove }
}
