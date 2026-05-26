import { request } from '@/services/http/request'
import type { ApiResult } from '@/services/http/types'
import type { UpdateCompanyRequest } from './types'

export function updateCompany(payload: UpdateCompanyRequest): Promise<ApiResult<number>> {
  return request.put('/v1/ams/admin/companies', payload)
}
