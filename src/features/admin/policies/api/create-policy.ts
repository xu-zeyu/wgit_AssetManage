import { request } from '@/services/http/request'
import type { ApiResult } from '@/services/http/types'
import type { CreateRentPolicyRequest } from './types'

export function createPolicy(payload: CreateRentPolicyRequest): Promise<ApiResult<number>> {
  return request.post('/v1/ams/admin/rent-policies', payload)
}
