export interface AssetImage {
  id: number
  url: string
}

export interface AssetSku {
  id: number
  createdTime: string
  modifiedTime: string
  code: string
  name: string
  spec: string
  useTarget: string
  category: string
  purchaseChannel?: string | null
  purchaseTime?: string | null
  purchasePrice?: number | null
  afterSale?: string | null
  rentPrice: number
  remark?: string | null
  images: AssetImage[]
  companies: Array<{ id: number; name?: string; code?: string }>
}

export interface AssetSkuQuery {
  id?: number
  code?: string
  name?: string
  spec?: string
  category?: string
  size: number
  page: number
  sort: string | string[]
}

export interface CreateAssetSkuRequest {
  name?: string
  spec?: string
  useTarget?: string
  images?: Array<{ id: number | null }>
  category?: string
  purchaseChannel?: string | null
  purchaseTime?: string | null
  purchasePrice?: number | null
  afterSale?: string | null
  rentPrice?: number
  remark?: string | null
  companies: Array<{ id: number }>
}

export interface UpdateAssetSkuRequest extends CreateAssetSkuRequest {
  id: number
  code: string
}
