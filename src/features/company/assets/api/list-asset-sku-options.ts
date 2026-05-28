import { request } from '@/services/http/request'
import type { PageResponse } from '@/services/http/types'
import type { AssetSkuOption, AssetSkuOptionQuery } from './types'

export function listCompanyAssetSkuOptions(params: AssetSkuOptionQuery): Promise<PageResponse<AssetSkuOption>> {
  return request.get('/v1/ams/app/asset-skus', { params })
}
