import { request } from '@/services/http/request'
import type { ApiResult } from '@/services/http/types'
import type { UpdateAssetSkuRequest } from './types'

export function updateAssetSku(payload: UpdateAssetSkuRequest): Promise<ApiResult<number>> {
  return request.put('/v1/ams/admin/asset-skus', payload)
}
