'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { listCompanies } from '../api/list-companies'
import { createCompany } from '../api/create-company'
import { updateCompany } from '../api/update-company'
import { deleteCompany } from '../api/delete-company'
import type { CreateCompanyRequest, UpdateCompanyRequest } from '../api/types'

interface Filters {
  name: string
  code: string
  page: number
  pageSize: number
}

const initial: Filters = { name: '', code: '', page: 1, pageSize: 10 }

export function useCompanies() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<Filters>(initial)

  const list = useQuery({
    queryKey: ['admin-companies', filters],
    queryFn: () =>
      listCompanies({
        name: filters.name || undefined,
        code: filters.code || undefined,
        size: filters.pageSize,
        page: filters.page - 1,
        sort: 'id,desc',
      }),
  })

  const create = useMutation({
    mutationFn: (payload: CreateCompanyRequest) => createCompany(payload),
    onSuccess: () => {
      toast.success('创建成功')
      queryClient.invalidateQueries({ queryKey: ['admin-companies'] })
    },
  })

  const update = useMutation({
    mutationFn: (payload: UpdateCompanyRequest) => updateCompany(payload),
    onSuccess: () => {
      toast.success('更新成功')
      queryClient.invalidateQueries({ queryKey: ['admin-companies'] })
    },
  })

  const remove = useMutation({
    mutationFn: (id: number) => deleteCompany(id),
    onSuccess: () => {
      toast.success('删除成功')
      queryClient.invalidateQueries({ queryKey: ['admin-companies'] })
    },
  })

  return {
    filters,
    setFilters,
    reset: () => setFilters(initial),
    list,
    create,
    update,
    remove,
  }
}
