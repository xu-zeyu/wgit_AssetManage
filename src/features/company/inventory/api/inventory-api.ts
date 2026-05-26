import { request } from '@/services/http/request'
import type { ApiResult, PageResponse } from '@/services/http/types'
import type { InventoryTask, InventoryTaskQuery } from './types'

export function listInventoryTasks(params: InventoryTaskQuery): Promise<PageResponse<InventoryTask>> {
  return request.get('/v1/ams/company-admin/inventory-tasks', { params })
}

export function createInventoryTask(payload: {
  areaId?: number
  planInventoryDate?: string
}): Promise<ApiResult<number>> {
  return request.post('/v1/ams/company-admin/inventory-tasks', payload)
}
