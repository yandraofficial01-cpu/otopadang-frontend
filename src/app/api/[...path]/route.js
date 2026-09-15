import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL

async function handler(req, { params }) {
  const cookieStore = cookies()
  const path = params.path.join('/')
  
  // 1. HAPUS 'admin/' DARI PATH KARENA BE LU GAK PAKE
  const realPath = path.replace('admin/', '')
  const url = `${API_URL}/${realPath}`

  // 2. FORWARD COOKIE DENGAN NAMA YANG BENER - FIX MULTI COOKIE
  const adminToken = cookieStore.get('admin_token')?.value
  const showroomToken = cookieStore.get('showroom_token')?.value
  
  const cookieParts = []
  if(adminToken) cookieParts.push(`admin_token=${adminToken}`)
  if(showroomToken) cookieParts.push(`showroom_token=${showroomToken}`)
  const cookieHeader = cookieParts.join('; ') // pake ; biar bisa 2 cookie sekaligus

  const body = req.method !== 'GET' ? await req.text() : undefined

  const res = await fetch(url, {
    method: req.method,
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(cookieHeader && { 'Cookie': cookieHeader }) // cuma kirim kalau ada isinya
    },
    body,
    cache: 'no-store',
    credentials: 'include' // WAJIB BIAR COOKIE NYEBERANG KE BE
  })

  const data = await res.text()

  return new NextResponse(data, {
    status: res.status,
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': 'true'
    }
  })
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE }
