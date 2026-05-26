import { request } from '@/services/http/request'
import type { ApiResult, PageResponse } from '@/services/http/types'
import type { ApplicationStatus, AssetApplication, AssetApplicationQuery } from './types'

export function listApplications(params: AssetApplicationQuery): Promise<PageResponse<AssetApplication>> {
  return request.get('/v1/ams/company-admin/assets/apply/audit', { params })
}

export function auditApplication(payload: {
  id: number
  status: ApplicationStatus
  rejectReason?: string
}): Promise<ApiResult<number>> {
  return request.put('/v1/ams/company-admin/assets/apply/audit', payload)
}

export function approveApplication(id: number) {
  return auditApplication({ id, status: 'APPROVED' })
}

export function rejectApplication(id: number, reason: string) {
  return auditApplication({ id, status: 'REJECTED', rejectReason: reason })
}

export function getApplicationCount(): Promise<ApiResult<number>> {
  return request.get('/v1/ams/company-admin/assets/apply/count')
}
