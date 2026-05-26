import { app, BrowserWindow, shell } from 'electron'
import { join } from 'path'
import { spawn, ChildProcess } from 'child_process'
import http from 'http'

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

let mainWindow: BrowserWindow | null = null
let serverProcess: ChildProcess | null = null

function createWindow(loadUrl: string) {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: '唯刚资产管理后台',
    backgroundColor: '#fafaf8',
    show: false,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  mainWindow.loadURL(loadUrl)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function getNextServerPort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = http.createServer()
    server.listen(0, () => {
      const address = server.address()
      if (address && typeof address !== 'string') {
        const port = address.port
        server.close(() => resolve(port))
      } else {
        reject(new Error('Failed to get port'))
      }
    })
  })
}

async function startProd() {
  const port = await getNextServerPort()

  const serverPath = join(process.resourcesPath, 'standalone', 'server.js')
  // Fallback for unpackaged dev-prod testing
  const fallbackPath = join(__dirname, '..', '.next', 'standalone', 'server.js')

  const entryPath = require('fs').existsSync(serverPath) ? serverPath : fallbackPath

  serverProcess = spawn(process.execPath, [entryPath], {
    env: { ...process.env, PORT: String(port), HOSTNAME: '127.0.0.1' },
    stdio: 'pipe',
  })

  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Server start timeout')), 15000)
    serverProcess?.stdout?.on('data', (data: Buffer) => {
      if (data.toString().includes('started')) {
        clearTimeout(timeout)
        resolve()
      }
    })
    serverProcess?.on('error', (err) => {
      clearTimeout(timeout)
      reject(err)
    })
  })

  return `http://127.0.0.1:${port}`
}

app.whenReady().then(async () => {
  if (isDev) {
    createWindow('http://localhost:5176')
  } else {
    try {
      const url = await startProd()
      createWindow(url)
    } catch (err) {
      console.error('Failed to start production server:', err)
      app.quit()
    }
  }
})

app.on('window-all-closed', () => {
  serverProcess?.kill()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    if (isDev) {
      createWindow('http://localhost:5176')
    } else {
      startProd().then(createWindow).catch((err) => {
        console.error('Failed to restart server:', err)
        app.quit()
      })
    }
  }
})

app.on('before-quit', () => {
  serverProcess?.kill()
})
