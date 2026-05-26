import type { NextConfig } from 'next'

const trimTrailingSlash = (value: string) => value.replace(/\/$/, '')

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '/api'
const authProxyTarget = trimTrailingSlash(
  process.env.AUTH_PROXY_TARGET || 'https://auth-api-test.wgit123.com',
)
const apiProxyTarget = trimTrailingSlash(
  process.env.API_PROXY_TARGET || 'http://ams-api-test.wgit123.com',
)
const useProxy = baseUrl.startsWith('/')

const config: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
  async rewrites() {
    if (!useProxy) return []
    return [
      {
        source: '/api/v1/connect/qrcode/:path*',
        destination: `${authProxyTarget}/v1/connect/qrcode/:path*`,
      },
      {
        source: '/api/oauth2/:path*',
        destination: `${authProxyTarget}/oauth2/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${apiProxyTarget}/:path*`,
      },
    ]
  },
}

export default config
