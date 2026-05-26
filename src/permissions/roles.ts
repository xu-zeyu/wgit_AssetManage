export type AppRole = 'admin' | 'company' | 'visitor'

export const ROLE_HOME: Record<Exclude<AppRole, 'visitor'>, string> = {
  admin: '/admin/assets',
  company: '/company/company-info',
}

export const ADMIN_PREFIX = '/admin'
export const COMPANY_PREFIX = '/company'

export function isAdminPath(pathname: string) {
  return pathname === ADMIN_PREFIX || pathname.startsWith(`${ADMIN_PREFIX}/`)
}

export function isCompanyPath(pathname: string) {
  return pathname === COMPANY_PREFIX || pathname.startsWith(`${COMPANY_PREFIX}/`)
}

export function homeForRole(role: AppRole): string {
  if (role === 'admin') return ROLE_HOME.admin
  if (role === 'company') return ROLE_HOME.company
  return '/login'
}
