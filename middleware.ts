import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Fungsi decode JWT manual buat Edge Runtime
function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8')
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

export function middleware(request: NextRequest) {
  const adminToken = request.cookies.get('admin_token')?.value
  const showroomToken = request.cookies.get('showroom_token')?.value
  const pathname = request.nextUrl.pathname

  const adminData = adminToken? decodeJWT(adminToken) : null
  const showroomData = showroomToken? decodeJWT(showroomToken) : null

  // RULE 1: KALAU MASUK /admin TAPI BAWA TOKEN SHOWROOM -> HAPUS & TENDANG
  if (pathname.startsWith('/admin') && showroomToken) {
    const res = NextResponse.redirect(new URL('/login-admin', request.url))
    res.cookies.delete('showroom_token')
    res.cookies.delete('showroom_id')
    return res
  }

  // RULE 2: KALAU MASUK /dashboard TAPI BAWA TOKEN ADMIN -> HAPUS & TENDANG
  if (pathname.startsWith('/dashboard') && adminToken) {
    const res = NextResponse.redirect(new URL('/login-showroom', request.url))
    res.cookies.delete('admin_token')
    return res
  }

  // RULE 3: PROTEKSI HALAMAN /admin
  if (pathname.startsWith('/admin')) {
    if (!adminToken || adminData?.role!== 'admin') {
      const response = NextResponse.redirect(new URL('/login-admin', request.url))
      response.cookies.delete('admin_token')
      return response
    }
  }

  // RULE 4: PROTEKSI HALAMAN /dashboard
  if (pathname.startsWith('/dashboard')) {
    if (!showroomToken || showroomData?.role!== 'showroom') {
      const response = NextResponse.redirect(new URL('/login-showroom', request.url))
      response.cookies.delete('showroom_token')
      response.cookies.delete('showroom_id')
      return response
    }
  }

  // RULE 5: KALAU UDAH LOGIN JANGAN KE HALAMAN LOGIN LAGI
  if (pathname === '/login-admin' && adminData?.role === 'admin') {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  if (pathname === '/login-showroom' && showroomData?.role === 'showroom') {
    return NextResponse.redirect(new URL('/dashboard/mobil/input', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/login-admin', '/login-showroom'],
}
