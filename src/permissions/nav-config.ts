import type { LucideIcon } from 'lucide-react'
import { Box, ClipboardCheck, ClipboardList, Building2, FileBadge, LayoutDashboard, MapPin, Users } from 'lucide-react'
import type { AppRole } from './roles'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  badgeKey?: 'Rentals' | 'CompanyReviews' | 'Asset'
}

export interface NavSection {
  label: string
  items: NavItem[]
}

export const ADMIN_NAV: NavSection[] = [
  {
    label: '运营',
    items: [
      { label: '总览', href: '/admin', icon: LayoutDashboard },
      { label: '资产列表', href: '/admin/assets', icon: Box },
      { label: '资产租赁', href: '/admin/rentals', icon: ClipboardList, badgeKey: 'Rentals' },
      { label: '公司管理', href: '/admin/companies', icon: Building2 },
      { label: '租金政策', href: '/admin/policies', icon: FileBadge },
    ],
  },
]

export const COMPANY_NAV: NavSection[] = [
  {
    label: '公司管理',
    items: [
      { label: '总览', href: '/company', icon: LayoutDashboard },
      { label: '公司信息', href: '/company/company-info', icon: Building2 },
      { label: '成员管理', href: '/company/members', icon: Users },
      { label: '办公区域', href: '/company/office-area', icon: MapPin },
    ],
  },
  {
    label: '资产管理',
    items: [
      { label: '资产列表', href: '/company/assets', icon: Box },
      { label: '盘点任务', href: '/company/inventory', icon: ClipboardList },
      { label: '资产审核', href: '/company/reviews', icon: ClipboardCheck, badgeKey: 'CompanyReviews' },
    ],
  },
]

export function navForRole(role: AppRole): NavSection[] {
  if (role === 'admin') return ADMIN_NAV
  if (role === 'company') return COMPANY_NAV
  return []
}
