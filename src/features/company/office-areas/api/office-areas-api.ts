import { request } from '@/services/http/request'
import type { ApiResult, PageResponse } from '@/services/http/types'
import type { CreateOfficeAreaRequest, OfficeArea, OfficeAreaQuery, UpdateOfficeAreaRequest } from './types'

export function listOfficeAreas(params: OfficeAreaQuery): Promise<PageResponse<OfficeArea>> {
  return request.get('/v1/ams/company-admin/areas', { params })
}

export function createOfficeArea(payload: CreateOfficeAreaRequest): Promise<ApiResult<number>> {
  return request.post('/v1/ams/company-admin/areas', payload)
}

export function updateOfficeArea(payload: UpdateOfficeAreaRequest): Promise<ApiResult<number>> {
  return request.put('/v1/ams/company-admin/areas', payload)
}

export function deleteOfficeArea(id: number): Promise<ApiResult<unknown>> {
  return request.delete(`/v1/ams/company-admin/areas/${id}`)
}
