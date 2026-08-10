"use client"
import { useState } from "react"

const CLOUD_NAME = "jh0ct5rz"
const UPLOAD_PRESET = "otopadang_preset"

export default function UploadRumah() {
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
  const API = "https://otopadang-api.up.railway.app"

  const uploadToCloudinary = async (file, index) => {
    setUploading(prev => ({...prev, [index]: true}))
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("upload_preset", UPLOAD_PRESET)
      fd.append("folder", "otopadang")
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: fd
      })
      const data = await res.json()
      if(data.secure_url){
        setForm(prev => ({...prev, [`foto_url_${index}`]: data.secure_url}))
      } else {
        alert("Gagal upload Cloudinary: " + JSON.stringify(data))
      }
    } catch(e){
      alert("Error upload: " + e.message)
    }
    setUploading(prev => ({...prev, [index]: false}))
  }

  const handleSubmit = async () => {
    if(!form.nama_rumah ||!form.harga) return alert("Nama & Harga wajib bro!")
    if(!form.tipe) return alert("Tipe rumah wajib bro!")
    if(!form.foto_url_1) return alert("Foto Cover wajib upload bro!")
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
      // FIX UTAMA DISINI BRO - ENDPOINT YANG BENAR
      const res = await fetch(`${API}/admin/upload-rumah`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload)
      })
      const data = await res.json().catch(()=>({}))
      if(res.ok) {
        alert("Rumah berhasil publish ke induk web! ✅")
        setForm({
          nama_rumah: "", tipe: "", alamat: "", harga: "", harga_kredit: "",
          angsuran: "", lama_angsuran: "120", luas_tanah: "", luas_bangunan: "",
          spesifikasi: "", badge_bonus: "Free Canopy",
          foto_url_1: "", foto_url_2: "", foto_url_3: "", foto_url_4: "",
          foto_url_5: "", foto_url_6: "", foto_url_7: "", foto_url_8: "",
          video_url: "", wa_number: "628979879518", status: "available"
        })
      } else {
        alert(`Gagal [${res.status}]: ` + (data.detail || JSON.stringify(data)))
      }
    } catch(e) { alert("Error: " + e.message) }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-20">
      <h1 className="text-3xl font-bold text-yellow-400 mb-1">Upload Rumah</h1>
      <p className="text-gray-400 mb-6 text-sm">Auto upload ke Cloudinary {CLOUD_NAME} - WA {form.wa_number}</p>
      <div className="bg-[#1a1a1a] border border-yellow-500/20 rounded-2xl p-5 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400">Nama Perumahan / Rumah *</label>
            <input value={form.nama_rumah} onChange={e=>setForm({...form, nama_rumah: e.target.value})} placeholder="Contoh: Puri Lestari Koto Tangah" className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none focus:border-yellow-400" />
          </div>
          <div>
            <label className="text-sm text-gray-400">Type Rumah *</label>
            <input value={form.tipe} onChange={e=>setForm({...form, tipe: e.target.value})} placeholder="Ketik: Type 36/72 Hook, Subsidi..." list="tipe-list" className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none focus:border-yellow-400" />
            <datalist id="tipe-list">
              <option value="Type 36" /><option value="Type 45" /><option value="Type 60" /><option value="Type 90" /><option value="Type 120" /><option value="Subsidi" /><option value="Komersil" /><option value="Type 36/72 Hook" />
            </datalist>
            <div className="flex gap-2 mt-2 flex-wrap">
              {["Type 36","Type 45","Subsidi","Komersil"].map(t => (
                <button key={t} type="button" onClick={()=>setForm({...form, tipe: t})} className={`text-xs px-3 py-1.5 rounded-full border ${form.tipe===t?'bg-yellow-400 text-black border-yellow-400 font-bold':'bg-[#2a2a2a] border-gray-700 hover:border-yellow-400'}`}>{t}</button>
              ))}
            </div>
          </div>
        <div>
          <label className="text-sm text-gray-400">Alamat Lengkap</label>
          <input value={form.alamat} onChange={e=>setForm({...form, alamat: e.target.value})} placeholder="Koto Tangah, Padang Utara..." className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none focus:border-yellow-400" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div><label className="text-xs text-gray-400">Harga Cash *</label><input type="number" value={form.harga} onChange={e=>setForm({...form, harga: e.target.value})} placeholder="250000000" className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none" /></div>
          <div><label className="text-xs text-gray-400">Harga Kredit</label><input type="number" value={form.harga_kredit} onChange={e=>setForm({...form, harga_kredit: e.target.value})} placeholder="280jt" className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none" /></div>
          <div><label className="text-xs text-gray-400">LT (m²)</label><input type="number" value={form.luas_tanah} onChange={e=>setForm({...form, luas_tanah: e.target.value})} placeholder="72" className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none" /></div>
          <div><label className="text-xs text-gray-400">LB (m²)</label><input type="number" value={form.luas_bangunan} onChange={e=>setForm({...form, luas_bangunan: e.target.value})} placeholder="36" className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none" /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="text-xs text-gray-400">Angsuran / Bulan</label><input type="number" value={form.angsuran} onChange={e=>setForm({...form, angsuran: e.target.value})} placeholder="1500000" className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none" /></div>
          <div><label className="text-xs text-gray-400">Lama Angsuran (bulan)</label><input type="number" value={form.lama_angsuran} onChange={e=>setForm({...form, lama_angsuran: e.target.value})} placeholder="120" className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none" /></div>
        </div>
        <div>
          <label className="text-sm text-yellow-400 font-bold">Foto Rumah (Tap untuk upload dari HP, auto Cloudinary)</label>
          <div className="grid grid-cols-2 gap-3 mt-3">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="bg-[#2a2a2a] border border-gray-700 rounded-xl p-3 relative">
                <p className="text-[11px] text-gray-400 mb-2">Foto {i} {i==1?'(Cover Wajib)':''}</p>
                {form[`foto_url_${i}`]? (
                  <div className="space-y-2">
                    <img src={form[`foto_url_${i}`]} className="w-full h-28 object-cover rounded-lg border border-yellow-400/30" />
                    <div className="flex gap-2">
                      <button onClick={()=>setForm({...form, [`foto_url_${i}`]: ""})} className="text-[10px] bg-red-500/20 text-red-400 px-2 py-1 rounded">Hapus</button>
                      <p className="text-[9px] text-green-400 truncate flex-1">✓ Uploaded</p>
                    </div>
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
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400">Badge Bonus</label>
            <select value={form.badge_bonus} onChange={e=>setForm({...form, badge_bonus: e.target.value})} className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none">
              <option>Free Canopy</option><option>Free Pagar</option><option>SHM Ready</option><option>DP 0%</option><option>Subsidi Pemerintah</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400">Video URL</label>
            <input value={form.video_url} onChange={e=>setForm({...form, video_url: e.target.value})} placeholder="https://..." className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none" />
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-400">Spesifikasi</label>
          <textarea value={form.spesifikasi} onChange={e=>setForm({...form, spesifikasi: e.target.value})} placeholder="2KT 1KM, Listrik 1300W..." className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 h-28 outline-none focus:border-yellow-400" />
        </div>
        <button onClick={handleSubmit} disabled={loading} className="w-full bg-yellow-400 text-black font-black py-5 rounded-xl text-lg hover:bg-yellow-300 transition disabled:opacity-50">
          {loading? "Sedang Publish..." : "🚀 Publish Rumah ke Induk Web"}
        </button>
      </div>
    </div>
  )
}
