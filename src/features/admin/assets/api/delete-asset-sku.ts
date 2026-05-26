import { request } from '@/services/http/request'
import type { ApiResult } from '@/services/http/types'

export function deleteAssetSku(id: number): Promise<ApiResult<unknown>> {
  return request.delete(`/v1/ams/admin/asset-skus/${id}`)
}
