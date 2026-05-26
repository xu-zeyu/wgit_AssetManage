export type ApplicationStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'PENDING_DEPLOY'
  | 'PENDING_RECEIVE'
  | 'REJECTED'
  | 'COMPLETED'

export interface AssetApplication {
  id: number
  createdTime: string
  modifiedTime: string
  applyTime: string
  auditTime?: string
  rejectReason?: string
  status: ApplicationStatus
  assetSku: { id: number; name: string }
  rentalUser: {
    id: number
    name: string
    mobile: string
    department: string
    area: { id: number; name: string }
    user: { id: number; username: string; nickname: string }
  }
}

export interface AssetApplicationQuery {
  id?: string[]
  status?: ApplicationStatus
  size: number
  page: number
  sort: string
}

export const APPLICATION_STATUS_LABEL: Record<ApplicationStatus, string> = {
  PENDING: '待审核',
  APPROVED: '已通过',
  PENDING_DEPLOY: '待安装',
  PENDING_RECEIVE: '待确认',
  REJECTED: '已拒绝',
  COMPLETED: '已完成',
}
