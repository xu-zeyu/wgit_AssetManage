import { request } from '@/services/http/request'
import type { ApiResult } from '@/services/http/types'

export interface CompanyInfo {
  id: number
  name: string
  code: string
  creditCode: string
  address: string
  icon?: { id: number; url: string }
  admin: { id: number; username: string; nickname: string }
}

export interface UpdateCompanyInfoRequest {
  id?: number
  name?: string
  creditCode?: string
  address?: string
  icon?: { id?: number }
  admin?: { id: number }
}

export function getCompanyInfo(): Promise<ApiResult<CompanyInfo>> {
  return request.get('/v1/ams/company-admin/company')
}

export function updateCompanyInfo(payload: UpdateCompanyInfoRequest): Promise<ApiResult<number>> {
  return request.put('/v1/ams/company-admin/company', payload)
}

export function transferAdmin(adminId: number): Promise<ApiResult<unknown>> {
  return request.post('/v1/ams/company-admin/company/transfer-admin', { admin: { id: adminId } })
}
