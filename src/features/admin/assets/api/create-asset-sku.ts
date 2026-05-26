import { request } from '@/services/http/request'
import type { ApiResult } from '@/services/http/types'
import type { CreateAssetSkuRequest } from './types'

export function createAssetSku(payload: CreateAssetSkuRequest): Promise<ApiResult<number>> {
  return request.post('/v1/ams/admin/asset-skus', payload)
}
