import { NextResponse } from 'next/server'
import { jwtDecode } from 'jwt-decode' // npm i jwt-decode

export function middleware(request) {
  const token = request.cookies.get('token')?.value
  const pathname = request.nextUrl.pathname

  // 1. Kalau akses /admin atau /dashboard harus login
  if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login-admin', request.url))
    }

    try {
      const decoded: any = jwtDecode(token)
      const role = decoded.role

      // 2. Pisah akses berdasarkan role
      if (pathname.startsWith('/admin') && role !== 'admin') {
        return NextResponse.redirect(new URL('/login-admin', request.url))
      }
      
      if (pathname.startsWith('/dashboard') && role !== 'showroom') {
        return NextResponse.redirect(new URL('/login-showroom', request.url))
      }

    } catch {
      return NextResponse.redirect(new URL('/login-admin', request.url))
    }
  }

  // 3. Kalau udah login jangan ke halaman login lagi
  if (token && (pathname === '/login-admin' || pathname === '/login-showroom')) {
    const decoded: any = jwtDecode(token)
    if (decoded.role === 'admin') return NextResponse.redirect(new URL('/admin', request.url))
    if (decoded.role === 'showroom') return NextResponse.redirect(new URL('/dashboard/mobil/input', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/login', '/login-admin', '/login-showroom'],
}
