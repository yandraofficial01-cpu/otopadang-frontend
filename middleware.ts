import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// PENTING: GANTI KE DOMAIN PRODUCTION LU
const ALLOWED_ORIGIN = 'https://otopadang-frontend.vercel.app'

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

// Helper buat set CORS
function setCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', ALLOWED_ORIGIN)
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

export function middleware(request: NextRequest) {
  // 1. HANDLE PREFLIGHT REQUEST DULU
  if (request.method === 'OPTIONS') {
    return setCorsHeaders(new NextResponse(null, { status: 200 }))
  }

  const adminToken = request.cookies.get('admin_token')?.value
  const showroomToken = request.cookies.get('showroom_token')?.value
  const pathname = request.nextUrl.pathname

  const adminData = adminToken? decodeJWT(adminToken) : null
  const showroomData = showroomToken? decodeJWT(showroomToken) : null

  let response: NextResponse

  // RULE 1: KALAU MASUK /admin TAPI BAWA TOKEN SHOWROOM -> HAPUS & TENDANG
  if (pathname.startsWith('/admin') && showroomToken) {
    response = NextResponse.redirect(new URL('/login-admin', request.url))
    response.cookies.delete('showroom_token')
    response.cookies.delete('showroom_id')
    return setCorsHeaders(response)
  }

  // RULE 2: KALAU MASUK /dashboard TAPI BAWA TOKEN ADMIN -> HAPUS & TENDANG
  if (pathname.startsWith('/dashboard') && adminToken) {
    response = NextResponse.redirect(new URL('/login-showroom', request.url))
    response.cookies.delete('admin_token')
    return setCorsHeaders(response)
  }

  // RULE 3: PROTEKSI HALAMAN /admin
  if (pathname.startsWith('/admin')) {
    if (!adminToken || adminData?.role!== 'admin') {
      response = NextResponse.redirect(new URL('/login-admin', request.url))
      response.cookies.delete('admin_token')
      return setCorsHeaders(response)
    }
  }

  // RULE 4: PROTEKSI HALAMAN /dashboard
  if (pathname.startsWith('/dashboard')) {
    if (!showroomToken || showroomData?.role!== 'showroom') {
      response = NextResponse.redirect(new URL('/login-showroom', request.url))
      response.cookies.delete('showroom_token')
      response.cookies.delete('showroom_id')
      return setCorsHeaders(response)
    }
  }

  // RULE 5: KALAU UDAH LOGIN JANGAN KE HALAMAN LOGIN LAGI
  if (pathname === '/login-admin' && adminData?.role === 'admin') {
    response = NextResponse.redirect(new URL('/admin', request.url))
    return setCorsHeaders(response)
  }

  if (pathname === '/login-showroom' && showroomData?.role === 'showroom') {
    response = NextResponse.redirect(new URL('/dashboard', request.url))
    return setCorsHeaders(response)
  }

  // DEFAULT: LANJUT + KASIH CORS
  response = NextResponse.next()
  return setCorsHeaders(response)
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/login-admin', '/login-showroom', '/api/:path*'],
}
