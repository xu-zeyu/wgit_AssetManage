'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { toast } from 'sonner'
import { listManagedCompanies, type ManagedCompany } from '@/features/company/info/api/managed-companies'

interface CompanyState {
  current: ManagedCompany | null
  list: ManagedCompany[]
  loaded: boolean
}

interface CompanyActions {
  fetchManaged: () => Promise<ManagedCompany[]>
  loadManaged: (force?: boolean) => Promise<ManagedCompany[]>
  fetchDefaultCompany: () => Promise<void>
  switchCompany: (company: ManagedCompany) => boolean
  getCurrentCompanyId: () => number | null
  clear: () => void
}

export const useCompanyStore = create<CompanyState & CompanyActions>()(
  persist(
    (set, get) => ({
      current: null,
      list: [],
      loaded: false,

      async fetchManaged() {
        const response = await listManagedCompanies()
        if (response.code !== '200') {
          toast.error(response.message || '获取公司列表失败')
          return []
        }
        const data = response.data
        const existsInList = get().current ? data.some(c => c.id === get().current!.id) : false
        set({
          list: data,
          loaded: true,
          current: data.length > 0 ? (existsInList ? get().current : data[0]) : null,
        })
        return data
      },

      async loadManaged(force = false) {
        if (!get().loaded || force) await get().fetchManaged()
        return get().list
      },

      async fetchDefaultCompany() {
        set({ loaded: false })
        try {
          await get().fetchManaged()
        } catch {
          set({
            current: { id: 1, name: '默认公司', code: 'DEFAULT' },
            loaded: true,
          })
        }
      },

      switchCompany(company) {
        if (get().current?.id === company.id) return false
        set({ current: company })
        toast.success(`已切换到 ${company.name}`)
        return true
      },

      getCurrentCompanyId() {
        const inMemory = get().current?.id
        if (inMemory) return inMemory
        // 注水间隙的兜底：直接从 localStorage 读取，避免请求漏掉 Company-Id
        if (typeof window === 'undefined') return null
        try {
          const raw = window.localStorage.getItem('ams-company')
          if (!raw) return null
          const parsed = JSON.parse(raw) as { state?: { current?: ManagedCompany | null } }
          return parsed?.state?.current?.id ?? null
        } catch {
          return null
        }
      },

      clear() {
        set({ current: null, list: [], loaded: false })
      },
    }),
    {
      name: 'ams-company',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ current: state.current }),
    },
  ),
)
