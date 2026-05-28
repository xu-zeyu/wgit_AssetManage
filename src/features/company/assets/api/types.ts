export type CompanyAssetStatus = 'PREPARING' | 'USING' | 'RETURNED'
export type CompanyAssetRentalStatus = 'PENDING_DEPLOY' | 'PENDING_RECEIVE' | 'COMPLETED' | 'CANCELLED' | 'RENTING' | 'REPAIR_APPLYING' | 'RETURN_APPLYING' | 'RETURNED'

export interface CompanyAsset {
  id: number
  images: Array<{ id: number; url: string }>
  printCount?: number
  remark: string
  status: CompanyAssetStatus
  assetId: number
  assetCode: string
  assetAssetSkuName: string
  assetAssetSkuSpec: string
  assetAssetSkuCategory: string
  rentalOrderStatus: CompanyAssetRentalStatus
  rentalUserName: string
  rentalUserMobile: string
  rentalUserDepartment: string
  rentalUserRentalUserAreaId: number
  rentalUserRentalUserAreaName: string
}

export interface AssetSkuOption {
  id: number
  name: string
  spec?: string
}

export interface CompanyAssetQuery {
  status?: CompanyAssetStatus
  skuCategory?: string
  areaName?: string
  size: number
  page: number
  sort: string
}

export interface AssetSkuOptionQuery {
  name?: string
  page: number
  size: number
  sort: string
}

export interface ApplyCompanyAssetsRequest {
  applyAssets: Array<{ assetSkuId: number; quantity: number }>
  userIds: number[]
}

export interface ApplyCompanyAssetResult {
  success: boolean
  userId: number
  auditRecordId?: number
  reason?: string
}

export const COMPANY_ASSET_STATUS: Array<{ label: string; value: CompanyAssetStatus }> = [
  { label: '准备中', value: 'PREPARING' },
  { label: '使用中', value: 'USING' },
  { label: '已退还', value: 'RETURNED' },
]
