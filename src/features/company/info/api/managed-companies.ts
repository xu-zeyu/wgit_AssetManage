import { request } from '@/services/http/request'
import type { ApiResult } from '@/services/http/types'

export interface ManagedCompany {
  id: number
  name: string
  code: string
  icon?: { id: number; url: string }
}

export function listManagedCompanies(): Promise<ApiResult<ManagedCompany[]>> {
  return request.get('/v1/ams/company-admin/companies')
}
