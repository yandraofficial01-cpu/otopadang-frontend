// src/middleware.js
import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('token')?.value
  const pathname = request.nextUrl.pathname

  // 1. Jaga /admin dan /dashboard - harus ada token
  if (!token && (pathname.startsWith('/admin') || pathname.startsWith('/dashboard'))) {
    return NextResponse.redirect(new URL('/login-admin', request.url))
  }

  // 2. Jaga /login-admin dan /login - kalau udah login, lempar ke /admin
  if (token && (pathname === '/login-admin' || pathname === '/login')) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

// route mana aja yg mau dicek middleware
export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/login', '/login-admin'],
}
