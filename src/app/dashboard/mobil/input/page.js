"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

const CLOUD_NAME = "jh0ct5rz"
const UPLOAD_PRESET = "otopadang_preset"
const API = "https://otopadang-api.up.railway.app"

export default function InputMobilPage() {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState({})
  const [form, setForm] = useState({
    nama_mobil: "", merek: "", tipe: "", tahun: "", kilometer: "",
    transmisi: "Manual", bahan_bakar: "Bensin", // DEFAULT BENSIN
    harga: "", harga_kredit: "", angsuran: "", lama_angsuran: "", // FIX: dp -> angsuran
    lokasi: "", deskripsi: "", no_wa_showroom: "",
    foto_url_1: "", foto_url_2: "", foto_url_3: "", foto_url_4: "",
    foto_url_5: "", foto_url_6: "", foto_url_7: "", foto_url_8: "",
  })
  const router = useRouter()

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
    if(!token) return alert("Lu belum login bro")

    const payload = {
     ...form,
      tahun: Number(form.tahun) || 0,
      harga: Number(form.harga) || 0,
      harga_kredit: Number(form.harga_kredit) || 0,
      angsuran: Number(form.angsuran) || 0, // FIX: dp -> angsuran
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
    } catch(err) { alert("Error: Failed to fetch. Cek CORS BE") }
    setLoading(false)
  }

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-yellow-400">Input Mobil Baru</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-2xl">

        <input name="nama_mobil" placeholder="Nama Mobil: Avanza G 2022" value={form.nama_mobil} onChange={e=>setForm({...form, nama_mobil: e.target.value})} required className="p-2 border bg-[#1a1a1a] border-gray-700 rounded text-white"/>
        <input name="merek" placeholder="Merek: Toyota" value={form.merek} onChange={e=>setForm({...form, merek: e.target.value})} required className="p-2 border bg-[#1a1a1a] border-gray-700 rounded text-white"/>
        <input name="tipe" placeholder="Tipe: G ATPM" value={form.tipe} onChange={e=>setForm({...form, tipe: e.target.value})} className="p-2 border bg-[#1a1a1a] border-gray-700 rounded text-white"/>
        <input name="tahun" type="number" placeholder="Tahun" value={form.tahun} onChange={e=>setForm({...form, tahun: e.target.value})} required className="p-2 border bg-[#1a1a1a] border-gray-700 rounded text-white"/>
        <input name="kilometer" type="number" placeholder="KM" value={form.kilometer} onChange={e=>setForm({...form, kilometer: e.target.value})} className="p-2 border bg-[#1a1a1a] border-gray-700 rounded text-white"/>

        <select name="transmisi" value={form.transmisi} onChange={e=>setForm({...form, transmisi: e.target.value})} className="p-2 border bg-[#1a1a1a] border-gray-700 rounded text-white">
          <option>Manual</option>
          <option>Automatic</option>
          <option>CVT</option>
        </select>

        {/* TAMBAH OPSI BAHAN BAKAR */}
        <select name="bahan_bakar" value={form.bahan_bakar} onChange={e=>setForm({...form, bahan_bakar: e.target.value})} className="p-2 border bg-[#1a1a1a] border-gray-700 rounded text-white">
          <option>Bensin</option>
          <option>Solar</option>
          <option>Hybrid</option>
          <option>Listrik</option>
        </select>

        <input name="harga" type="number" placeholder="Harga Cash" value={form.harga} onChange={e=>setForm({...form, harga: e.target.value})} required className="p-2 border bg-[#1a1a1a] border-gray-700 rounded text-white"/>

        {/* FIX: name="dp" -> name="angsuran" */}
        <input name="angsuran" type="number" placeholder="Angsuran/Bulan" value={form.angsuran} onChange={e=>setForm({...form, angsuran: e.target.value})} className="p-2 border bg-[#1a1a1a] border-gray-700 rounded text-white"/>

        <input name="harga_kredit" type="number" placeholder="Harga Kredit" value={form.harga_kredit} onChange={e=>setForm({...form, harga_kredit: e.target.value})} className="p-2 border bg-[#1a1a1a] border-gray-700 rounded text-white"/>
        <input name="lama_angsuran" type="number" placeholder="Tenor Bulan" value={form.lama_angsuran} onChange={e=>setForm({...form, lama_angsuran: e.target.value})} className="p-2 border bg-[#1a1a1a] border-gray-700 rounded text-white"/>

        <input name="lokasi" placeholder="Lokasi: Padang" value={form.lokasi} onChange={e=>setForm({...form, lokasi: e.target.value})} required className="p-2 border bg-[#1a1a1a] border-gray-700 rounded text-white"/>
        <textarea name="deskripsi" placeholder="Deskripsi" value={form.deskripsi} onChange={e=>setForm({...form, deskripsi: e.target.value})} className="p-2 border bg-[#1a1a1a] border-gray-700 rounded text-white"/>
        <input name="no_wa_showroom" placeholder="No WA Showroom" value={form.no_wa_showroom} onChange={e=>setForm({...form, no_wa_showroom: e.target.value})} required className="p-2 border bg-[#1a1a1a] border-gray-700 rounded text-white"/>

        <label className="font-bold mt-4 text-yellow-400">Upload 8 Foto</label>
        <div className="grid grid-cols-2 gap-3">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="bg-[#1a1a1a] p-2 rounded border border-gray-700">
              <p className="text-xs mb-1 text-gray-300">Foto {i} {i==1 && '(Cover)'}</p>
              {form[`foto_url_${i}`]? (
                <div>
                  <img src={form[`foto_url_${i}`]} className="w-full h-24 object-cover rounded mb-1"/>
                  <button type="button" onClick={()=>setForm({...form, [`foto_url_${i}`]: ""})} className="w-full text-[10px] bg-red-500 px-2 py-1 rounded text-white">Hapus</button>
                </div>
              ) : (
                <label className="w-full h-24 border-2 border-dashed flex items-center justify-center cursor-pointer rounded text-gray-400">
                  <span>{uploading[i]? "⏳" : "📸"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={e=> e.target.files[0] && uploadToCloudinary(e.target.files[0], i)} />
                </label>
              )}
            </div>
          ))}
        </div>

        <button type="submit" disabled={loading} className="bg-yellow-400 text-black font-bold p-3 mt-4 rounded disabled:opacity-50">
          {loading? "Menyimpan..." : "Simpan Mobil"}
        </button>
      </form>
    </div>
  )
}
