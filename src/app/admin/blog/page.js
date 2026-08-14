'use client'
import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

const API_URL = "https://otopadang-api.up.railway.app"

export default function KelolaBlogPage() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    judul: "", 
    konten: "", // ganti dari "isi"
    gambar_cover: "", // ganti dari "gambar"
    kategori: "Tips",
    meta_description: "",
    is_sponsored: false
  })
  const [token, setToken] = useState("")
  const router = useRouter()

  useEffect(() => {
    const t = localStorage.getItem("token")
    if (!t) {
      alert("Lu belum login admin!")
      router.push("/login-admin")
      return
    }
    setToken(t)
  }, [router])

  useEffect(() => {
    if (!token) return;
    fetchBlogs()
  }, [token, router])

  const fetchBlogs = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API_URL}/blog/admin`, {
        headers: {Authorization: `Bearer ${token}`}
      })
      setBlogs(res.data)
    } catch (err) {
      console.log(err)
      alert("Gagal ambil data blog. Token kadaluarsa")
      router.push("/login-admin")
    }
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!form.judul ||!form.konten) return alert("Judul dan Konten wajib diisi")

    try {
      await axios.post(`${API_URL}/blog/`, form, {
        headers: {Authorization: `Bearer ${token}`}
      })
      alert("Blog berhasil disimpan sebagai Draft!")
      setForm({judul: "", konten: "", gambar_cover: "", kategori: "Tips", meta_description: "", is_sponsored: false})
      fetchBlogs() // fetch ulang
    } catch (err) {
      alert("Gagal publish blog. Cek console")
      console.log(err.response.data)
    }
  }

  return (
    <div className="p-6 bg-[#0B0B0F] min-h-screen text-white">
      <h1 className="text-2xl font-bold text-yellow-400 mb-4">Kelola Blog OtoPadang</h1>

      <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg mb-6 space-y-3">
        <input className="w-full p-2 rounded bg-gray-700 outline-none" placeholder="Judul Artikel" value={form.judul} onChange={e=>setForm({...form, judul: e.target.value})} required />
        <textarea className="w-full p-2 rounded bg-gray-700 outline-none" placeholder="Isi Artikel Otomotif & Properti" rows={8} value={form.konten} onChange={e=>setForm({...form, konten: e.target.value})} required />
        <input className="w-full p-2 rounded bg-gray-700 outline-none" placeholder="Link Gambar Cover" value={form.gambar_cover} onChange={e=>setForm({...form, gambar_cover: e.target.value})} />
        <input className="w-full p-2 rounded bg-gray-700 outline-none" placeholder="Meta Description SEO 160 karakter" maxLength={160} value={form.meta_description} onChange={e=>setForm({...form, meta_description: e.target.value})} />
        <div className="flex gap-4">
          <select className="w-full p-2 rounded bg-gray-700 outline-none" value={form.kategori} onChange={e=>setForm({...form, kategori: e.target.value})}>
            <option>Tips</option>
            <option>Otomotif</option>
            <option>Properti</option>
            <option>Berita</option>
          </select>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.is_sponsored} onChange={e=>setForm({...form, is_sponsored: e.target.checked})} />
            <span>Iklan?</span>
          </label>
        </div>
        <button className="bg-yellow-400 text-black px-5 py-2 rounded font-bold hover:bg-yellow-500 w-full">
          + Simpan Draft
        </button>
      </form>

      <h2 className="text-xl font-bold mb-2">Daftar Artikel</h2>
      {loading? <p>Loading...</p> : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead><tr className="border-b border-gray-700"><th className="p-2">Judul</th><th className="p-2">Kategori</th><th className="p-2">Status</th></tr></thead>
            <tbody>
              {blogs.length === 0? (<tr><td colSpan={3} className="p-2 text-gray-400">Belum ada artikel. Publish yg pertama!</td></tr>) :
              blogs.map(b => (
                <tr key={b.id} className="border-b border-gray-800 hover:bg-gray-800">
                  <td className="p-2">{b.judul}</td>
                  <td className="p-2">{b.kategori}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs ${b.status === 'published'? 'bg-green-600' : 'bg-yellow-600'}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
