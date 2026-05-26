'use client'

import { useCompanyStore } from '@/stores/use-company-store'

export function useCurrentCompanyId() {
  return useCompanyStore(state => state.current?.id ?? null)
}
