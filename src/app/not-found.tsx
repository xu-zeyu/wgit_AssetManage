'use client'

import Link from 'next/link'
import { Compass } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="text-center"
      >
        <div className="mx-auto mb-6 grid size-16 place-items-center rounded-3xl bg-brand-100 text-brand-600">
          <Compass className="size-7" />
        </div>
        <h1 className="text-5xl font-semibold tracking-tight">404</h1>
        <p className="mt-2 text-base text-muted-foreground">页面不存在或已被移动</p>
        <div className="mt-6 flex justify-center gap-2">
          <Button asChild>
            <Link href="/login">返回登录</Link>
          </Button>
        </div>
      </motion.div>
    </main>
  )
}
