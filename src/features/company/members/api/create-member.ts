import { request } from '@/services/http/request'
import type { ApiResult } from '@/services/http/types'
import type { CreateMemberRequest } from './types'

export function createCompanyMember(payload: CreateMemberRequest): Promise<ApiResult<number>> {
  return request.post('/v1/ams/company-admin/members', payload)
}
