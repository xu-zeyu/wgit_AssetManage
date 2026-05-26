import type { ElectronAPI } from '../../electron/preload'

function getElectronAPI(): ElectronAPI | undefined {
  if (typeof window === 'undefined') return undefined
  return (window as unknown as Record<string, unknown>).electronAPI as ElectronAPI | undefined
}

export function isElectron(): boolean {
  return getElectronAPI()?.isElectron ?? false
}

export function getElectronPlatform(): NodeJS.Platform | null {
  return getElectronAPI()?.platform ?? null
}

export function electronInvoke<T = unknown>(channel: string, ...args: unknown[]): Promise<T> {
  const api = getElectronAPI()
  if (!api) return Promise.reject(new Error('Not running in Electron'))
  return api.invoke(channel, ...args) as Promise<T>
}
