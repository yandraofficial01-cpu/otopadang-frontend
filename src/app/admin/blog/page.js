'use client'
import { useEffect, useState } from "react"
import axios from "axios"

const API_URL = "https://api.otopadang.com" // ganti ke URL backend lu

export default function KelolaBlogPage() {
  const [blogs, setBlogs] = useState([])
  const [form, setForm] = useState({judul: "", isi: "", gambar: "", kategori: "Tips"})
  const [token] = useState(localStorage.getItem("token")) // ambil token login

  // 1. AMBIL DATA BLOG DARI API
  useEffect(() => {
    axios.get(`${API_URL}/blog/admin`, {
      headers: {Authorization: `Bearer ${token}`}
    }).then(res => setBlogs(res.data))
  }, [token])

  // 2. FUNCTION TAMBAH BLOG
  const handleSubmit = async (e) => {
    e.preventDefault()
    await axios.post(`${API_URL}/blog/`, form, {
      headers: {Authorization: `Bearer ${token}`}
    })
    alert("Blog berhasil dipublish!")
    window.location.reload()
  }

  return (
    <div className="p-6 bg-[#0B0B0F] min-h-screen text-white">
      <h1 className="text-2xl font-bold text-yellow-400 mb-4">Kelola Blog</h1>
      
      {/* FORM TAMBAH BLOG */}
      <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg mb-6 space-y-3">
        <input className="w-full p-2 rounded bg-gray-700" placeholder="Judul" value={form.judul} onChange={e=>setForm({...form, judul: e.target.value})}/>
        <textarea className="w-full p-2 rounded bg-gray-700" placeholder="Isi Artikel" rows={5} value={form.isi} onChange={e=>setForm({...form, isi: e.target.value})}/>
        <input className="w-full p-2 rounded bg-gray-700" placeholder="Link Gambar" value={form.gambar} onChange={e=>setForm({...form, gambar: e.target.value})}/>
        <button className="bg-yellow-400 text-black px-4 py-2 rounded font-bold">+ Publish Artikel</button>
      </form>

      {/* TABEL DAFTAR BLOG */}
      <table className="w-full text-left">
        <thead><tr><th>Judul</th><th>Kategori</th><th>Status</th></tr></thead>
        <tbody>
          {blogs.map(b => (
            <tr key={b.id} className="border-t border-gray-700">
              <td>{b.judul}</td>
              <td>{b.kategori}</td>
              <td>{b.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
