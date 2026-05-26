'use client'

import { useEffect } from 'react'
import { startTokenManager, stopTokenManager } from '@/services/auth/token-manager'

export function TokenLifecycle() {
  useEffect(() => {
    startTokenManager()
    return () => stopTokenManager()
  }, [])
  return null
}
