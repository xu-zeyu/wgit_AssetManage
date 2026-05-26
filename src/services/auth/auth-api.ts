import { request } from '@/services/http/request'
import type { ApiResult } from '@/services/http/types'

export interface LoginForm {
  username: string
  password: string
}

export interface TokenPayload {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number | null
}

export type LoginResponse = ApiResult<TokenPayload>
export type RefreshTokenResponse = ApiResult<TokenPayload>

export interface UserInfo {
  id: number
  createdTime?: string
  modifiedTime?: string
  username: string
  nickname: string
  phone?: string
  description?: string
  enable: boolean
  profile?: { passwordReset: boolean }
  tenants?: Array<{ id: number; name: string }>
  roles: Array<{
    id: number
    code: string
    name: string
    permissions?: Array<{ id: number; code: string; name: string }>
  }>
}

export type UserInfoResponse = ApiResult<UserInfo>

export function loginApi(data: LoginForm): Promise<LoginResponse> {
  return request.post('/v1/auth/sign-in', data)
}

export function logoutApi(data?: { refreshToken?: string }): Promise<ApiResult<unknown>> {
  return request.post('/v1/auth/sign-out', data)
}

export function refreshTokenApi(data: { refreshToken: string }): Promise<RefreshTokenResponse> {
  return request.post('/v1/auth/refresh', data)
}

export function getUserInfoApi(): Promise<UserInfoResponse> {
  return request.get('/users/me')
}

export function createQrSessionApi(): Promise<ApiResult<{ qrcodeId: string }>> {
  return request.post('/v1/connect/qrcode/session', { clientId: 'ams' })
}

export function checkQrStatusApi(
  qrcodeId: string,
): Promise<ApiResult<{ status: 'PENDING' | 'SCANNED' | 'CONFIRMED' | 'EXPIRED'; code?: string }>> {
  return request.get(`/v1/connect/qrcode/status/${qrcodeId}`)
}

export function getTokenByCodeApi(code: string): Promise<LoginResponse> {
  return request.post('/v1/connect/wgit', { code })
}
