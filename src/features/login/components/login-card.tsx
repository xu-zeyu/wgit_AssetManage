'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ScanLine, KeyRound } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PasswordForm } from './password-form'
import { QrForm } from './qr-form'

export function LoginCard() {
  const [tab, setTab] = useState<'qr' | 'password'>('qr')

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="w-full max-w-md"
    >
      <Card className="border-brand-100/40 bg-card/95 backdrop-blur-xl">
        <CardContent className="p-8">
          <div className="mb-6 space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-brand-500">
              <span className="inline-block h-2 w-2 rounded-full bg-brand-400" />
              唯刚资产管理
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">欢迎回来</h1>
            <p className="text-sm text-muted-foreground">登录后开启资产、租赁、盘点的现代化管理</p>
          </div>

          <Tabs value={tab} onValueChange={v => setTab(v as 'qr' | 'password')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="qr">
                <ScanLine className="size-4" />
                扫码登录
              </TabsTrigger>
              <TabsTrigger value="password">
                <KeyRound className="size-4" />
                账号密码
              </TabsTrigger>
            </TabsList>
            <TabsContent value="qr" className="pt-6">
              <QrForm active={tab === 'qr'} />
            </TabsContent>
            <TabsContent value="password" className="pt-6">
              <PasswordForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} 唯刚资产管理 · 现代化 SaaS 后台
      </p>
    </motion.div>
  )
}
