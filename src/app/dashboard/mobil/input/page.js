'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function InputMobilPage() {
  const [form, setForm] = useState({
    nama_mobil: '', harga: '', tahun: '', deskripsi: '',
    showroom_id: localStorage.getItem('showroom_id') || ''
  })
  const [files, setFiles] = useState([]) // buat 8 foto
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // 1. BIKIN DATA MOBIL DULU
    const resCar = await fetch('http://localhost:8000/cars/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({...form, harga: Number(form.harga), tahun: Number(form.tahun)})
    })
    const carData = await resCar.json()
    const carId = carData.id

    // 2. UPLOAD 8 FOTO SATU-SATU
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData()
      formData.append('file', files[i])

      await fetch(`http://localhost:8000/cars/${carId}/upload-foto`, {
        method: 'POST',
        body: formData // FormData ga pake Content-Type
      })
    }

    alert('Mobil + Foto berhasil diupload!')
    router.push('/dashboard')
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Input Mobil Baru</h1>

      <input placeholder="Nama Mobil" onChange={e => setForm({...form, nama_mobil: e.target.value})} className="border p-2 w-full mb-3" required />
      <input type="number" placeholder="Harga" onChange={e => setForm({...form, harga: e.target.value})} className="border p-2 w-full mb-3" required />
      <input type="number" placeholder="Tahun" onChange={e => setForm({...form, tahun: e.target.value})} className="border p-2 w-full mb-3" required />
      <textarea placeholder="Deskripsi" onChange={e => setForm({...form, deskripsi: e.target.value})} className="border p-2 w-full mb-3" />

      <label className="block mb-2">Upload 8 Foto Mobil</label>
      <input type="file" multiple accept="image/*" onChange={e => setFiles([...e.target.files])} className="mb-4" />

      <button disabled={loading} className="bg-green-600 text-white w-full p-2 rounded">
        {loading? 'Mengupload...' : 'Simpan Mobil'}
      </button>
    </form>
  )
}