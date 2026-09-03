import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const body = await request.json()
    console.log("Proxy login Body: ", body)

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    const data = await res.json()
    console.log("Proxy login response: ", data)

    const response = NextResponse.json(data, { status: res.status })

    // Set cookie dari server biar aman - INI KUNCINYA
    if(res.ok && data.access_token && data.user) {
      const cookieName = data.user.role === 'admin' ? 'admin_token' : 'showroom_token'
      
      response.cookies.set(cookieName, data.access_token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 hari
        sameSite: 'lax', // aman karena 1 domain
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', // true di vercel
      })
    }

    return response

  } catch (error) {
    console.error("Proxy Error:", error)
    return NextResponse.json({ detail: "Proxy error" }, { status: 500 })
  }
}
