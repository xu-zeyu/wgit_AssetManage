import { contextBridge, ipcRenderer } from 'electron'

export type ElectronAPI = {
  isElectron: boolean
  platform: NodeJS.Platform
  invoke: (channel: string, ...args: unknown[]) => Promise<unknown>
  on: (channel: string, callback: (...args: unknown[]) => void) => void
}

const electronAPI: ElectronAPI = {
  isElectron: true,
  platform: process.platform,
  invoke: (channel: string, ...args: unknown[]) => ipcRenderer.invoke(channel, ...args),
  on: (channel: string, callback: (...args: unknown[]) => void) => {
    ipcRenderer.on(channel, (_event, ...args) => callback(...args))
  },
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)
