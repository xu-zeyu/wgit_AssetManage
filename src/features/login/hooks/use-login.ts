'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { useUserStore } from '@/stores/use-user-store'
import { homeForRole } from '@/permissions/roles'
import type { LoginFormValues } from '../schemas/login-schema'

export function useLogin() {
  const router = useRouter()
  const params = useSearchParams()
  const login = useUserStore(s => s.login)
  const [submitting, setSubmitting] = useState(false)

  async function submit(values: LoginFormValues) {
    setSubmitting(true)
    try {
      const role = await login(values)
      if (!role) {
        toast.error('登录失败，请检查账号或密码')
        return
      }
      if (role === 'visitor') {
        toast.error('当前账号没有访问权限')
        return
      }
      toast.success('登录成功')
      const redirect = params.get('redirect')
      router.replace(redirect && redirect !== '/' ? redirect : homeForRole(role))
    } catch {
      toast.error('登录失败，请稍后重试')
    } finally {
      setSubmitting(false)
    }
  }

  return { submit, submitting }
}
