import type { Metadata } from 'next'
import { Suspense } from 'react'
import { LoginCard } from '@/features/login/components/login-card'
import { LoginBackground } from '@/features/login/components/login-background'
import { LoginHero } from '@/features/login/components/login-hero'
import { LoginGuard } from '@/permissions/login-guard'

export const metadata: Metadata = {
  title: '登录 · 唯刚资产管理',
}

export default function LoginPage() {
  return (
    <LoginGuard>
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden p-6">
        <LoginBackground />
        <div className="relative z-10 flex w-full flex-col items-center gap-8 lg:max-w-6xl lg:flex-row lg:justify-between">
          <LoginHero />
          <Suspense>
            <LoginCard />
          </Suspense>
        </div>
      </main>
    </LoginGuard>
  )
}
