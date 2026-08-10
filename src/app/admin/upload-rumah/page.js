"use client"
import { useState } from "react"

export default function UploadRumah() {
  const [form, setForm] = useState({
    nama_rumah: "", tipe: "Type 36", alamat: "", harga: "", harga_kredit: "",
    angsuran: "", lama_angsuran: 120, luas_tanah: "", luas_bangunan: "",
    spesifikasi: "", badge_bonus: "Free Canopy", foto_url_1: "", wa_number: "08979879518"
  })
  const [loading, setLoading] = useState(false)
  const API = "https://otopadang-api.up.railway.app"

  const handleSubmit = async () => {
    if(!form.nama_rumah || !form.harga) return alert("Nama & Harga wajib bro!")
    setLoading(true)
    try {
      const res = await fetch(`${API}/rumah`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          ...form,
          harga: parseInt(form.harga),
          harga_kredit: parseInt(form.harga_kredit || form.harga),
          angsuran: parseInt(form.angsuran || 0),
          luas_tanah: parseInt(form.luas_tanah),
          luas_bangunan: parseInt(form.luas_bangunan),
        })
      })
      if(res.ok) {
        alert("Rumah berhasil di-upload!")
        setForm({...form, nama_rumah: "", harga: "", foto_url_1: ""})
      } else {
        const err = await res.text()
        alert("Gagal: " + err)
      }
    } catch(e) { alert("Error: " + e.message) }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-3xl font-bold text-yellow-400 mb-2">Upload Rumah</h1>
      <p className="text-gray-400 mb-6">Jual rumah subsidi & komersil Padang - auto masuk ke Listing Otopadang</p>

      <div className="bg-[#1a1a1a] border border-yellow-500/20 rounded-2xl p-5 space-y-5">
        {/* ROW 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400">Nama Perumahan / Rumah *</label>
            <input value={form.nama_rumah} onChange={e=>setForm({...form, nama_rumah: e.target.value})} placeholder="Contoh: Puri Lestari Koto Tangah" className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none focus:border-yellow-400" />
          </div>
          <div>
            <label className="text-sm text-gray-400">Tipe Rumah</label>
            <select value={form.tipe} onChange={e=>setForm({...form, tipe: e.target.value})} className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none">
              <option>Type 36</option>
              <option>Type 45</option>
              <option>Type 60</option>
              <option>Type 90</option>
              <option>Subsidi</option>
              <option>Komersil</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-400">Alamat Lengkap</label>
          <input value={form.alamat} onChange={e=>setForm({...form, alamat: e.target.value})} placeholder="Koto Tangah, Padang Utara..." className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none" />
        </div>

        {/* ROW HARGA */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-gray-400">Harga Cash *</label>
            <input type="number" value={form.harga} onChange={e=>setForm({...form, harga: e.target.value})} placeholder="250000000" className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none" />
          </div>
          <div>
            <label className="text-sm text-gray-400">Harga Kredit</label>
            <input type="number" value={form.harga_kredit} onChange={e=>setForm({...form, harga_kredit: e.target.value})} placeholder="280jt" className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none" />
          </div>
          <div>
            <label className="text-sm text-gray-400">LT (m²)</label>
            <input type="number" value={form.luas_tanah} onChange={e=>setForm({...form, luas_tanah: e.target.value})} className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none" />
          </div>
          <div>
            <label className="text-sm text-gray-400">LB (m²)</label>
            <input type="number" value={form.luas_bangunan} onChange={e=>setForm({...form, luas_bangunan: e.target.value})} className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400">Badge Bonus</label>
            <select value={form.badge_bonus} onChange={e=>setForm({...form, badge_bonus: e.target.value})} className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none">
              <option>Free Canopy</option>
              <option>Free Pagar</option>
              <option>SHM Ready</option>
              <option>DP 0%</option>
              <option>Subsidi Pemerintah</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400">Link Foto Cover (1)</label>
            <input value={form.foto_url_1} onChange={e=>setForm({...form, foto_url_1: e.target.value})} placeholder="https://..." className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 outline-none" />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-400">Spesifikasi / Deskripsi</label>
          <textarea value={form.spesifikasi} onChange={e=>setForm({...form, spesifikasi: e.target.value})} placeholder="2KT 1KM, Listrik 1300W, Air PDAM, Jalan 6m, Dekat Masjid..." className="w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl p-4 h-32 outline-none" />
        </div>

        {form.foto_url_1 && <img src={form.foto_url_1} className="w-full h-64 object-cover rounded-xl border border-gray-700" />}

        <button onClick={handleSubmit} disabled={loading} className="w-full bg-yellow-400 text-black font-black py-5 rounded-xl text-lg hover:bg-yellow-300 transition">
          {loading? "Sedang Upload..." : "🚀 Publish Rumah Sekarang"}
        </button>
      </div>
    </div>
  )
        }
