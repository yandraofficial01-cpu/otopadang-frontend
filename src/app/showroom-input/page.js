'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const API_URL = 'https://otopadang-api.up.railway.app'

export default function InputMobilPage() {
  const [token, setToken] = useState('')
  const [form, setForm] = useState({
    merek: '', tipe: '', tahun: '', km: '', transmisi: 'Manual', bahan_bakar: 'Bensin',
    harga_tunai: '', harga_kredit: '', angsuran: '', lama_angsuran: '',
    lokasi: '', deskripsi: '', no_wa: '', foto1: '', foto2: '', foto3: '', foto4: '', 
    foto5: '', foto6: '', foto7: '', foto8: ''
  })
  const router = useRouter()

  useEffect(() => { // cek token saat load
    const t = localStorage.getItem('token')
    if (!t) router.push('/login')
    setToken(t)
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_URL}/mobil/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // kirim token
        },
        body: JSON.stringify({...form, is_approved: false}) // default butuh approve admin
      })
      if (!res.ok) throw new Error('Gagal input mobil')
      alert('Mobil berhasil diinput! Menunggu persetujuan Admin untuk tampil di Induk Web')
      router.push('/dashboard') 
    } catch (err) { alert(err.message) }
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Input Data Mobil</h1>
      <p className="text-red-500 mb-4">Sisa kuota: 25 mobil. Data akan review Admin dulu</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2">
          <input name="merek" placeholder="Merek" onChange={handleChange} className="border p-2 rounded" required/>
          <input name="tipe" placeholder="Tipe" onChange={handleChange} className="border p-2 rounded" required/>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <input name="tahun" type="number" placeholder="Tahun" onChange={handleChange} className="border p-2 rounded" required/>
          <input name="km" type="number" placeholder="KM" onChange={handleChange} className="border p-2 rounded" required/>
          <select name="transmisi" onChange={handleChange} className="border p-2 rounded"><option>Manual</option><option>Matic</option></select>
        </div>
        <input name="bahan_bakar" placeholder="Bahan Bakar" onChange={handleChange} className="border p-2 rounded"/>
        <div className="grid grid-cols-2 gap-2">
          <input name="harga_tunai" type="number" placeholder="Harga Tunai" onChange={handleChange} className="border p-2 rounded" required/>
          <input name="harga_kredit" type="number" placeholder="Harga Kredit" onChange={handleChange} className="border p-2 rounded"/>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input name="angsuran" type="number" placeholder="Angsuran/bulan" onChange={handleChange} className="border p-2 rounded"/>
          <input name="lama_angsuran" type="number" placeholder="Lama Angsuran Bulan" onChange={handleChange} className="border p-2 rounded"/>
        </div>
        <input name="lokasi" placeholder="Lokasi Showroom" onChange={handleChange} className="border p-2 rounded" required/>
        <input name="no_wa" placeholder="No WA Showroom" onChange={handleChange} className="border p-2 rounded" required/>
        <textarea name="deskripsi" placeholder="Deskripsi Mobil" onChange={handleChange} className="border p-2 rounded"></textarea>
        
        <h3 className="font-bold">Upload 8 Foto</h3>
        {[...Array(8)].map((_, i) => <input key={i} name={`foto${i+1}`} placeholder={`Link Foto ${i+1}`} onChange={handleChange} className="border p-2 rounded"/>)}

        <button className="bg-blue-600 text-white p-3 rounded font-bold">Kirim Untuk Review</button>
      </form>
    </div>
  )
}
