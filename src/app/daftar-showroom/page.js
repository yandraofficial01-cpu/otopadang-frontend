'use client'
import { useState } from 'react'

export default function RegisterShowroomPage() {
  const [form, setForm] = useState({
    nama: '',
    wa: '',
    alamat: '',
    nama_showroom: ''
  })

  const NO_WA_ADMIN = '628979879518' // <-- GANTI PAKE NOMOR WA LU BRO. Pake 62

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const pesan = `Halo Admin Otopadang, saya mau daftar showroom baru:%0A%0A
*Nama:* ${form.nama}%0A
*No WA:* ${form.wa}%0A
*Nama Showroom:* ${form.nama_showroom}%0A
*Alamat:* ${form.alamat}`

    const url = `https://wa.me/${NO_WA_ADMIN}?text=${pesan}`
    window.open(url, '_blank')
  }

  return (
    <div className="p-6 md:p-10 bg-[#0B0B0F] min-h-screen text-white flex items-center justify-center">
      <div className="w-full max-w-lg bg-[#1A1A1F] p-8 rounded-2xl border border-gray-800">
        <h1 className="text-2xl font-bold text-yellow-400 mb-2">Daftar Showroom</h1>
        <p className="text-gray-400 mb-6">Isi data dulu. Nanti kita chat via WA</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            placeholder="Nama Penanggung Jawab" 
            className="w-full p-3 rounded bg-gray-900 border-gray-700 focus:border-yellow-400 outline-none"
            onChange={e => setForm({...form, nama: e.target.value})}
            required
          />
          <input 
            type="text" 
            placeholder="No WA Aktif" 
            className="w-full p-3 rounded bg-gray-900 border border-gray-700 focus:border-yellow-400 outline-none"
            onChange={e => setForm({...form, wa: e.target.value})}
            required
          />
          <input 
            type="text" 
            placeholder="Nama Showroom" 
            className="w-full p-3 rounded bg-gray-900 border border-gray-700 focus:border-yellow-400 outline-none"
            onChange={e => setForm({...form, nama_showroom: e.target.value})}
            required
          />
          <textarea 
            placeholder="Alamat Lengkap Showroom" 
            className="w-full p-3 rounded bg-gray-900 border border-gray-700 focus:border-yellow-400 outline-none"
            rows={3}
            onChange={e => setForm({...form, alamat: e.target.value})}
            required
          />
          <button type="submit" className="w-full bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-400 transition">
            Kirim ke WhatsApp Admin
          </button>
        </form>
      </div>
    </div>
  )
    }
