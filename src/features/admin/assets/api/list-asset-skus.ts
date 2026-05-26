import { request } from '@/services/http/request'
import type { ApiResult, PageResponse } from '@/services/http/types'
import type { AssetSku, AssetSkuQuery } from './types'

export function listAssetSkus(params: AssetSkuQuery): Promise<PageResponse<AssetSku>> {
  const query = { ...params }
  if (Array.isArray(query.sort)) (query as any).sort = query.sort.join(',')
  return request.get('/v1/ams/admin/asset-skus', { params: query })
}

export function listAssetSkuCategories(): Promise<ApiResult<string[]>> {
  return request.get('/v1/ams/app/asset-sku/categories')
}

export function listSkuAssets(id: number, params: { page: number; size: number; sort?: string }) {
  return request.get(`/v1/ams/admin/asset-skus/${id}/assets`, { params })
}
