"use client"
import { useState } from "react"

const CLOUD_NAME = "jh0ct5rz"
const UPLOAD_PRESET = "otopadang_preset"
const API = "https://otopadang-api.up.railway.app"

export default function Page() {
  const [form, setForm] = useState({
    nama_rumah: "", tipe: "", alamat: "", harga: "", harga_kredit: "",
    angsuran: "", lama_angsuran: "120", luas_tanah: "", luas_bangunan: "",
    spesifikasi: "", badge_bonus: "Free Canopy",
    foto_url_1: "", foto_url_2: "", foto_url_3: "", foto_url_4: "",
    foto_url_5: "", foto_url_6: "", foto_url_7: "", foto_url_8: "",
    video_url: "", wa_number: "628979879518", status: "available"
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState({})

  const uploadToCloudinary = async (file, index) => {
    setUploading(prev => ({...prev, [index]: true}))
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("upload_preset", UPLOAD_PRESET)
      fd.append("folder", "otopadang")
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: fd })
      const data = await res.json()
      if(data.secure_url){
        setForm(prev => ({...prev, [`foto_url_${index}`]: data.secure_url}))
      } else {
        alert("Gagal: " + JSON.stringify(data))
      }
    } catch(e){ alert("Error: " + e.message) }
    setUploading(prev => ({...prev, [index]: false}))
  }

  const handleSubmit = async () => {
    if(!form.nama_rumah ||!form.harga) return alert("Nama & Harga wajib bro!")
    if(!form.tipe) return alert("Tipe wajib bro!")
    if(!form.foto_url_1) return alert("Foto Cover wajib!")
    setLoading(true)
    try {
      const payload = {
      ...form,
        harga: parseInt(form.harga) || 0,
        harga_kredit: parseInt(form.harga_kredit) || parseInt(form.harga) || 0,
        angsuran: parseInt(form.angsuran) || 0,
        lama_angsuran: parseInt(form.lama_angsuran) || 120,
        luas_tanah: parseInt(form.luas_tanah) || 0,
        luas_bangunan: parseInt(form.luas_bangunan) || 0,
      }
      const res = await fetch(`${API}/admin/upload-rumah`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(payload)
      })
      const data = await res.json().catch(()=>({}))
      if(res.ok) {
        alert("Rumah berhasil publish! ✅")
        window.location.href = "/admin"
      } else {
        alert(`Gagal [${res.status}]: ` + (data.detail || JSON.stringify(data)))
      }
    } catch(e){ alert("Error: " + e.message) }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-20">
      <h1 className="text-3xl font-bold text-yellow-400 mb-1">Upload Rumah</h1>
      <p className="text-gray-400 mb-6 text-sm">Cloudinary {CLOUD_NAME} - WA {form.wa_number}</p>
      <div className="bg-[#1a1a1a] border border-yellow-500/20 rounded-2xl p-5 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400">Nama Perumahan *</label>
            <input value={form.nama_rumah} onChange={e=>setForm({...form, nama_rumah: e.target.value})} placeholder="Contoh: Puri Lestari" className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none focus:border-yellow-400" />
          </div>
          <div>
            <label className="text-sm text-gray-400">Type Rumah *</label>
            <input value={form.tipe} onChange={e=>setForm({...form, tipe: e.target.value})} list="tipe-list" placeholder="Type 36/72 Hook" className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none focus:border-yellow-400" />
            <datalist id="tipe-list"><option value="Type 36" /><option value="Type 45" /><option value="Type 60" /><option value="Type 90" /><option value="Subsidi" /><option value="Komersil" /></datalist>
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-400">Alamat</label>
          <input value={form.alamat} onChange={e=>setForm({...form, alamat: e.target.value})} placeholder="Koto Tangah, Padang..." className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div><label className="text-xs text-gray-400">Harga Cash *</label><input type="number" value={form.harga} onChange={e=>setForm({...form, harga: e.target.value})} className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none" /></div>
          <div><label className="text-xs text-gray-400">Harga Kredit</label><input type="number" value={form.harga_kredit} onChange={e=>setForm({...form, harga_kredit: e.target.value})} className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none" /></div>
          <div><label className="text-xs text-gray-400">LT</label><input type="number" value={form.luas_tanah} onChange={e=>setForm({...form, luas_tanah: e.target.value})} className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none" /></div>
          <div><label className="text-xs text-gray-400">LB</label><input type="number" value={form.luas_bangunan} onChange={e=>setForm({...form, luas_bangunan: e.target.value})} className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none" /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="text-xs text-gray-400">Angsuran</label><input type="number" value={form.angsuran} onChange={e=>setForm({...form, angsuran: e.target.value})} className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none" /></div>
          <div><label className="text-xs text-gray-400">Lama Angsuran</label><input type="number" value={form.lama_angsuran} onChange={e=>setForm({...form, lama_angsuran: e.target.value})} className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none" /></div>
        </div>
        <div>
          <label className="text-sm text-yellow-400 font-bold">Foto Rumah (Tap upload, auto Cloudinary)</label>
          <div className="grid grid-cols-2 gap-3 mt-3">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="bg-[#2a2a2a] border border-gray-700 rounded-xl p-3">
                <p className="text-[11px] text-gray-400 mb-2">Foto {i} {i==1?'(Cover)':''}</p>
                {form[`foto_url_${i}`]? (
                  <div className="space-y-2">
                    <img src={form[`foto_url_${i}`]} className="w-full h-28 object-cover rounded-lg border border-yellow-400/30" alt="" />
                    <button onClick={()=>setForm({...form, [`foto_url_${i}`]: ""})} className="text-[10px] bg-red-500/20 text-red-400 px-2 py-1 rounded">Hapus</button>
                  </div>
                ) : (
                  <label className="w-full h-28 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-yellow-400">
                    <span className="text-xl">{uploading[i]? "⏳" : "📸"}</span>
                    <span className="text-[11px] mt-1 text-gray-400">{uploading[i]? "Uploading..." : `Pilih Foto ${i}`}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={e=> e.target.files[0] && uploadToCloudinary(e.target.files[0], i)} />
                  </label>
                )}
              </div>
            ))}
          </div>
        <div>
          <label className="text-sm text-gray-400">Spesifikasi</label>
          <textarea value={form.spesifikasi} onChange={e=>setForm({...form, spesifikasi: e.target.value})} className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 h-28 outline-none" />
        </div>
        <button onClick={handleSubmit} disabled={loading} className="w-full bg-yellow-400 text-black font-black py-5 rounded-xl text-lg hover:bg-yellow-300 disabled:opacity-50">
          {loading? "Publishing..." : "🚀 Publish Rumah"}
        </button>
      </div>
    </div>
  )
}
