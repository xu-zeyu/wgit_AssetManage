import { request } from '@/services/http/request'
import type { ApiResult } from '@/services/http/types'

export function deployAsset(id: number, assetCode: string, assetImageId: number): Promise<ApiResult<unknown>> {
  return request.post(`/v1/ams/admin/asset/rental-orders/${id}/deploy`, { assetCode, assetImageId })
}

export function repairAsset(id: number, remark?: string): Promise<ApiResult<unknown>> {
  return request.post(`/v1/ams/admin/asset/rental-orders/${id}/repair`, { remark })
}

export function returnAsset(id: number, remark?: string): Promise<ApiResult<unknown>> {
  return request.post(`/v1/ams/admin/asset/rental-orders/${id}/return`, { remark })
}
