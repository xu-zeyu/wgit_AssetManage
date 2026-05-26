import { useUserStore } from '@/stores/use-user-store'
import { refreshTokenApi } from './auth-api'

const REFRESH_INTERVAL = 4 * 60 * 1000

let timer: ReturnType<typeof setInterval> | null = null

async function tick() {
  const { token, refreshTokenValue, setTokens, clear } = useUserStore.getState()
  if (!token || !refreshTokenValue) return
  try {
    const res = await refreshTokenApi({ refreshToken: refreshTokenValue })
    if (res.code === '200') {
      setTokens(res.data.accessToken, res.data.refreshToken ?? refreshTokenValue)
    }
  } catch {
    clear()
  }
}

export function startTokenManager() {
  if (typeof window === 'undefined') return
  if (timer) return
  timer = setInterval(tick, REFRESH_INTERVAL)
}

export function stopTokenManager() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}
