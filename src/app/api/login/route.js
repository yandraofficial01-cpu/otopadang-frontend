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

    // Set cookie dari server biar aman
    if(res.ok) {
      response.cookies.set('token', data.access_token, {
        path: '/',
        maxAge: 86400,
        sameSite: 'lax',
        httpOnly: true // <- PENTING BIAR AMAN
      })
    }

    return response

  } catch (error) {
    console.error("Proxy Error:", error) 
    return NextResponse.json({ detail: "Proxy error" }, { status: 500 })
  }
}
