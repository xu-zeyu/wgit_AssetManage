import { request } from '@/services/http/request'
import type { PageResponse } from '@/services/http/types'

export interface AdminUser {
  id: number
  username: string
  nickname: string
  phone?: string
  enable: boolean
}

export interface UserQuery {
  id?: number
  username?: string
  enable?: boolean
  size: number
  page: number
  sort: string | string[]
}

export function listUsers(params: UserQuery): Promise<PageResponse<AdminUser>> {
  const query = { ...params }
  if (Array.isArray(query.sort)) (query as any).sort = query.sort.join(',')
  return request.get('/admin/users', { params: query })
}
