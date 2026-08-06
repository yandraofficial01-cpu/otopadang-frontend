'use client'
import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

const API_URL = "https://otopadang-api.up.railway.app" // ganti ke API lu

export default function DashboardShowroom() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [subdomain, setSubdomain] = useState("")
  const [namaShowroom, setNamaShowroom] = useState("")
  const [token, setToken] = useState("")

  useEffect(() => {
    // 1. DETEKSI SUBDOMAIN DARI URL
    // ex: "showroom1.padangmobil.com" -> "showroom1"
    // ex: "localhost:3000" -> "localhost"
    const host = window.location.host
    const sub = host.split('.')[0]
    setSubdomain(sub)

    // 2. AMBIL TOKEN BERDASARKAN SUBDOMAIN
    const t = localStorage.getItem(`token_${sub}`)
    if (!t) {
      alert("Silahkan login dulu")
      // lempar ke login, bawa subdomain biar balik lagi ke sini
      router.push(`/login-showroom?redirect=${sub}`)
      return
    }
    setToken(t)

    // 3. CEK TOKEN KE BACKEND + AMBIL NAMA SHOWROOM
    axios.get(`${API_URL}/showroom/me`, {
      headers: {Authorization: `Bearer ${t}`}
    }).then(res => {
      setNamaShowroom(res.data.nama) // "Padang Auto"
      setLoading(false)
    }).catch((err) => {
      console.log(err)
      alert("Token kadaluarsa. Login lagi")
      router.push(`/login-showroom?redirect=${sub}`)
    })
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem(`token_${subdomain}`)
    router.push(`/login-showroom?redirect=${subdomain}`)
  }

  if (loading) return <div className="p-10 text-white">Loading...</div>

  return (
    <div className="p-6 bg-[#0B0B0F] min-h-screen text-white">
      <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
        <h1 className="text-2xl font-bold text-yellow-400">
          Dashboard {namaShowroom}
        </h1>
        <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">
          Logout
        </button>
      </div>

      <button
        onClick={() => router.push('/dashboard/mobil')}
        className="bg-yellow-400 text-black w-full py-3 rounded font-bold mb-6 hover:bg-yellow-500"
      >
        + Input Mobil Baru
      </button>

      <h2 className="text-xl font-bold mb-3">Mobil {namaShowroom}</h2>
      <div className="bg-gray-800 p-4 rounded">
        <p>Belum ada mobil. Klik tombol di atas untuk upload.</p>
      </div>
    </div>
  )
}
