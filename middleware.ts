import { NextResponse } from 'next/server'

// Fungsi decode JWT manual tanpa library
function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1] // ambil bagian payload
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

export function middleware(request) {
  const adminToken = request.cookies.get('admin_token')?.value
  const showroomToken = request.cookies.get('showroom_token')?.value
  const pathname = request.nextUrl.pathname

  // 1. PROTEKSI HALAMAN /admin
  if (pathname.startsWith('/admin')) {
    if (!adminToken) {
      return NextResponse.redirect(new URL('/login-admin', request.url))
    }

    const decoded = decodeJWT(adminToken)
    if (!decoded || decoded.role!== 'admin') {
      // kalau token invalid atau rolenya bukan admin
      const response = NextResponse.redirect(new URL('/login-admin', request.url))
      response.cookies.delete('admin_token') // hapus token rusak
      return response
    }
  }

  // 2. PROTEKSI HALAMAN /dashboard
  if (pathname.startsWith('/dashboard')) {
    if (!showroomToken) {
      return NextResponse.redirect(new URL('/login-showroom', request.url))
    }

    const decoded = decodeJWT(showroomToken)
    if (!decoded || decoded.role!== 'showroom') {
      // kalau token invalid atau rolenya bukan showroom
      const response = NextResponse.redirect(new URL('/login-showroom', request.url))
      response.cookies.delete('showroom_token') // hapus token rusak
      return response
    }
  }

  // 3. KALAU UDAH LOGIN JANGAN KE HALAMAN LOGIN LAGI
  if (pathname === '/login-admin' && adminToken) {
    const decoded = decodeJWT(adminToken)
    if (decoded?.role === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }
  
  if (pathname === '/login-showroom' && showroomToken) {
    const decoded = decodeJWT(showroomToken)
    if (decoded?.role === 'showroom') {
      return NextResponse.redirect(new URL('/dashboard/mobil/input', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/login-admin', '/login-showroom'],
}
