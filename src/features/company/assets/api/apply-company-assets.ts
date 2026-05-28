import { request } from '@/services/http/request'
import type { ApiResult } from '@/services/http/types'
import type { ApplyCompanyAssetsRequest, ApplyCompanyAssetResult } from './types'

export function applyCompanyAssets(payload: ApplyCompanyAssetsRequest): Promise<ApiResult<ApplyCompanyAssetResult[]>> {
  return request.post('/v2/ams/company-admin/assets/apply', payload)
}
