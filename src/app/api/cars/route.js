import { NextResponse } from "next/server"

export async function POST(request) {
  const token = request.headers.get('authorization')
  const body = await request.json()

  // TAMBAHIN INI: Cek kalau token kosong
  if (!token) {
    return NextResponse.json({ detail: "Token tidak ada" }, { status: 401 })
  }

  const res = await fetch('https://otopadang-api.up.railway.app/mobil', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token // <- ini udah bener "Bearer xxx"
    },
    body: JSON.stringify(body)
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
