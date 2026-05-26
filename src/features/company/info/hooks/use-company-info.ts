'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useCurrentCompanyId } from '@/hooks/use-current-company-id'
import {
  getCompanyInfo,
  transferAdmin,
  updateCompanyInfo,
  type UpdateCompanyInfoRequest,
} from '../api/company-info-api'

export function useCompanyInfo() {
  const currentCompanyId = useCurrentCompanyId()
  const queryClient = useQueryClient()
  const info = useQuery({
    queryKey: ['company-info', currentCompanyId],
    queryFn: () => getCompanyInfo(),
  })

  const update = useMutation({
    mutationFn: (payload: UpdateCompanyInfoRequest) => updateCompanyInfo(payload),
    onSuccess: () => {
      toast.success('公司信息已更新')
      queryClient.invalidateQueries({ queryKey: ['company-info'] })
    },
  })

  const transfer = useMutation({
    mutationFn: (adminId: number) => transferAdmin(adminId),
    onSuccess: () => {
      toast.success('管理员已更换')
      queryClient.invalidateQueries({ queryKey: ['company-info'] })
    },
  })

  return { info, update, transfer }
}
