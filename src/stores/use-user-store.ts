'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import {
  getUserInfoApi,
  loginApi,
  logoutApi,
  type LoginForm,
  type UserInfo,
} from '@/services/auth/auth-api'
import { listManagedCompanies } from '@/features/company/info/api/managed-companies'
import { useCompanyStore } from './use-company-store'

export type RoleType = 'admin' | 'company' | 'visitor'

interface UserState {
  token: string | null
  refreshTokenValue: string | null
  roles: RoleType[]
  name: string
  userInfo: UserInfo | null
  hydrated: boolean
}

interface UserActions {
  login: (data: LoginForm) => Promise<RoleType | null>
  loginByQrCode: (token: string, refreshToken: string) => Promise<RoleType | null>
  fetchUserInfo: () => Promise<RoleType | null>
  logout: () => Promise<void>
  clear: () => void
  setTokens: (accessToken: string, refreshToken: string) => void
  determineRole: (info: UserInfo) => Promise<RoleType>
  setHydrated: () => void
}

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set, get) => ({
      token: null,
      refreshTokenValue: null,
      roles: [],
      name: '',
      userInfo: null,
      hydrated: false,

      setHydrated() {
        set({ hydrated: true })
      },

      setTokens(accessToken, refreshToken) {
        set({ token: accessToken, refreshTokenValue: refreshToken })
      },

      async determineRole(info) {
        const roleCodes = (info.roles ?? [])
          .map(r => String(r.code || '').trim().toUpperCase())
        if (roleCodes.includes('AMS_ADMIN')) return 'admin'
        try {
          const res = await listManagedCompanies()
          if (res.code === '200' && Array.isArray(res.data) && res.data.length > 0) {
            return 'company'
          }
        } catch {
          /* noop */
        }
        return 'visitor'
      },

      async login(data) {
        const res = await loginApi(data)
        if (res.code !== '200') return null
        const { accessToken, refreshToken } = res.data
        set({ token: accessToken, refreshTokenValue: refreshToken })
        return get().fetchUserInfo()
      },

      async loginByQrCode(token, refreshToken) {
        set({ token, refreshTokenValue: refreshToken })
        return get().fetchUserInfo()
      },

      async fetchUserInfo() {
        const res = await getUserInfoApi()
        if (res.code !== '200') return null
        const role = await get().determineRole(res.data)
        set({
          userInfo: res.data,
          name: res.data.nickname || res.data.username,
          roles: [role],
        })
        if (role === 'company') {
          await useCompanyStore.getState().fetchDefaultCompany()
        }
        return role
      },

      async logout() {
        const refreshToken = get().refreshTokenValue
        try {
          if (refreshToken) await logoutApi({ refreshToken })
        } catch {
          /* noop */
        } finally {
          get().clear()
        }
      },

      clear() {
        set({ token: null, refreshTokenValue: null, roles: [], name: '', userInfo: null })
        useCompanyStore.getState().clear()
      },
    }),
    {
      name: 'ams-user',
      storage: createJSONStorage(() => localStorage),
      // 仅持久化身份相关字段；hydrated 不持久化
      partialize: state => ({
        token: state.token,
        refreshTokenValue: state.refreshTokenValue,
        roles: state.roles,
        name: state.name,
        userInfo: state.userInfo,
      }),
      onRehydrateStorage: () => state => {
        state?.setHydrated()
      },
    },
  ),
)

export function getActiveRole(): RoleType | null {
  const roles = useUserStore.getState().roles
  return roles[0] ?? null
}
