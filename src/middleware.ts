import { NextResponse, type NextRequest } from 'next/server'

// 仅做轻量级路径级别引导。真实的鉴权/权限判定在客户端 RouteGuard 中执行，
// 因为 token 存放于 localStorage，无法在中间件读取。
const PROTECTED_PREFIXES = ['/admin', '/company']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname === '/') {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
  if (PROTECTED_PREFIXES.some(p => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next()
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|login|403|404).*)'],
}
