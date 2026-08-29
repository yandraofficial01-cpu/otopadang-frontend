'use client'
import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Loader2, LogOut, Car, Plus } from "lucide-react"
import { Poppins } from 'next/font/google'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })
const API_URL = "https://otopadang-api.vercel.app" // UDAH DIGANTI

export default function DashboardShowroom() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [namaShowroom, setNamaShowroom] = useState("")
  const [token, setToken] = useState("")

  useEffect(() => {
    // 1. AMBIL TOKEN & ROLE DARI LOCALSTORAGE
    const t = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    if (!t) {
      alert("Silahkan login dulu")
      router.push(`/login-showroom`)
      return
    }

    // 2. CEK ROLE HARUS SHOWROOM
    if(role?.toLowerCase()!== 'showroom'){
      alert(`Akses ditolak! Role kamu: ${role}. Harus 'showroom'`)
      localStorage.clear()
      router.push(`/login-admin`)
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
      localStorage.clear()
      router.push(`/login-showroom`)
    })
  }, [router])

  const handleLogout = () => {
    localStorage.clear() // hapus semua biar gak nyangkut ke admin
    router.push(`/login-showroom`)
  }

  if (loading) return (
    <div className={`${poppins.className} bg-[#0B0B0F] min-h-screen flex-col items-center justify-center gap-4 text-white`}>
      <Loader2 className="w-10 h-10 animate-spin text-yellow-400"/>
      <p>Loading Dashboard...</p>
    </div>
  )

  return (
    <div className={`${poppins.className} p-6 bg-[#0B0B0F] min-h-screen text-white`}>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-yellow-400">
            Dashboard {namaShowroom}
          </h1>
          <p className="text-gray-400 text-sm">Kelola mobil showroom kamu</p>
        </div>
        <button 
          onClick={handleLogout} 
          className="bg-red-600/20 hover:bg-red-600 border-red-500/30 px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2"
        >
          <LogOut size={18}/> Logout
        </button>
      </div>

      {/* BUTTON INPUT MOBIL */}
      <button
        onClick={() => router.push('/dashboard/mobil')}
        className="bg-yellow-400 text-black w-full py-3 rounded-xl font-bold mb-6 hover:bg-yellow-500 transition flex items-center justify-center gap-2"
      >
        <Plus size={20}/> Input Mobil Baru
      </button>

      {/* LIST MOBIL */}
      <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
        <Car size={20}/> Mobil {namaShowroom}
      </h2>
      <div className="bg-[#1a1a20] p-4 rounded-xl border-gray-800">
        <p className="text-gray-400">Belum ada mobil. Klik tombol di atas untuk upload.</p>
      </div>
    </div>
  )
}
