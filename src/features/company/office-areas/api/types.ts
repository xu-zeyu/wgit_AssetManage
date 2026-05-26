export interface OfficeArea {
  id: number
  name: string
  address?: string
  remark?: string
  admin?: { id: number; nickname?: string }
  company?: { id: number }
}

export interface OfficeAreaQuery {
  page: number
  size: number
  sort: string
}

export interface CreateOfficeAreaRequest {
  name: string
  address?: string
  remark?: string
  admin?: { id?: number }
}

export interface UpdateOfficeAreaRequest extends CreateOfficeAreaRequest {
  id: number
}
