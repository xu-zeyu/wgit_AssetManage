import { request } from '@/services/http/request'
import type { ApiResult, PageResponse } from '@/services/http/types'
import type { CompanyAsset, CompanyAssetQuery } from './types'

export function listCompanyAssets(params: CompanyAssetQuery): Promise<PageResponse<CompanyAsset>> {
  return request.get('/v1/ams/company-admin/assets', { params })
}

export function printCompanyAssets(ids: number[]): Promise<ApiResult<unknown>> {
  return request.post('/v1/ams/company-admin/assets/print', { ids })
}

export function updateAssetRentalUser(id: number, rentalUserId: number): Promise<ApiResult<unknown>> {
  return request.post('/v1/ams/company-admin/assets/change-rental-user', { id, rentalUserId })
}
