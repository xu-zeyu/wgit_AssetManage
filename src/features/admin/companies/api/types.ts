export interface Company {
  id: number
  name: string
  code: string
  creditCode?: string | null
  address?: string
  admin?: { id: number; nickname?: string }
  rentPolicy?: { id: number; name?: string }
  icon?: { id: number; url: string } | null
}

export interface CompanyQuery {
  id?: number
  name?: string
  code?: string
  creditCode?: string
  size: number
  page: number
  sort: string | string[]
}

export interface CreateCompanyRequest {
  name?: string
  code?: string
  creditCode?: string | null
  address?: string
  admin?: { id: number | null }
  rentPolicy?: { id: number | null }
  icon?: { id: number | null } | null
}

export interface UpdateCompanyRequest extends CreateCompanyRequest {
  id?: number
}
