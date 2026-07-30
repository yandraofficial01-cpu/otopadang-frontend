// src/middleware.js
import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('token')?.value

  // Semua route yg mulai /dashboard harus ada token
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Kalau udah login tapi mau ke /login lagi, lempar ke dashboard
  if (token && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// route mana aja yg mau dicek middleware
export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}
