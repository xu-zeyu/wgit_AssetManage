import { request } from '@/services/http/request'
import type { ApiResult } from '@/services/http/types'
import type { UpdateMemberRequest } from './types'

export function updateCompanyMember(payload: UpdateMemberRequest): Promise<ApiResult<number>> {
  return request.put('/v1/ams/company-admin/members', payload)
}
