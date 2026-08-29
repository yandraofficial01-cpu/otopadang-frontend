"use client"
import { useState, useEffect } from "react"
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

  useEffect(() => {
    const checkAuth = () => {
      try {
        const t = localStorage.getItem('token')
        const role = localStorage.getItem('role')

        if (!t) {
          window.location.href = '/'
          return
        }
        if(role?.toLowerCase()!== 'showroom'){
          localStorage.clear()
          document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax" // HAPUS COOKIE JUGA
          window.location.href = '/'
          return
        }
      } catch(e) {
        localStorage.clear()
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax"
        window.location.href = '/'
      } finally {
        setPageLoading(false)
      }
    }
    checkAuth()
  }, [])

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value})
  }

  const handleLogout = () => {
    localStorage.clear()
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax" // FIX UTAMA DISINI
    window.location.href = '/'
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
        alert(`Foto ${index} berhasil diupload`)
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
        window.location.href = '/dashboard/mobil/list'
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
      <p>Memuat Halaman...</p>
    </div>
  )

  return (
    <div className={`${poppins.className} p-6 bg-[#0B0B0F] text-white min-h-screen`}>
      <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
        <h1 className="text-2xl font-bold text-yellow-400 flex items-center gap-2"><Car size={24}/> Input Mobil Baru</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600/20 hover:bg-red-600 border border-red-500/30 px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
        >
          <LogOut size={18}/> Logout
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        <input name="nama_mobil" placeholder="Nama Mobil *" value={form.nama_mobil} onChange={handleChange} className="p-3 bg-gray-900 border border-gray-700 rounded-lg text-white" required/>
        <input name="merek" placeholder="Merek *" value={form.merek} onChange={handleChange} className="p-3 bg-gray-900 border-gray-700 rounded-lg text-white" required/>
        <input name="tipe" placeholder="Tipe" value={form.tipe} onChange={handleChange} className="p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"/>
        <input name="tahun" type="number" placeholder="Tahun" value={form.tahun} onChange={handleChange} className="p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"/>
        <input name="kilometer" type="number" placeholder="Kilometer" value={form.kilometer} onChange={handleChange} className="p-3 bg-gray-900 border-gray-700 rounded-lg text-white"/>
        <input name="harga" type="number" placeholder="Harga *" value={form.harga} onChange={handleChange} className="p-3 bg-gray-900 border-gray-700 rounded-lg text-white" required/>
        <input name="lokasi" placeholder="Lokasi" value={form.lokasi} onChange={handleChange} className="p-3 bg-gray-900 border-gray-700 rounded-lg text-white"/>
        <input name="no_wa_showroom" placeholder="No WA Showroom" value={form.no_wa_showroom} onChange={handleChange} className="p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"/>
        
        <textarea name="deskripsi" placeholder="Deskripsi" value={form.deskripsi} onChange={handleChange} className="md:col-span-2 p-3 bg-gray-900 border-gray-700 rounded-lg text-white h-24"></textarea>

        <div>
          <label className="text-sm text-gray-400">Foto Cover *</label>
          <input type="file" accept="image/*" onChange={(e) => uploadToCloudinary(e.target.files[0], 1)} className="w-full text-sm mt-1"/>
          {uploading[1] && <Loader2 className="animate-spin w-4 h-4 mt-1"/>}
        </div>

        <button type="submit" disabled={loading} className="md:col-span-2 w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 disabled:opacity-50 flex items-center justify-center gap-2">
          {loading && <Loader2 className="animate-spin" size={20}/>} Simpan Mobil
        </button>
      </form>
    </div>
  )
}
