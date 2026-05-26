export interface RentPolicy {
  id: number
  name: string
  discount: number
}

export interface RentPolicyQuery {
  id?: number
  name?: string
  size: number
  page: number
  sort: string | string[]
}

export interface CreateRentPolicyRequest {
  name: string
  discount: number
}

export interface UpdateRentPolicyRequest extends CreateRentPolicyRequest {
  id: number
}
