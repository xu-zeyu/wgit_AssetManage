import { request } from '@/services/http/request'
import type { ApiResult, PageResponse } from '@/services/http/types'
import type { RentPolicy, RentPolicyQuery } from './types'

export function listPolicies(params: RentPolicyQuery): Promise<PageResponse<RentPolicy>> {
  const query = { ...params }
  if (Array.isArray(query.sort)) (query as any).sort = query.sort.join(',')
  return request.get('/v1/ams/admin/rent-policies', { params: query })
}

export function listPolicyOptions(name?: string): Promise<ApiResult<RentPolicy[]>> {
  return request
    .get<PageResponse<RentPolicy>>('/v1/ams/admin/rent-policies', {
      params: { size: 100, page: 0, sort: 'id,asc', ...(name ? { name } : {}) },
    })
    .then(response => {
      const r = response as unknown as PageResponse<RentPolicy>
      return { code: r.code, message: r.message, data: r.data.content }
    })
}
