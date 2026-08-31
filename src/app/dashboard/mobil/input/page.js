"use client"
import { useState, useEffect } from "react"
import { Loader2, LogOut, Car, X } from "lucide-react"
import { Poppins } from 'next/font/google'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

const CLOUD_NAME = "jh0ct5rz"
const UPLOAD_PRESET = "otopadang_preset"
const API = "https://otopadang-api.vercel.app"

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

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
        const t = getCookie('token') || localStorage.getItem('token')
        const role = getCookie('role') || localStorage.getItem('role')
        if (!t || role?.toLowerCase()!== 'showroom'){
          localStorage.clear()
          document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
          document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
          window.location.href = '/'
          return
        }
      } catch(e) { window.location.href = '/' }
      finally { setPageLoading(false) }
    }
    checkAuth()
  }, [])

  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value})

  const handleLogout = () => {
    localStorage.clear()
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    window.location.href = '/'
  }

  const uploadToCloudinary = async (file, index) => {
    if(!file) return
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

  const removeFoto = (index) => setForm(prev => ({...prev, [`foto_url_${index}`]: ""}))

  async function handleSubmit(e) {
    e.preventDefault()
    if(!form.nama_mobil ||!form.merek ||!form.harga ||!form.foto_url_1) return alert("Lengkapi Nama, Merek, Harga & Foto Cover")

    let wa = form.no_wa_showroom
    if(wa.startsWith("0")) wa = "62" + wa.slice(1) // auto 089 -> 6289

    setLoading(true)
    const token = getCookie('token') || localStorage.getItem('token')
    if(!token) return setLoading(false)

    const payload = {
    ...form, no_wa_showroom: wa,
      tahun: Number(form.tahun) || 0, harga: Number(form.harga) || 0,
      harga_kredit: Number(form.harga_kredit) || 0, angsuran: Number(form.angsuran) || 0,
      kilometer: Number(form.kilometer) || 0, lama_angsuran: Number(form.lama_angsuran) || 0,
    }

    try {
      const res = await fetch(`${API}/cars/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      })
      const data = await res.json().catch(()=>({}))
      if(!res.ok) alert("Gagal [" + res.status + "]: " + (data.detail || "Cek login / BE down"))
      else {
        alert("Mobil berhasil diinput, menunggu approval admin")
        window.location.href = '/dashboard/mobil/list'
      }
    } catch(err) { alert("Error: Failed to fetch. Cek CORS BE") }
    finally { setLoading(false) }
  }

  if(pageLoading) return (
    <div className={`${poppins.className} bg-[#0B0B0F] min-h-screen flex items-center justify-center gap-4 text-white`}>
      <Loader2 className="w-10 h-10 animate-spin text-yellow-400"/><p>Memuat Halaman...</p>
    </div>
  )

  const Input = ({label,...props}) => (
    <div>
      <label className="text-sm text-gray-400 mb-1 block">{label}</label>
      <input {...props} className="w-full p-3 bg-[#1A1A1F] border-gray-700 rounded-lg text-white focus:border-yellow-400 outline-none" />
    </div>
  )

  return (
    <div className={`${poppins.className} p-4 md:p-6 bg-[#0B0B0F] text-white min-h-screen`}>
      <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
        <h1 className="text-2xl font-bold text-yellow-400 flex items-center gap-2"><Car size={24}/> Input Mobil Baru</h1>
        <button onClick={handleLogout} className="bg-red-600/20 hover:bg-red-600 border-red-500/30 px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
          <LogOut size={18}/> Logout
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        <Input name="nama_mobil" label="Nama Mobil *" value={form.nama_mobil} onChange={handleChange} required/>
        <Input name="merek" label="Merek *" value={form.merek} onChange={handleChange} required/>
        <Input name="tipe" label="Tipe" value={form.tipe} onChange={handleChange} placeholder="RS, G, dll"/>
        <Input name="tahun" label="Tahun" type="number" value={form.tahun} onChange={handleChange}/>
        <Input name="kilometer" label="Kilometer" type="number" value={form.kilometer} onChange={handleChange}/>
        <Input name="harga" label="Harga Cash *" type="number" value={form.harga} onChange={handleChange} required/>
        <Input name="harga_kredit" label="Harga Kredit" type="number" value={form.harga_kredit} onChange={handleChange}/>
        <Input name="angsuran" label="Angsuran/bln" type="number" value={form.angsuran} onChange={handleChange}/>
        <Input name="lama_angsuran" label="Lama Angsuran Bulan" type="number" value={form.lama_angsuran} onChange={handleChange}/>
        <Input name="lokasi" label="Lokasi" value={form.lokasi} onChange={handleChange}/>
        <Input name="no_wa_showroom" label="No WA Showroom" value={form.no_wa_showroom} onChange={handleChange} placeholder="6289..."/>

        <div>
          <label className="text-sm text-gray-400 mb-1 block">Transmisi</label>
          <select name="transmisi" value={form.transmisi} onChange={handleChange} className="w-full p-3 bg-[#1A1A1F] border-gray-700 rounded-lg">
            <option>Manual</option><option>Automatic</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Bahan Bakar</label>
          <select name="bahan_bakar" value={form.bahan_bakar} onChange={handleChange} className="w-full p-3 bg-[#1A1A1F] border-gray-700 rounded-lg">
            <option>Bensin</option><option>Diesel</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-gray-400 mb-1 block">Deskripsi</label>
          <textarea name="deskripsi" value={form.deskripsi} onChange={handleChange} placeholder="Surat lengkap, like new" className="w-full p-3 bg-[#1A1A1F] border-gray-700 rounded-lg h-24"></textarea>
        </div>

        {/* UPLOAD FOTO GRID 2x4 KAYA RUMAH */}
        <div className="md:col-span-2">
          <h3 className="font-bold mb-3 text-yellow-400">Foto Mobil (Tap upload, auto Cloudinary)</h3>
          <div className="grid grid-cols-2 gap-3">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="bg-[#1A1A1F] p-3 rounded-xl border-gray-700">
                <label className="text-sm text-gray-400">Foto {i} {i===1 && '(Cover)'}</label>
                {form[`foto_url_${i}`]? (
                  <div className="relative mt-2">
                    <img src={form[`foto_url_${i}`]} className="w-full h-24 object-cover rounded-lg"/>
                    <button type="button" onClick={() => removeFoto(i)} className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"><X size={12}/></button>
                  </div>
                ) : (
                  <label className="mt-2 flex-col items-center justify-center w-full h-20 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer hover:bg-gray-800">
                    {uploading[i]? <Loader2 className="animate-spin text-yellow-400"/> : <><span className="text-2xl">📸</span><span className="text-xs">Pilih Foto {i}</span></>}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadToCloudinary(e.target.files[0], i)}/>
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className="md:col-span-2 w-full bg-yellow-500 text-black font-black py-4 rounded-xl hover:bg-yellow-400 disabled:opacity-50 flex items-center justify-center gap-2 text-lg">
          {loading && <Loader2 className="animate-spin" size={20}/>} Simpan Mobil
        </button>
      </form>
    </div>
  )
}
