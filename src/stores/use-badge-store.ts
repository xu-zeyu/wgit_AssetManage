'use client'

import { create } from 'zustand'
import { getRentalCount } from '@/features/admin/rentals/api/list-rentals'
import { getApplicationCount } from '@/features/company/reviews/api/reviews-api'
import { useUserStore } from './use-user-store'

interface BadgeCount {
  Rentals: number
  CompanyReviews: number
  Asset: number
}

interface BadgeState {
  count: BadgeCount
  isLoading: boolean
}

interface BadgeActions {
  fetch: () => Promise<void>
  startPolling: () => void
  stopPolling: () => void
  refresh: () => void
  getCount: (key: keyof BadgeCount) => number
}

let timer: ReturnType<typeof setInterval> | null = null

export const useBadgeStore = create<BadgeState & BadgeActions>()((set, get) => ({
  count: { Rentals: 0, CompanyReviews: 0, Asset: 0 },
  isLoading: false,

  async fetch() {
    const roles = useUserStore.getState().roles
    set({ isLoading: true })
    try {
      if (roles.includes('admin')) {
        const r = await getRentalCount()
        if (r.code === '200') set({ count: { ...get().count, Rentals: Number(r.data) || 0 } })
      } else if (roles.includes('company')) {
        const r = await getApplicationCount()
        if (r.code === '200') {
          const n = Number(r.data) || 0
          set({ count: { ...get().count, CompanyReviews: n, Asset: n } })
        }
      }
    } catch {
      /* noop */
    } finally {
      set({ isLoading: false })
    }
  },

  startPolling() {
    if (timer) clearInterval(timer)
    void get().fetch()
    timer = setInterval(() => void get().fetch(), 4000)
  },

  stopPolling() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  },

  refresh() {
    void get().fetch()
  },

  getCount(key) {
    return get().count[key] || 0
  },
}))
