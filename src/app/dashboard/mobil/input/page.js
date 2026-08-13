"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

const CLOUD_NAME = "jh0ct5rz" // Punya lu
const UPLOAD_PRESET = "otopadang_preset" // Punya lu
const API = "https://g-api.up.railway.app" // API lu

export default function InputMobilPage() {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState({})
  const [form, setForm] = useState({
    nama_mobil: "", merek: "", tipe: "", tahun: "", kilometer: "",
    transmisi: "Manual", bahan_bakar: "Bensin",
    harga: "", harga_kredit: "", dp: "", lama_angsuran: "",
    lokasi: "", deskripsi: "", no_wa_showroom: "",
    foto_url_1: "", foto_url_2: "", foto_url_3: "", foto_url_4: "",
    foto_url_5: "", foto_url_6: "", foto_url_7: "", foto_url_8: "",
  })
  const router = useRouter()

  // 1. UPLOAD KE CLOUDINARY DULU SETIAP PILIH FILE
  const uploadToCloudinary = async (file, index) => {
    setUploading(prev => ({...prev, [index]: true}))
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("upload_preset", UPLOAD_PRESET)
      fd.append("folder", "otopadang/mobil") // masuk folder mobil

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: fd })
      const data = await res.json()
      if(data.secure_url){
        setForm(prev => ({...prev, [`foto_url_${index}`]: data.secure_url}))
      } else { alert("Gagal Upload Foto") }
    } catch(e){ alert("Error: " + e.message) }
    setUploading(prev => ({...prev, [index]: false}))
  }

  // 2. KIRIM SEMUA DATA + URL FOTO SEKALIGUS
  async function handleSubmit(e) {
    e.preventDefault()
    if(!form.nama_mobil ||!form.merek ||!form.harga ||!form.foto_url_1) return alert("Lengkapi Nama, Merek, Harga & Foto Cover")

    setLoading(true)
    const token = localStorage.getItem('token')

    const payload = {
     ...form,
      tahun: Number(form.tahun),
      harga: Number(form.harga),
      harga_kredit: Number(form.harga_kredit),
      dp: Number(form.dp),
      kilometer: Number(form.kilometer),
      lama_angsuran: Number(form.lama_angsuran),
    }

    try {
      const res = await fetch(`${API}/mobil/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if(!res.ok) {
        const err = await res.json()
        alert("Gagal: " + (err.detail || "Cek login"))
      } else {
        alert("Mobil berhasil diinput, menunggu approval admin")
        router.push('/dashboard/mobil/list')
      }
    } catch(err) { alert("Error: " + err.message) }
    setLoading(false)
  }

  return (
    <div className="p-6 bg-black text-yellow-400 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Input Mobil Baru</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-2xl">

        <input name="nama_mobil" placeholder="Nama Mobil: Avanza G 2022" value={form.nama_mobil} onChange={e=>setForm({...form, nama_mobil: e.target.value})} required className="p-2 border bg-[#1a1a1a] border-gray-700 rounded"/>
        <input name="merek" placeholder="Merek: Toyota" value={form.merek} onChange={e=>setForm({...form, merek: e.target.value})} required className="p-2 border bg-[#1a1a1a] border-gray-700 rounded"/>
        <input name="tipe" placeholder="Tipe: G ATPM" value={form.tipe} onChange={e=>setForm({...form, tipe: e.target.value})} className="p-2 border bg-[#1a1a1a] border-gray-700 rounded"/>
        <input name="tahun" type="number" placeholder="Tahun" value={form.tahun} onChange={e=>setForm({...form, tahun: e.target.value})} required className="p-2 border bg-[#1a1a1a] border-gray-700 rounded"/>
        <input name="kilometer" type="number" placeholder="KM" value={form.kilometer} onChange={e=>setForm({...form, kilometer: e.target.value})} className="p-2 border bg-[#1a1a1a] border-gray-700 rounded"/>

        <select name="transmisi" value={form.transmisi} onChange={e=>setForm({...form, transmisi: e.target.value})} className="p-2 border bg-[#1a1a1a] border-gray-700 rounded"><option>Manual</option><option>Automatic</option></select>
        <select name="bahan_bakar" value={form.bahan_bakar} onChange={e=>setForm({...form, bahan_bakar: e.target.value})} className="p-2 border bg-[#1a1a1a] border-gray-700 rounded"><option>Bensin</option><option>Solar</option></select>

        <input name="harga" type="number" placeholder="Harga Cash" value={form.harga} onChange={e=>setForm({...form, harga: e.target.value})} required className="p-2 border bg-[#1a1a1a] border-gray-700 rounded"/>
        <input name="dp" type="number" placeholder="DP" value={form.dp} onChange={e=>setForm({...form, dp: e.target.value})} className="p-2 border bg-[#1a1a1a] border-gray-700 rounded"/>
        <input name="harga_kredit" type="number" placeholder="Harga Kredit" value={form.harga_kredit} onChange={e=>setForm({...form, harga_kredit: e.target.value})} className="p-2 border bg-[#1a1a1a] border-gray-700 rounded"/>
        <input name="lama_angsuran" type="number" placeholder="Tenor Bulan" value={form.lama_angsuran} onChange={e=>setForm({...form, lama_angsuran: e.target.value})} className="p-2 border bg-[#1a1a1a] border-gray-700 rounded"/>

        <input name="lokasi" placeholder="Lokasi: Padang" value={form.lokasi} onChange={e=>setForm({...form, lokasi: e.target.value})} required className="p-2 border bg-[#1a1a1a] border-gray-700 rounded"/>
        <textarea name="deskripsi" placeholder="Deskripsi" value={form.deskripsi} onChange={e=>setForm({...form, deskripsi: e.target.value})} className="p-2 border bg-[#1a1a1a] border-gray-700 rounded"/>
        <input name="no_wa_showroom" placeholder="No WA Showroom" value={form.no_wa_showroom} onChange={e=>setForm({...form, no_wa_showroom: e.target.value})} required className="p-2 border bg-[#1a1a1a] border-gray-700 rounded"/>

        <label className="font-bold mt-4 text-yellow-400">Upload 8 Foto</label>
        <div className="grid grid-cols-2 gap-3">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="bg-[#1a1a1a] p-2 rounded border border-gray-700">
              <p className="text-xs mb-1">Foto {i} {i==1 && '(Cover)'}</p>
              {form[`foto_url_${i}`]? (
                <div>
                  <img src={form[`foto_url_${i}`]} className="w-full h-20 object-cover rounded mb-1"/>
                  <button type="button" onClick={()=>setForm({...form, [`foto_url_${i}`]: ""})} className="text-[10px] bg-red-500 px-2 py-1 rounded">Hapus</button>
                </div>
              ) : (
                <label className="w-full h-20 border-2 border-dashed flex items-center justify-center cursor-pointer rounded">
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
