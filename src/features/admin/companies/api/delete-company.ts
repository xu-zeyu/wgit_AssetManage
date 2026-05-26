import { request } from '@/services/http/request'
import type { ApiResult } from '@/services/http/types'

export function deleteCompany(id: number): Promise<ApiResult<unknown>> {
  return request.delete(`/v1/ams/admin/companies/${id}`)
}
