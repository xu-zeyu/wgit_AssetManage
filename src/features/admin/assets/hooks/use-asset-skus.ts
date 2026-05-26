'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { listAssetSkuCategories, listAssetSkus } from '../api/list-asset-skus'
import { createAssetSku } from '../api/create-asset-sku'
import { updateAssetSku } from '../api/update-asset-sku'
import { deleteAssetSku } from '../api/delete-asset-sku'
import type { CreateAssetSkuRequest, UpdateAssetSkuRequest } from '../api/types'

const initial = { name: '', code: '', category: '', spec: '', page: 1, pageSize: 12 }

export function useAssetSkus() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState(initial)

  const list = useQuery({
    queryKey: ['admin-asset-skus', filters],
    queryFn: () =>
      listAssetSkus({
        name: filters.name || undefined,
        code: filters.code || undefined,
        category: filters.category || undefined,
        spec: filters.spec || undefined,
        size: filters.pageSize,
        page: filters.page - 1,
        sort: 'id,desc',
      }),
  })

  const categories = useQuery({
    queryKey: ['admin-asset-skus', 'categories'],
    queryFn: () => listAssetSkuCategories(),
  })

  const create = useMutation({
    mutationFn: (payload: CreateAssetSkuRequest) => createAssetSku(payload),
    onSuccess: () => {
      toast.success('创建成功')
      queryClient.invalidateQueries({ queryKey: ['admin-asset-skus'] })
    },
  })

  const update = useMutation({
    mutationFn: (payload: UpdateAssetSkuRequest) => updateAssetSku(payload),
    onSuccess: () => {
      toast.success('更新成功')
      queryClient.invalidateQueries({ queryKey: ['admin-asset-skus'] })
    },
  })

  const remove = useMutation({
    mutationFn: (id: number) => deleteAssetSku(id),
    onSuccess: () => {
      toast.success('删除成功')
      queryClient.invalidateQueries({ queryKey: ['admin-asset-skus'] })
    },
  })

  return { filters, setFilters, reset: () => setFilters(initial), list, categories, create, update, remove }
}
