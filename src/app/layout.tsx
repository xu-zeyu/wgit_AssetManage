import type { Metadata, Viewport } from 'next'
import '@/styles/globals.css'
import { AppProviders } from '@/providers/app-providers'
import { ThemeColorScript } from '@/components/layout/theme-color-script'

export const metadata: Metadata = {
  title: '唯刚资产管理后台',
  description: '现代化资产管理后台 - 资产、租赁、盘点一站式',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F59E0B',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <ThemeColorScript />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
