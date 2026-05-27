'use client'

import { useState, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { TokenLifecycle } from './token-lifecycle'
import { ThemeColorProvider } from './theme-color-provider'

type Props = { children: ReactNode }

export function AppProviders({ children }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  )

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <ThemeColorProvider>
        <QueryClientProvider client={queryClient}>
          <TokenLifecycle />
          {children}
          <Toaster
            position="top-center"
            richColors
            closeButton
            toastOptions={{
              classNames: {
                toast: 'rounded-2xl border bg-card text-foreground shadow-md',
              },
            }}
          />
        </QueryClientProvider>
      </ThemeColorProvider>
    </ThemeProvider>
  )
}
