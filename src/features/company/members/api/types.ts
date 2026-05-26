export interface CompanyMember {
  id: number
  createdTime?: string
  modifiedTime?: string
  user?: { id: number; username: string; nickname: string }
  name?: string
  mobile?: string
  department?: string | null
  area?: { id: number; name?: string }
  position?: string
}

export interface CompanyMemberQuery {
  username?: string
  name?: string
  mobile?: string
  size: number
  page: number
  sort: string | string[]
}

export interface CreateMemberRequest {
  name: string
  mobile: string
  department?: string | null
  position?: string
  area?: { id?: number }
}

export interface UpdateMemberRequest extends CreateMemberRequest {
  id: number
}
