'use client'
import { useState } from 'react'

export default function InputRumah() {
  const [form, setForm] = useState({ 
    judul: '', 
    harga: '', 
    lokasi: '',
    tipe: '',
    luas_tanah: '',
    luas_bangunan: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Data Rumah:', form)
    alert('Data rumah berhasil disimpan!')
    // Nanti disini fetch ke /api/rumah
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Input Data Rumah</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Judul Iklan</label>
          <input type="text" placeholder="Contoh: Rumah Minimalis 2 Lantai di Padang" className="w-full p-2 border rounded" 
            onChange={e=>setForm({...form,judul:e.target.value})} required/>
        </div>
        <div>
          <label className="block mb-1">Lokasi</label>
          <input type="text" placeholder="Contoh: Kuranji, Padang" className="w-full p-2 border rounded" 
            onChange={e=>setForm({...form,lokasi:e.target.value})} required/>
        </div>
        <div>
          <label className="block mb-1">Tipe Rumah</label>
          <input type="text" placeholder="Contoh: Minimalis, Modern" className="w-full p-2 border rounded" 
            onChange={e=>setForm({...form,tipe:e.target.value})} required/>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Luas Tanah m2</label>
            <input type="number" placeholder="120" className="w-full p-2 border rounded" 
              onChange={e=>setForm({...form,luas_tanah:e.target.value})} required/>
          </div>
          <div>
            <label className="block mb-1">Luas Bangunan m2</label>
            <input type="number" placeholder="90" className="w-full p-2 border rounded" 
              onChange={e=>setForm({...form,luas_bangunan:e.target.value})} required/>
          </div>
        </div>
        <div>
          <label className="block mb-1">Harga</label>
          <input type="number" placeholder="500000000" className="w-full p-2 border rounded" 
            onChange={e=>setForm({...form,harga:e.target.value})} required/>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded w-full">
          Simpan Data Rumah
        </button>
      </form>
    </div>
  )
}
