import axios, { AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'
import { toast } from 'sonner'
import { useUserStore } from '@/stores/use-user-store'
import { useCompanyStore } from '@/stores/use-company-store'
import { refreshTokenApi } from '@/services/auth/auth-api'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api'

const PUBLIC_PATHS = ['/v1/auth/sign-in', '/v1/connect/wgit', '/v1/connect/qrcode']

const isPublic = (url: string) => PUBLIC_PATHS.some(p => url.includes(p))

export const request = axios.create({
  baseURL,
  timeout: 15000,
})

let isRefreshing = false
let queue: Array<{ resolve: (v: string) => void; reject: (e: unknown) => void }> = []

function flushQueue(error: unknown, token: string | null) {
  queue.forEach(({ resolve, reject }) => {
    if (error || !token) reject(error)
    else resolve(token)
  })
  queue = []
}

request.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const url = config.url || ''
  const headers = config.headers

  if (!isPublic(url)) {
    const token = useUserStore.getState().token
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }

  if (!isPublic(url) && !url.includes('/auth/')) {
    const companyId = useCompanyStore.getState().getCurrentCompanyId()
    if (companyId) headers.set('Company-Id', String(companyId))
  }

  return config
})

request.interceptors.response.use(
  res => {
    const data = res.data
    if (data && data.code && data.code !== '200') {
      toast.error(data.message || '请求失败')
      return Promise.reject({ isBusinessError: true, data })
    }
    return data
  },
  async (error: AxiosError<{ message?: string }>) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      const user = useUserStore.getState()

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          queue.push({ resolve, reject })
        })
          .then(token => {
            originalRequest.headers.set('Authorization', `Bearer ${token}`)
            return request(originalRequest)
          })
          .catch(err => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = user.refreshTokenValue

      if (!refreshToken) {
        flushQueue(error, null)
        user.clear()
        redirectToLogin()
        isRefreshing = false
        return Promise.reject(error)
      }

      try {
        const response = await refreshTokenApi({ refreshToken })
        if (response.code === '200') {
          const { accessToken, refreshToken: newRefresh } = response.data
          useUserStore.getState().setTokens(accessToken, newRefresh ?? refreshToken)
          originalRequest.headers.set('Authorization', `Bearer ${accessToken}`)
          flushQueue(null, accessToken)
          return request(originalRequest)
        }
        flushQueue(error, null)
        user.clear()
        redirectToLogin()
        return Promise.reject(error)
      } catch (refreshError) {
        flushQueue(refreshError, null)
        user.clear()
        redirectToLogin()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    let message = '网络错误，请稍后重试'
    if (error.response) {
      const status = error.response.status
      const map: Record<number, string> = {
        400: '请求参数错误',
        403: '没有权限访问',
        404: '请求的资源不存在',
        500: '服务器错误',
        502: '网关错误',
        503: '服务不可用',
        504: '网关超时',
      }
      message = error.response.data?.message || map[status] || message
    } else if (error.code === 'ECONNABORTED') {
      message = '请求超时'
    } else if (!error.response) {
      message = '网络连接失败'
    }
    toast.error(message)
    return Promise.reject(error)
  },
)

function redirectToLogin() {
  if (typeof window === 'undefined') return
  if (window.location.pathname === '/login') return
  const redirect = encodeURIComponent(window.location.pathname + window.location.search)
  window.location.href = `/login?redirect=${redirect}`
}

export type { AxiosRequestConfig }
