import { request } from '@/services/http/request'
import type { ApiResult } from '@/services/http/types'
import type { UpdateRentPolicyRequest } from './types'

export function updatePolicy(payload: UpdateRentPolicyRequest): Promise<ApiResult<number>> {
  return request.put('/v1/ams/admin/rent-policies', payload)
}
