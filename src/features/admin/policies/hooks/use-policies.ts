'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { listPolicies } from '../api/list-policies'
import { createPolicy } from '../api/create-policy'
import { updatePolicy } from '../api/update-policy'
import { deletePolicy } from '../api/delete-policy'
import type { CreateRentPolicyRequest, UpdateRentPolicyRequest } from '../api/types'

const initial = { name: '', page: 1, pageSize: 10 }

export function usePolicies() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState(initial)

  const list = useQuery({
    queryKey: ['admin-policies', filters],
    queryFn: () =>
      listPolicies({
        name: filters.name || undefined,
        size: filters.pageSize,
        page: filters.page - 1,
        sort: 'id,desc',
      }),
  })

  const create = useMutation({
    mutationFn: (payload: CreateRentPolicyRequest) => createPolicy(payload),
    onSuccess: () => {
      toast.success('创建成功')
      queryClient.invalidateQueries({ queryKey: ['admin-policies'] })
    },
  })

  const update = useMutation({
    mutationFn: (payload: UpdateRentPolicyRequest) => updatePolicy(payload),
    onSuccess: () => {
      toast.success('更新成功')
      queryClient.invalidateQueries({ queryKey: ['admin-policies'] })
    },
  })

  const remove = useMutation({
    mutationFn: (id: number) => deletePolicy(id),
    onSuccess: () => {
      toast.success('删除成功')
      queryClient.invalidateQueries({ queryKey: ['admin-policies'] })
    },
  })

  return { filters, setFilters, reset: () => setFilters(initial), list, create, update, remove }
}
