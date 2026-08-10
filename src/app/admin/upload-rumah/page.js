"use client"
import { useState } from "react"

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
  const API = "https://otopadang-api.up.railway.app"

  const handleSubmit = async () => {
    if(!form.nama_rumah || !form.harga) return alert("Nama & Harga wajib bro!")
    if(!form.tipe) return alert("Tipe rumah wajib bro!")
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

      const res = await fetch(`${API}/admin/rumah`, {
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
        alert("Gagal: " + (data.detail || JSON.stringify(data)))
      }
    } catch(e) { alert("Error: " + e.message) }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-20">
      <h1 className="text-3xl font-bold text-yellow-400 mb-1">Upload Rumah</h1>
      <p className="text-gray-400 mb-6 text-sm">WA otomatis ke {form.wa_number} - Masuk tab Rumah di induk web</p>

      <div className="bg-[#1a1a1a] border border-yellow-500/20 rounded-2xl p-5 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400">Nama Perumahan / Rumah *</label>
            <input value={form.nama_rumah} onChange={e=>setForm({...form, nama_rumah: e.target.value})} placeholder="Contoh: Puri Lestari Koto Tangah" className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none focus:border-yellow-400" />
          </div>
          {/* FIX: TIPE JADI KETIK + CHIPS */}
          <div>
            <label className="text-sm text-gray-400">Type Rumah *</label>
            <input 
              value={form.tipe} 
              onChange={e=>setForm({...form, tipe: e.target.value})} 
              placeholder="Ketik: Type 36/72 Hook, Subsidi..."
              list="tipe-list"
              className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none focus:border-yellow-400" 
            />
            <datalist id="tipe-list">
              <option value="Type 36" />
              <option value="Type 45" />
              <option value="Type 60" />
              <option value="Type 90" />
              <option value="Type 120" />
              <option value="Subsidi" />
              <option value="Komersil" />
              <option value="Type 36/72 Hook" />
            </datalist>
            <div className="flex gap-2 mt-2 flex-wrap">
              {["Type 36","Type 45","Subsidi","Komersil"].map(t => (
                <button key={t} type="button" onClick={()=>setForm({...form, tipe: t})} className={`text-xs px-3 py-1.5 rounded-full border ${form.tipe===t?'bg-yellow-400 text-black border-yellow-400 font-bold':'bg-[#2a2a2a] border-gray-700 hover:border-yellow-400'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-400">Alamat Lengkap</label>
          <input value={form.alamat} onChange={e=>setForm({...form, alamat: e.target.value})} placeholder="Koto Tangah, Padang Utara..." className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none focus:border-yellow-400" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-gray-400">Harga Cash *</label>
            <input type="number" value={form.harga} onChange={e=>setForm({...form, harga: e.target.value})} placeholder="250000000" className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none" />
          </div>
          <div>
            <label className="text-xs text-gray-400">Harga Kredit</label>
            <input type="number" value={form.harga_kredit} onChange={e=>setForm({...form, harga_kredit: e.target.value})} placeholder="280jt" className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none" />
          </div>
          <div>
            <label className="text-xs text-gray-400">LT (m²)</label>
            <input type="number" value={form.luas_tanah} onChange={e=>setForm({...form, luas_tanah: e.target.value})} placeholder="72" className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none" />
          </div>
          <div>
            <label className="text-xs text-gray-400">LB (m²)</label>
            <input type="number" value={form.luas_bangunan} onChange={e=>setForm({...form, luas_bangunan: e.target.value})} placeholder="36" className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400">Angsuran / Bulan</label>
            <input type="number" value={form.angsuran} onChange={e=>setForm({...form, angsuran: e.target.value})} placeholder="1500000" className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none" />
          </div>
          <div>
            <label className="text-xs text-gray-400">Lama Angsuran (bulan)</label>
            <input type="number" value={form.lama_angsuran} onChange={e=>setForm({...form, lama_angsuran: e.target.value})} placeholder="120" className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none" />
          </div>
        </div>

        <div>
          <label className="text-sm text-yellow-400 font-bold">Foto Rumah (8 foto biar laku bro)</label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {[1,2,3,4,5,6,7,8].map(i => (
              <input key={i} value={form[`foto_url_${i}`]} onChange={e=>setForm({...form, [`foto_url_${i}`]: e.target.value})} placeholder={`Link Foto ${i} ${i==1?'(Cover)*':''}`} className="bg-[#2a2a2a] border border-gray-700 rounded-xl p-3 text-sm outline-none focus:border-yellow-400" />
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
            <label className="text-sm text-gray-400">Video URL (YouTube / TikTok)</label>
            <input value={form.video_url} onChange={e=>setForm({...form, video_url: e.target.value})} placeholder="https://..." className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none" />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-400">Spesifikasi / Deskripsi Lengkap</label>
          <textarea value={form.spesifikasi} onChange={e=>setForm({...form, spesifikasi: e.target.value})} placeholder="2KT 1KM, Listrik 1300W, Air PDAM, Jalan 6m, Dekat Masjid..." className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 h-28 outline-none focus:border-yellow-400" />
        </div>

        {form.foto_url_1 && (
          <div>
            <p className="text-xs text-gray-400 mb-2">Preview Cover:</p>
            <img src={form.foto_url_1} onError={e=>e.target.style.display='none'} className="w-full h-64 object-cover rounded-xl border border-gray-700" />
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading} className="w-full bg-yellow-400 text-black font-black py-5 rounded-xl text-lg hover:bg-yellow-300 transition disabled:opacity-50">
          {loading? "Sedang Publish..." : "🚀 Publish Rumah ke Induk Web"}
        </button>
      </div>
    </div>
  )
}
