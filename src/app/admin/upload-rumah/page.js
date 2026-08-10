"use client"
import { useState } from "react"

export default function UploadRumah() {
  const [form, setForm] = useState({
    nama_rumah: "", tipe: "Type 36", alamat: "", harga: "", harga_kredit: "",
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
    setLoading(true)
    try {
      // FIX ENDPOINT & FIX NaN
      const payload = {
        ...form,
        harga: parseInt(form.harga) || 0,
        harga_kredit: parseInt(form.harga_kredit) || parseInt(form.harga) || 0,
        angsuran: parseInt(form.angsuran) || 0,
        lama_angsuran: parseInt(form.lama_angsuran) || 120,
        luas_tanah: parseInt(form.luas_tanah) || 0,
        luas_bangunan: parseInt(form.luas_bangunan) || 0,
      }

      const res = await fetch(`${API}/admin/rumah`, { // FIX: /admin/rumah bukan /rumah
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
        setForm(f => ({ ...f, nama_rumah: "", harga: "", harga_kredit: "", foto_url_1: "", foto_url_2: "", foto_url_3: "", foto_url_4: "" }))
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
        {/* ... bagian atas lu udah bagus, gue keep ... */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400">Nama Perumahan *</label>
            <input value={form.nama_rumah} onChange={e=>setForm({...form, nama_rumah: e.target.value})} placeholder="Puri Lestari Koto Tangah" className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none focus:border-yellow-400" />
          </div>
          <div>
            <label className="text-sm text-gray-400">Tipe</label>
            <select value={form.tipe} onChange={e=>setForm({...form, tipe: e.target.value})} className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none">
              <option>Type 36</option><option>Type 45</option><option>Type 60</option><option>Type 90</option><option>Subsidi</option><option>Komersil</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-400">Alamat</label>
          <input value={form.alamat} onChange={e=>setForm({...form, alamat: e.target.value})} className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <input type="number" value={form.harga} onChange={e=>setForm({...form, harga: e.target.value})} placeholder="Harga Cash *" className="bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none" />
          <input type="number" value={form.harga_kredit} onChange={e=>setForm({...form, harga_kredit: e.target.value})} placeholder="Harga Kredit" className="bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none" />
          <input type="number" value={form.luas_tanah} onChange={e=>setForm({...form, luas_tanah: e.target.value})} placeholder="LT m²" className="bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none" />
          <input type="number" value={form.luas_bangunan} onChange={e=>setForm({...form, luas_bangunan: e.target.value})} placeholder="LB m²" className="bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="number" value={form.angsuran} onChange={e=>setForm({...form, angsuran: e.target.value})} placeholder="Angsuran /bln" className="bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none" />
          <input type="number" value={form.lama_angsuran} onChange={e=>setForm({...form, lama_angsuran: e.target.value})} placeholder="Lama Angsuran (bulan)" className="bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none" />
        </div>

        {/* FIX 8 FOTO */}
        <div>
          <label className="text-sm text-yellow-400 font-bold">Foto Rumah (8 foto biar laku bro)</label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {[1,2,3,4,5,6,7,8].map(i => (
              <input key={i} value={form[`foto_url_${i}`]} onChange={e=>setForm({...form, [`foto_url_${i}`]: e.target.value})} placeholder={`Link Foto ${i} ${i==1?'(Cover)*':''}`} className="bg-[#2a2a2a] border border-gray-700 rounded-xl p-3 text-sm outline-none focus:border-yellow-400" />
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-400">Badge Bonus</label>
          <select value={form.badge_bonus} onChange={e=>setForm({...form, badge_bonus: e.target.value})} className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none">
            <option>Free Canopy</option><option>Free Pagar</option><option>SHM Ready</option><option>DP 0%</option><option>Subsidi Pemerintah</option>
          </select>
        </div>

        <textarea value={form.spesifikasi} onChange={e=>setForm({...form, spesifikasi: e.target.value})} placeholder="Spesifikasi: 2KT 1KM, Listrik 1300W..." className="w-full bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 h-28 outline-none" />

        {form.foto_url_1 && <img src={form.foto_url_1} onError={e=>e.target.style.display='none'} className="w-full h-64 object-cover rounded-xl border border-gray-700" />}

        <button onClick={handleSubmit} disabled={loading} className="w-full bg-yellow-400 text-black font-black py-5 rounded-xl text-lg hover:bg-yellow-300">
          {loading? "Publishing..." : "🚀 Publish Rumah ke Induk Web"}
        </button>
      </div>
    </div>
  )
}
