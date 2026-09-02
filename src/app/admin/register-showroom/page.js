'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const API_URL = 'https://otopadang-api.vercel.app'

export default function RegisterShowroomPage() {
  const [form, setForm] = useState({
    nama_showroom: '',
    alamat: '',
    wa_number: '',
    logo: 'https://via.placeholder.com/300x150.png?text=Logo+Showroom', // <--- KASIH DEFAULT
    deskripsi: 'Showroom terpercaya di Padang', // <--- KASIH DEFAULT
    subdomain: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    // Otomatis bersihin subdomain biar ga ada spasi/kapital
    if (name === 'subdomain') {
      setForm({...form, [name]: value.toLowerCase().replace(/[^a-z0-9-]/g, '') })
    } else {
      setForm({...form, [name]: value })
    }
  }

  const handlePaste = (e) => {
    const pastedText = e.clipboardData.getData('text');
    if (!pastedText.includes('\n')) return;
    e.preventDefault();
    const lines = pastedText.split('\n');
    const newForm = {...form };

    lines.forEach(line => {
      const parts = line.split(': ');
      const value = parts.length > 1? parts[1].trim() : '';
      const key = line.toLowerCase();

      if (!value) return;

      if (key.includes('nama showroom')) newForm.nama_showroom = value;
      else if (key.includes('slug') || key.includes('subdomain')) newForm.subdomain = value.toLowerCase().replace(/[^a-z0-9-]/g, '-');
      else if (key.includes('alamat')) newForm.alamat = value;
      else if (key.includes('no wa') || key.includes('no_hp') || key.includes('wa_number')) newForm.wa_number = value.replace(/[^0-9]/g, '').replace(/^0/, '62'); // <--- Auto jadi 62
      else if (key.includes('logo')) newForm.logo = value;
      else if (key.includes('deskripsi')) newForm.deskripsi = value;
      else if (key.includes('email')) newForm.email = value;
      else if (key.includes('password')) newForm.password = value;
    });
    setForm(newForm);
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // JAGA2 TERAKHIR: Kalau user hapus manual, kita timpa lagi
      const dataToSend = {
       ...form,
        logo: form.logo || 'https://via.placeholder.com/300x150.png?text=Logo+Showroom',
        deskripsi: form.deskripsi || `Showroom ${form.nama_showroom} terpercaya di Padang`
      }

      const resRegister = await fetch(`${API_URL}/admin/register-showroom`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend) // <--- PAKE dataToSend
      })

      const resRegData = await resRegister.json();
      if (!resRegister.ok) {
        // Biar errornya kebaca jelas
        if (resRegData.detail.includes("sudah terdaftar")) {
          throw new Error("Email atau Subdomain sudah dipakai. Coba yg lain")
        }
        throw new Error(resRegData.detail || 'Gagal register akun')
      }

      alert(`Registrasi Berhasil! Anak web lu: ${form.subdomain}.otopadang.com`)
      router.push('/login')
    } catch (err) {
      alert(`Error: ${err.message}`)
      console.error("Detail Error:", err)
    } finally {
      setLoading(false) // <--- pake finally biar pasti mati
    }
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Daftar Sewa Web Showroom</h1>
      <p className="text-gray-600 mb-4">Dapat Anak Web khusus + Max 25 Mobil</p>
      <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded mb-2">Tip: Copas 1 blok data terus Ctrl+V di area form</p>

      <form onSubmit={handleSubmit} onPaste={handlePaste} className="flex flex-col gap-4">
        <h2 className="font-bold text-lg border-b pb-2">Data Showroom</h2>
        <input name="nama_showroom" value={form.nama_showroom} placeholder="Nama Showroom" onChange={handleChange} className="border p-2 rounded" required />
        
        <div className="flex items-center border rounded overflow-hidden">
          <input name="subdomain" value={form.subdomain} placeholder="contoh: bintang-motor" onChange={handleChange} className="p-2 w-full outline-none" required />
          <span className="bg-gray-100 px-3 py-2 text-gray-500 text-sm border-l">.otopadang.com</span>
        </div>

        <textarea name="alamat" value={form.alamat} placeholder="Alamat Lengkap" onChange={handleChange} className="border p-2 rounded" required />
        <input name="wa_number" value={form.wa_number} placeholder="No WA Showroom: 628xxx" onChange={handleChange} className="border p-2 rounded" required />
        <input name="logo" value={form.logo} placeholder="Link Logo - boleh kosong" onChange={handleChange} className="border p-2 rounded" />
        <textarea name="deskripsi" value={form.deskripsi} placeholder="Deskripsi - boleh kosong" onChange={handleChange} className="border p-2 rounded" />

        <h2 className="font-bold text-lg border-b pb-2 mt-2">Buat Akun Login</h2>
        <input name="email" type="email" value={form.email} placeholder="Email Login" onChange={handleChange} className="border p-2 rounded" required />
        <input name="password" type="password" value={form.password} placeholder="Password" onChange={handleChange} className="border p-2 rounded" required />

        <button disabled={loading} className="bg-green-600 text-white p-3 rounded font-bold disabled:bg-gray-400">
          {loading? 'Mendaftar...' : 'Daftar Sekarang'}
        </button>
      </form>
    </div>
  )
}
