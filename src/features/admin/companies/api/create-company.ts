import { request } from '@/services/http/request'
import type { ApiResult } from '@/services/http/types'
import type { CreateCompanyRequest } from './types'

export function createCompany(payload: CreateCompanyRequest): Promise<ApiResult<number>> {
  return request.post('/v1/ams/admin/companies', payload)
}
