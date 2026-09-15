import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL

async function handler(req, { params }) {
  const cookieStore = cookies()
  const path = params.path.join('/')
  
  // 1. HAPUS 'admin/' DARI PATH KARENA BE LU GAK PAKE
  const realPath = path.replace('admin/', '')
  const url = `${API_URL}/${realPath}`

  // 2. FORWARD COOKIE DENGAN NAMA YANG BENER
  const adminToken = cookieStore.get('admin_token')?.value
  const showroomToken = cookieStore.get('showroom_token')?.value
  
  let cookieHeader = ''
  if(adminToken) cookieHeader = `admin_token=${adminToken}`
  if(showroomToken) cookieHeader = `showroom_token=${showroomToken}`

  const body = req.method !== 'GET' ? await req.text() : undefined

  const res = await fetch(url, {
    method: req.method,
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cookie': cookieHeader // kirim nama yg bener
    },
    body,
    cache: 'no-store',
    credentials: 'include' // <-- INI WAJIB TAMBAH. BIAR COOKIE KE-BE
  })

  const data = await res.text()

  return new NextResponse(data, {
    status: res.status,
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': 'true' // bonus biar aman
    }
  })
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE }
