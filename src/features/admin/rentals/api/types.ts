export type RentalStatus =
  | 'PENDING_DEPLOY'
  | 'PENDING_RECEIVE'
  | 'RENTING'
  | 'REPAIR_APPLYING'
  | 'RETURN_APPLYING'
  | 'RETURNED'

export type ActionType =
  | 'RECEIVE'
  | 'USE'
  | 'REPAIR_APPLY'
  | 'REPAIR'
  | 'COMPENSATE'
  | 'RETURN_APPLY'
  | 'RETURN'

export interface RentalUser {
  id: number
  name: string
  mobile: string
  department: string | null
}

export interface RentalAssetSku {
  id: number
  name: string
  spec: string
}

export interface RentalCompany {
  id: number
  name: string
  code?: string
}

export interface ActionOperator {
  id: number
  nickname?: string
  username?: string
}

export interface ActionRecord {
  id?: number
  actionType: ActionType
  createdTime: string
  modifiedTime?: string
  operator: ActionOperator
  rentalOrder?: { id: number }
  data?: string
}

export interface AssetRentalOrder {
  id: number
  rentalPrice: number
  rentalStartTime: string | null
  rentalEndTime: string | null
  status: RentalStatus
  remark: string | null
  rentalUser: RentalUser
  assetSku: RentalAssetSku
  company?: RentalCompany
  asset?: { id: number; code: string; actionRecords: ActionRecord[] }
}

export interface RentalOrderQuery {
  status?: RentalStatus
  size: number
  page: number
  sort: string | string[]
}

export const RENTAL_STATUS_OPTIONS: Array<{ label: string; value: RentalStatus }> = [
  { label: '待安装', value: 'PENDING_DEPLOY' },
  { label: '待确认收', value: 'PENDING_RECEIVE' },
  { label: '租用中', value: 'RENTING' },
  { label: '维修申请中', value: 'REPAIR_APPLYING' },
  { label: '退租申请中', value: 'RETURN_APPLYING' },
  { label: '退租完成', value: 'RETURNED' },
]

export function getStatusLabel(status: RentalStatus) {
  return RENTAL_STATUS_OPTIONS.find(o => o.value === status)?.label ?? status
}

export function getStatusColor(status: RentalStatus) {
  const map: Record<RentalStatus, 'destructive' | 'warning' | 'success' | 'info' | 'secondary'> = {
    PENDING_DEPLOY: 'destructive',
    PENDING_RECEIVE: 'warning',
    RENTING: 'success',
    REPAIR_APPLYING: 'info',
    RETURN_APPLYING: 'info',
    RETURNED: 'secondary',
  }
  return map[status] || 'secondary'
}

const ACTION_TYPE_MAP: Record<ActionType, { label: string; color: string }> = {
  RECEIVE: { label: '确收', color: '#22c55e' },
  USE: { label: '使用', color: '#3b82f6' },
  REPAIR_APPLY: { label: '维修申请', color: '#f59e0b' },
  REPAIR: { label: '维修', color: '#f59e0b' },
  COMPENSATE: { label: '赔偿', color: '#ef4444' },
  RETURN_APPLY: { label: '退租申请', color: '#6b7280' },
  RETURN: { label: '退租', color: '#6b7280' },
}

export function getActionLabel(type: ActionType) {
  return ACTION_TYPE_MAP[type]?.label ?? type
}

export function getActionColor(type: ActionType) {
  return ACTION_TYPE_MAP[type]?.color ?? '#6b7280'
}
