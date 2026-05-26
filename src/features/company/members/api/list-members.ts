import { request } from '@/services/http/request'
import type { PageResponse } from '@/services/http/types'
import type { CompanyMember, CompanyMemberQuery } from './types'

export function listCompanyMembers(params: CompanyMemberQuery): Promise<PageResponse<CompanyMember>> {
  const query = { ...params }
  if (Array.isArray(query.sort)) (query as any).sort = query.sort.join(',')
  return request.get('/v1/ams/company-admin/members', { params: query })
}
