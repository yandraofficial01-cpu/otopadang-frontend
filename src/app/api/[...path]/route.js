import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL

async function handler(req, { params }) {
  const token = cookies().get('admin_token')?.value || cookies().get('showroom_token')?.value
  const path = params.path.join('/') 
  const url = `${API_URL}/${path}`
  
  const headers = { 'Content-Type': 'application/json' }
  if (token) {
    headers['Authorization'] = `Bearer ${token}` // otomatis tempelin token
  }

  // ambil body kalau bukan GET
  const body = req.method !== 'GET' ? await req.text() : undefined

  const res = await fetch(url, {
    method: req.method,
    headers,
    body,
    cache: 'no-store'
  })

  const data = await res.text() // pake .text() biar kalau error 500 kebaca

  return new NextResponse(data, { 
    status: res.status,
    headers: { 'Content-Type': 'application/json' }
  })
}

// export semua method
export { handler as GET, handler as POST, handler as PUT, handler as DELETE }
