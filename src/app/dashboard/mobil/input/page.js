"use client"
import { useState, useEffect, useRef } from "react"
import { Loader2, LogOut, Car, X } from "lucide-react"
import { Poppins } from 'next/font/google'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

const CLOUD_NAME = "jh0ct5rz"
const UPLOAD_PRESET = "otopadang_preset"
const API = "https://otopadang-api.vercel.app"

const BAHAN_BAKAR_LIST = ["Bensin", "Diesel", "Hybrid", "Listrik", "Pertalite", "Pertamax", "Pertamax Turbo", "Solar"]

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function NumberInput({ label, name, value, onChange, required }) {
  const [local, setLocal] = useState(value || "")
  const ref = useRef()

  useEffect(() => { setLocal(value || "") }, [value])

  const handleLocalChange = (e) => {
    const onlyNums = e.target.value.replace(/[^0-9]/g, '')
    setLocal(onlyNums)
  }

  const handleBlur = () => {
    onChange({ target: { name, value: local } })
  }

  return (
    <div>
      <label className="text-sm text-gray-400 mb-1 block">{label} {required && <span className="text-red-400">*</span>}</label>
      <input
        ref={ref}
        name={name}
        value={local}
        onChange={handleLocalChange}
        onBlur={handleBlur}
        inputMode="numeric"
        type="text"
        required={required}
        className="w-full p-3 bg-[#1A1A1F] border-gray-700 rounded-lg text-white focus:border-yellow-400 outline-none" // FIX: tambah border
      />
    </div>
  )
}

function TextInput({ label, name, value, onChange, placeholder, required }) {
  return (
    <div>
      <label className="text-sm text-gray-400 mb-1 block">{label} {required && <span className="text-red-400">*</span>}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type="text"
        required={required}
        className="w-full p-3 bg-[#1A1A1F] border-gray-700 rounded-lg text-white focus:border-yellow-400 outline-none" // FIX: tambah border
      />
    </div>
  )
}

