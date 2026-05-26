import { request } from '@/services/http/request'
import type { PageResponse } from '@/services/http/types'
import type { Company, CompanyQuery } from './types'

export function listCompanies(params: CompanyQuery): Promise<PageResponse<Company>> {
  const query = { ...params }
  if (Array.isArray(query.sort)) (query as any).sort = query.sort.join(',')
  return request.get('/v1/ams/admin/companies', { params: query })
}
