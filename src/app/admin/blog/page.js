'use client'
import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

const API_URL = "https://otopadang-api.up.railway.app"
const CLOUD_NAME = "jh0ct5rz"
const UPLOAD_PRESET = "otopadang_preset"

export default function KelolaBlogPage() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const [form, setForm] = useState({
    judul: "",
    konten: "",
    gambar_cover: "",
    kategori: "Tips",
    meta_description: "",
    is_sponsored: false,
    nama_pengiklan: "",
    link_pengiklan: "",
    banner_iklan: "",
    penulis: "Admin"
  })
  const [token, setToken] = useState("")
  const router = useRouter()

  useEffect(() => {
    const t = localStorage.getItem("token")
    if (!t) { alert("Lu belum login admin!"); router.push("/login-admin"); return }
    setToken(t)
  }, [router])

  useEffect(() => { if (token) fetchBlogs() }, [token])

  const fetchBlogs = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API_URL}/blog/admin`, { headers: {Authorization: `Bearer ${token}`} })
      setBlogs(res.data)
    } catch (err) {
      alert("Gagal ambil data blog. Token kadaluarsa")
      router.push("/login-admin")
    }
    setLoading(false)
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if(!file) return;
    setUploading(true)
    const data = new FormData()
    data.append('file', file)
    data.append('upload_preset', UPLOAD_PRESET)
    data.append('folder', 'otopadang/blog')
    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, data)
      setForm({...form, gambar_cover: res.data.secure_url})
    } catch(err) { alert("Gagal upload gambar") }
    setUploading(false)
  }

  const handleUploadBanner = async (e) => {
    const file = e.target.files[0]
    if(!file) return;
    setUploadingBanner(true)
    const data = new FormData()
    data.append('file', file)
    data.append('upload_preset', UPLOAD_PRESET)
    data.append('folder', 'otopadang/iklan')
    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, data)
      setForm({...form, banner_iklan: res.data.secure_url})
    } catch(err) { alert("Gagal upload banner") }
    setUploadingBanner(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!form.judul ||!form.konten) return alert("Judul dan Konten wajib diisi")

    // BODY DISESUAIKAN 100% SAMA DB
    const body = {
      judul: form.judul,
      konten: form.konten,
      kategori: form.kategori,
      gambar_cover: form.gambar_cover || "",
      meta_description: form.meta_description || "",
      is_sponsored: form.is_sponsored? 1 : 0, // DB lu tinyint(1)
      nama_pengiklan: form.nama_pengiklan || "",
      link_pengiklan: form.is_sponsored && form.nama_pengiklan? `https://wa.me/${form.nama_pengiklan}` : "",
      banner_iklan: form.banner_iklan || "",
      penulis: form.penulis,
      status: "draft",
      slug: "" // KIRIM KOSONG, BIAR BE GENERATE
    }

    console.log("BODY YANG DIKIRIM:", body)

    try {
      await axios.post(`${API_URL}/blog/`, body, { headers: {Authorization: `Bearer ${token}`} })
      alert("Blog berhasil disimpan sebagai Draft!")
      setForm({judul: "", konten: "", gambar_cover: "", kategori: "Tips", meta_description: "", is_sponsored: false, nama_pengiklan: "", link_pengiklan: "", banner_iklan: "", penulis: "Admin"})
      fetchBlogs()
    } catch (err) {
      console.log("DETAIL ERROR:", err.response?.data)
      // KALAU DI HP GAK ADA CONSOLE, PAKE INI BIAR KELUAR ERRORNYA
      alert(JSON.stringify(err.response?.data, null, 2))
    }
  }

  return (
    <div className="p-6 bg-[#0B0B0F] min-h-screen text-white">
      <h1 className="text-2xl font-bold text-yellow-400 mb-4">Kelola Blog OtoPadang</h1>

      <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg mb-6 space-y-3">
        <input className="w-full p-2 rounded bg-gray-700 outline-none" placeholder="Judul Artikel" value={form.judul} onChange={e=>setForm({...form, judul: e.target.value})} required />
        <textarea className="w-full p-2 rounded bg-gray-700 outline-none" placeholder="Isi Artikel Otomotif & Properti" rows={8} value={form.konten} onChange={e=>setForm({...form, konten: e.target.value})} required />

        <div>
          <label className="block mb-1 text-sm">Upload Gambar Cover</label>
          <input type="file" accept="image/*" onChange={handleUpload} className="w-full p-2 rounded bg-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-yellow-400 file:text-black file:font-bold"/>
          {uploading && <p className="text-yellow-400 text-sm mt-1">Uploading...</p>}
          {form.gambar_cover && <img src={form.gambar_cover} className="w-full h-40 object-cover rounded mt-2"/>}
        </div>

        <input className="w-full p-2 rounded bg-gray-700 outline-none" placeholder="Meta Description SEO 160 karakter" maxLength={160} value={form.meta_description} onChange={e=>setForm({...form, meta_description: e.target.value})} />

        <div className="flex gap-4 items-center">
          <select
            className="w-full p-2 rounded bg-gray-700 outline-none"
            value={form.kategori}
            onChange={e=>setForm({...form, kategori: e.target.value})}
          >
            <option value="Tips">Tips</option>
            <option value="Otomotif">Otomotif</option>
            <option value="Properti">Properti</option>
            <option value="Berita">Berita</option>
          </select>
          <label className="flex items-center gap-2 whitespace-nowrap">
            <input type="checkbox" checked={form.is_sponsored} onChange={e=>setForm({...form, is_sponsored: e.target.checked})} />
            <span>Iklan?</span>
          </label>
        </div>

        {form.is_sponsored && (
          <div className="space-y-2 p-3 bg-gray-700 rounded border border-yellow-500">
            <input className="w-full p-2 rounded bg-gray-600 outline-none" placeholder="Nomor WA Endorse. Contoh: 628123456789" value={form.nama_pengiklan} onChange={e=>setForm({...form, nama_pengiklan: e.target.value})} />
            <div>
              <label className="block mb-1 text-sm">Upload Banner Iklan 728x90</label>
              <input type="file" accept="image/*" onChange={handleUploadBanner} className="w-full p-2 rounded bg-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:bg-yellow-400 file:text-black file:font-bold"/>
              {uploadingBanner && <p className="text-yellow-400 text-sm mt-1">Uploading banner...</p>}
              {form.banner_iklan && <img src={form.banner_iklan} className="h-12 mt-2 rounded"/>}
            </div>
          </div>
        )}

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