export default function InputMobilPage() {
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [uploading, setUploading] = useState({})
  const [form, setForm] = useState({
    nama_mobil: "", merek: "", tipe: "", tahun: "", kilometer: "",
    transmisi: "Manual", bahan_bakar: "Bensin",
    harga: "", harga_kredit: "", angsuran: "", lama_angsuran: "",
    lokasi: "", deskripsi: "", spesifikasi: "", no_wa_showroom: "", // FIX: tambah spesifikasi
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
    if(file.size > 5000000) return alert("Foto kegedean bro. Maks 5MB")

    setUploading(prev => ({...prev, [index]: true}))
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("upload_preset", UPLOAD_PRESET)
      fd.append("folder", "otopadang/mobil")
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: fd })

      if(!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = await res.json()
      if(data.secure_url){
        setForm(prev => ({...prev, [`foto_url_${index}`]: data.secure_url}))
      } else {
        alert("Gagal Upload Foto: " + (data.error?.message || "Unknown"))
      }
    } catch(e){
      alert("Error Cloudinary: " + e.message)
    }
    setUploading(prev => ({...prev, [index]: false}))
  }

  const removeFoto = (index) => setForm(prev => ({...prev, [`foto_url_${index}`]: ""}))

  async function handleSubmit(e) {
    e.preventDefault()
    if(!form.nama_mobil ||!form.merek ||!form.harga ||!form.foto_url_1) return alert("Lengkapi Nama, Merek, Harga & Foto Cover")

    let wa = form.no_wa_showroom
    if(wa && wa.startsWith("0")) wa = "62" + wa.slice(1)

    setLoading(true)
    const token = getCookie('token') || localStorage.getItem('token')
    if(!token) return setLoading(false)

    const toIntOrNull = (v) => v? Number(v) : null // FIX: biar null bukan 0

    const payload = {
    ...form,
      no_wa_showroom: wa || null,
      tahun: toIntOrNull(form.tahun),
      harga: toIntOrNull(form.harga),
      harga_kredit: toIntOrNull(form.harga_kredit),
      angsuran: toIntOrNull(form.angsuran),
      kilometer: toIntOrNull(form.kilometer),
      lama_angsuran: toIntOrNull(form.lama_angsuran),
    }

    try {
      const res = await fetch(`${API}/cars/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      })
      const data = await res.json().catch(()=>({}))
      if(!res.ok) alert(`Gagal Upload [${res.status}]: ` + (data.detail || ""))
      else { alert("Mobil berhasil diinput"); window.location.href = '/dashboard/mobil/list' }
    } catch(err) { alert("Error: Failed to fetch. Cek API") }
    finally { setLoading(false) }
  }

  if(pageLoading) return <div className={`${poppins.className} bg-[#0B0B0F] min-h-screen flex items-center justify-center gap-4 text-white`}><Loader2 className="w-10 h-10 animate-spin text-yellow-400"/><p>Memuat Halaman...</p></div>

  return (
    <div className={`${poppins.className} p-4 md:p-6 bg-[#0B0B0F] text-white min-h-screen`}>
      <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
        <h1 className="text-2xl font-bold text-yellow-400 flex items-center gap-2"><Car size={24}/> Input Mobil Baru</h1>
        <button type="button" onClick={handleLogout} className="bg-red-600/20 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold flex items-center gap-2"><LogOut size={18}/> Logout</button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        <TextInput name="nama_mobil" label="Nama Mobil" value={form.nama_mobil} onChange={handleChange} required />
        <TextInput name="merek" label="Merek" value={form.merek} onChange={handleChange} required />
        <TextInput name="tipe" label="Tipe" value={form.tipe} onChange={handleChange} placeholder="RS, G, dll"/>

        <NumberInput name="tahun" label="Tahun" value={form.tahun} onChange={handleChange} />
        <NumberInput name="kilometer" label="Kilometer" value={form.kilometer} onChange={handleChange} />
        <NumberInput name="harga" label="Harga Cash" value={form.harga} onChange={handleChange} required />
        <NumberInput name="harga_kredit" label="Harga Kredit" value={form.harga_kredit} onChange={handleChange} />
        <NumberInput name="angsuran" label="Angsuran/bln" value={form.angsuran} onChange={handleChange} />
        <NumberInput name="lama_angsuran" label="Lama Angsuran Bulan" value={form.lama_angsuran} onChange={handleChange} />
        <TextInput name="lokasi" label="Lokasi" value={form.lokasi} onChange={handleChange} />
        <NumberInput name="no_wa_showroom" label="No WA Showroom" value={form.no_wa_showroom} onChange={handleChange} />

        <div>
          <label className="text-sm text-gray-400 mb-1 block">Transmisi</label>
          <select name="transmisi" value={form.transmisi} onChange={handleChange} className="w-full p-3 bg-[#1A1A1F] border border-gray-700 rounded-lg">
            <option>Manual</option><option>Automatic</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-400 mb-1 block">Bahan Bakar</label>
          <select name="bahan_bakar" value={form.bahan_bakar} onChange={handleChange} className="w-full p-3 bg-[#1A1A1F] border border-gray-700 rounded-lg"> {/* FIX border */}
            {BAHAN_BAKAR_LIST.map(bbm => <option key={bbm} value={bbm}>{bbm}</option>)}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-gray-400 mb-1 block">Deskripsi</label>
          <textarea name="deskripsi" value={form.deskripsi} onChange={handleChange} placeholder="Surat lengkap, like new" className="w-full p-3 bg-[#1A1A1F] border border-gray-700 rounded-lg h-24"></textarea>
        </div>

        <div className="md:col-span-2"> {/* FIX: TAMBAH INPUT SPESIFIKASI */}
          <label className="text-sm text-gray-400 mb-1 block">Spesifikasi Detail</label>
          <textarea name="spesifikasi" value={form.spesifikasi} onChange={handleChange} placeholder="Contoh: Pajak 2027, Ban baru, Bebas banjir" className="w-full p-3 bg-[#1A1A1F] border border-gray-700 rounded-lg h-24"></textarea>
        </div>

        <div className="md:col-span-2">
          <h3 className="font-bold mb-3 text-yellow-400">Foto Mobil (Tap upload, auto Cloudinary)</h3>
          <div className="grid grid-cols-2 gap-3">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="bg-[#1A1A1F] p-3 rounded-xl border border-gray-700"> {/* FIX border */}
                <label className="text-sm text-gray-400">Foto {i} {i===1 && <span className="text-red-400">(Cover)</span>}</label>
                {form[`foto_url_${i}`]? (
                  <div className="relative mt-2">
                    <img src={form[`foto_url_${i}`]} className="w-full h-24 object-cover rounded-lg"/>
                    <button type="button" onClick={() => removeFoto(i)} className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"><X size={12}/></button>
                  </div>
                ) : (
                  <label className="mt-2 flex flex-col items-center justify-center w-full h-20 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer hover:bg-gray-800">
                    {uploading[i]? <Loader2 className="animate-spin text-yellow-400"/> : <><span className="text-2xl">📸</span><span className="text-xs">Pilih Foto {i}</span></>}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && uploadToCloudinary(e.target.files[0], i)}/>
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
