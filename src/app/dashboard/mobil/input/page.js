"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, LogOut, Car } from "lucide-react"
import { Poppins } from 'next/font/google'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

const CLOUD_NAME = "jh0ct5rz"
const UPLOAD_PRESET = "otopadang_preset"
const API = "https://otopadang-api.vercel.app"

export default function InputMobilPage() {
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [uploading, setUploading] = useState({})
  const [form, setForm] = useState({
    nama_mobil: "", merek: "", tipe: "", tahun: "", kilometer: "",
    transmisi: "Manual", bahan_bakar: "Bensin",
    harga: "", harga_kredit: "", angsuran: "", lama_angsuran: "",
    lokasi: "", deskripsi: "", no_wa_showroom: "",
    foto_url_1: "", foto_url_2: "", foto_url_3: "", foto_url_4: "",
    foto_url_5: "", foto_url_6: "", foto_url_7: "", foto_url_8: "",
  })
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      try {
        const t = localStorage.getItem('token')
        const role = localStorage.getItem('role')

        if (!t) {
          router.push('/') // kalau belum login balik ke landing
          return
        }
        if(role?.toLowerCase()!== 'showroom'){
          localStorage.clear()
          router.push('/') // kalau role salah balik ke landing
          return
        }
      } catch(e) {
        localStorage.clear()
        router.push('/')
      } finally {
        setPageLoading(false)
      }
    }
    checkAuth()
  }, [router])

  const handleLogout = () => {
    localStorage.clear()
    router.push('/') // INI YANG UDAH DIGANTI KE LANDING
  }

  const uploadToCloudinary = async (file, index) => {
    setUploading(prev => ({...prev, [index]: true}))
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("upload_preset", UPLOAD_PRESET)
      fd.append("folder", "otopadang/mobil")

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: fd })
      const data = await res.json()
      if(data.secure_url){
        setForm(prev => ({...prev, [`foto_url_${index}`]: data.secure_url}))
      } else { alert("Gagal Upload Foto: " + JSON.stringify(data)) }
    } catch(e){ alert("Error Cloudinary: " + e.message) }
    setUploading(prev => ({...prev, [index]: false}))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if(!form.nama_mobil ||!form.merek ||!form.harga ||!form.foto_url_1) return alert("Lengkapi Nama, Merek, Harga & Foto Cover")

    setLoading(true)
    const token = localStorage.getItem('token')
    if(!token) {
      setLoading(false)
      return alert("Lu belum login bro")
    }

    const payload = {
    ...form,
      tahun: Number(form.tahun) || 0,
      harga: Number(form.harga) || 0,
      harga_kredit: Number(form.harga_kredit) || 0,
      angsuran: Number(form.angsuran) || 0,
      kilometer: Number(form.kilometer) || 0,
      lama_angsuran: Number(form.lama_angsuran) || 0,
    }

    try {
      const res = await fetch(`${API}/cars/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json().catch(()=>({}))
      if(!res.ok) {
        alert("Gagal [" + res.status + "]: " + (data.detail || "Cek login / BE down"))
      } else {
        alert("Mobil berhasil diinput, menunggu approval admin")
        router.push('/dashboard/mobil/list')
      }
    } catch(err) {
      alert("Error: Failed to fetch. Cek CORS BE")
    } finally {
      setLoading(false)
    }
  }

  if(pageLoading) return (
    <div className={`${poppins.className} bg-[#0B0B0F] min-h-screen flex items-center justify-center gap-4 text-white`}>
      <Loader2 className="w-10 h-10 animate-spin text-yellow-400"/>
    </div>
  )

  return (
    <div className={`${poppins.className} p-6 bg-[#0B0B0F] text-white min-h-screen`}>
      <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
        <h1 className="text-2xl font-bold text-yellow-400 flex items-center gap-2"><Car size={24}/> Input Mobil Baru</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600/20 hover:bg-red-600 border-red-500/30 px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
        >
          <LogOut size={18}/> Logout
        </button>
      </div>
      {/*...form nya sama kaya punya kamu... */}
    </div>
  )
}
