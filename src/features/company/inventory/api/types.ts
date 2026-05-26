export type InventoryStatus = 'PENDING' | 'INVENTORYING' | 'COMPLETED'

export interface InventoryTask {
  id: number
  inventoryUser: { id: number; name: string }
  area: { id: number; name: string }
  planInventoryDate: string
  status: InventoryStatus
  planInventoryCount: number
  pendingInventoryCount: number
  completedInventoryCount: number
  actualInventoryCount: number
  abnormalInventoryCount: number
}

export interface InventoryTaskQuery {
  status?: InventoryStatus
  page: number
  size: number
  sort: string
}

export const INVENTORY_STATUS_LABEL: Record<InventoryStatus, string> = {
  PENDING: '待开始',
  INVENTORYING: '盘点中',
  COMPLETED: '已完成',
}
