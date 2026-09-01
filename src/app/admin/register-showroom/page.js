'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const API_URL = 'https://otopadang-api.vercel.app' // <--- UDAH GANTI

export default function RegisterShowroomPage() {
  const [form, setForm] = useState({
    nama_showroom: '',
    alamat: '',
    wa_number: '',
    logo: '',
    deskripsi: '',
    subdomain: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value })
  }

  const handlePaste = (e) => {
    const pastedText = e.clipboardData.getData('text');
    if (!pastedText.includes('\n')) return;
    e.preventDefault();
    const lines = pastedText.split('\n');
    const newForm = {...form };

    lines.forEach(line => {
      const parts = line.split(': ');
      const value = parts.length > 1? parts[1].trim() : line.trim();
      const key = line.toLowerCase();

      if (key.includes('nama showroom')) newForm.nama_showroom = value;
      else if (key.includes('slug') || key.includes('subdomain')) newForm.subdomain = value.toLowerCase().replace(/ /g, '-');
      else if (key.includes('alamat')) newForm.alamat = value;
      else if (key.includes('no wa') || key.includes('no_hp') || key.includes('wa_number')) newForm.wa_number = value;
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
      const resRegister = await fetch(`${API_URL}/admin/register-showroom`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const resRegData = await resRegister.json();
      if (!resRegister.ok) throw new Error(resRegData.detail || 'Gagal register akun')

      alert(`Registrasi Berhasil! Anak web lu: ${form.subdomain}.otopadang.com`) // <--- UDAH FIX
      router.push('/login')
    } catch (err) {
      alert(`Error: ${err.message}`)
      console.error("Detail Error:", err)
    }
    setLoading(false)
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Daftar Sewa Web Showroom</h1>
      <p className="text-gray-600 mb-4">Dapat Anak Web khusus + Max 25 Mobil</p>
      <p className="text-xs text-gray-400 mb-2">Tip: Copas 1 blok data terus Ctrl+V di area form</p>

      <form onSubmit={handleSubmit} onPaste={handlePaste} className="flex flex-col gap-4">
        <h2 className="font-bold text-lg border-b pb-2">Data Showroom</h2>
        <input name="nama_showroom" value={form.nama_showroom} placeholder="Nama Showroom" onChange={handleChange} className="border p-2 rounded" required />
        <input name="subdomain" value={form.subdomain} placeholder="Slug Anak Web: contoh bintang-motor" onChange={handleChange} className="border p-2 rounded" required />
        <textarea name="alamat" value={form.alamat} placeholder="Alamat Lengkap" onChange={handleChange} className="border p-2 rounded" required />
        <input name="wa_number" value={form.wa_number} placeholder="No WA Showroom" onChange={handleChange} className="border p-2 rounded" required />
        <input name="logo" value={form.logo} placeholder="Link Logo" onChange={handleChange} className="border p-2 rounded" />
        <textarea name="deskripsi" value={form.deskripsi} placeholder="Deskripsi" onChange={handleChange} className="border p-2 rounded" />

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
