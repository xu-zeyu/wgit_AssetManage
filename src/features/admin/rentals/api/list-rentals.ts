import { request } from '@/services/http/request'
import type { ApiResult, PageResponse } from '@/services/http/types'
import type { AssetRentalOrder, RentalOrderQuery } from './types'

export function listRentals(params: RentalOrderQuery): Promise<PageResponse<AssetRentalOrder>> {
  const query = { ...params }
  if (Array.isArray(query.sort)) (query as any).sort = query.sort.join(',')
  return request.get('/v1/ams/admin/asset/rental-orders', { params: query })
}

export function getRentalDetails(id: number): Promise<ApiResult<AssetRentalOrder>> {
  return request.get(`/v1/ams/admin/asset/rental-orders/${id}`)
}

export function getRentalCount(): Promise<ApiResult<number>> {
  return request.get('/v1/ams/admin/asset/rental-orders/count')
}
