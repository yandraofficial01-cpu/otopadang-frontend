"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function InputMobilPage() {
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState([])
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const token = localStorage.getItem('token') // AMBIL TOKEN
    const formData = new FormData(e.target)

    // 1. KIRIM DATA MOBIL DULU KE /mobil/
    const payload = {
      nama_mobil: formData.get('nama_mobil'),
      merek: formData.get('merek'),
      tipe: formData.get('tipe'), // bukan type
      tahun: Number(formData.get('tahun')),
      kilometer: Number(formData.get('kilometer')), // bukan km
      transmisi: formData.get('transmisi'),
      bahan_bakar: formData.get('bahan_bakar'),
      harga: Number(formData.get('harga')), // bukan harga_cash
      harga_kredit: Number(formData.get('harga_kredit')), // dp
      lama_angsuran: Number(formData.get('lama_angsuran')), // tenor
      lokasi: formData.get('lokasi'),
      deskripsi: formData.get('deskripsi'),
      no_wa_showroom: formData.get('no_wa_showroom'), // bukan whatsapp
    }

    const res = await fetch('https://g-api.up.railway.app/mobil/', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // WAJIB
      },
      body: JSON.stringify(payload)
    })
    
    if(!res.ok) {
      alert("Gagal. Cek login lu")
      setLoading(false)
      return
    }

    const newCar = await res.json()

    // 2. UPLOAD FOTO KE /mobil/{id}/upload-foto
    for(let i=0; i<files.length; i++){
      const fotoForm = new FormData()
      fotoForm.append("file", files[i])
      await fetch(`https://g-api.up.railway.app/mobil/${newCar.id}/upload-foto`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fotoForm
      })
    }
    alert("Mobil berhasil diinput, menunggu approval admin")
    router.push('/')
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-black text-gold flex flex-col gap-3">
      <h1 className="text-2xl font-bold mb-4">Input Mobil Baru - Slot: 0/25</h1>

      <input name="nama_mobil" placeholder="Nama Mobil: Avanza G 2022" required className="input p-2 border"/>
      <input name="merek" placeholder="Merek: Toyota" required className="input p-2 border"/>
      <input name="tipe" placeholder="Tipe: G ATPM" required className="input p-2 border"/>
      <input name="tahun" type="number" placeholder="Tahun" required className="input p-2 border"/>
      <input name="kilometer" type="number" placeholder="KM" required className="input p-2 border"/>

      <select name="transmisi" className="input p-2 border"><option>Manual</option><option>Automatic</option></select>
      <select name="bahan_bakar" className="input p-2 border"><option>Bensin</option><option>Solar</option></select>

      <input name="harga" type="number" placeholder="Harga Cash" required className="input p-2 border"/>
      <input name="harga_kredit" type="number" placeholder="Harga Kredit / DP" className="input p-2 border"/>
      <input name="lama_angsuran" type="number" placeholder="Tenor Bulan" className="input p-2 border"/>

      <input name="lokasi" placeholder="Lokasi: Padang" required className="input p-2 border"/>
      <textarea name="deskripsi" placeholder="Deskripsi" className="input p-2 border"/>
      <input name="no_wa_showroom" placeholder="No WA Showroom" required className="input p-2 border"/>

      <label>Upload 8 Foto</label>
      <input type="file" multiple accept="image/*" onChange={e => setFiles([...e.target.files])} />

      <button disabled={loading} className="btn-gold p-3 mt-4">{loading? "Menyimpan..." : "Simpan Mobil"}</button>
    </form>
  )
}
