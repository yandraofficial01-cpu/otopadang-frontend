"use client"
import { useState } from "react"

export default function InputMobilPage() {
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState([])

  async function handleSubmit(formData) {
    setLoading(true)

    // 1. KIRIM DATA MOBIL DULU
    const res = await fetch('/api/cars', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData))
    })
    const newCar = await res.json()

    // 2. UPLOAD 8 FOTO SATU2 KE /api/cars/{id}/upload-foto
    for(let i=0; i<files.length; i++){
      const fotoForm = new FormData()
      fotoForm.append("file", files[i])
      await fetch(`/api/cars/${newCar.id}/upload-foto`, {
        method: 'POST',
        body: fotoForm
      })
    }
    alert("Mobil berhasil diinput, menunggu approval admin")
    setLoading(false)
  }

  return (
    <form action={handleSubmit} className="p-6 bg-black text-gold">
      <h1 className="text-2xl font-bold mb-4">Input Mobil Baru - Slot: 0/25</h1>

      <input name="merek" placeholder="Merek: Toyota" required className="input"/>
      <input name="type" placeholder="Type: Avanza G" required className="input"/>
      <input name="tahun" type="number" placeholder="Tahun" required className="input"/>
      <input name="km" type="number" placeholder="KM" required className="input"/>

      <select name="transmisi" className="input"><option>Manual</option><option>Matic</option></select>
      <select name="bahan_bakar" className="input"><option>Bensin</option><option>Solar</option></select>

      <input name="harga_cash" type="number" placeholder="Harga Cash" required className="input"/>
      <input name="dp" type="number" placeholder="DP Kredit" className="input"/>
      <input name="tenor" type="number" placeholder="Tenor Bulan" className="input"/>

      <input name="lokasi" placeholder="Lokasi" required className="input"/>
      <textarea name="deskripsi" placeholder="Deskripsi" className="input"/>
      <input name="whatsapp" placeholder="No WA Showroom" required className="input"/>

      <label>Upload 8 Foto</label>
      <input type="file" multiple accept="image/*" onChange={e => setFiles([...e.target.files])} />

      <button disabled={loading}>{loading? "Menyimpan..." : "Simpan Mobil"}</button>
    </form>
  )
}
