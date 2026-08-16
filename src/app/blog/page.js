'use client'
import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"

const API_URL = "https://otopadang-api.up.railway.app"

// Fungsi buat hapus tag HTML dari konten
const stripHtml = (html) => {
  if (!html) return ""
  return html.replace(/<[^>]*>/g, '')
}

export default function BlogPage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // FIX: TAMBAH / DI AKHIR
    axios.get(`${API_URL}/blog/`) // endpoint public, cuma ambil yg status=published
      .then(res => {
        setArticles(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return "Draft"
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    })
  }

  if (loading) return (
    <div className="bg-[#0B0B0F] min-h-screen text-white">
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-yellow-400">Blog OTO PADANG</h1>
        <p className="mb-8 text-gray-400">Loading artikel...</p>
        <div className="space-y-6">
          {[1,2,3].map(i => (
            <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-6 animate-pulse">
              <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-[#0B0B0F] min-h-screen text-white">
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-yellow-400">Blog OTO PADANG</h1>
        <p className="mb-8 text-gray-400">Tips, berita, dan panduan jual beli rumah & mobil di Padang</p>
        
        {articles.length === 0 ? (
          <div className="text-center py-20 bg-gray-800 rounded-lg">
            <p className="text-gray-500 text-lg">Belum ada artikel. Admin lagi nulis bro 🔥</p>
          </div>
        ) : (
          <div className="space-y-6">
            {articles.map((article) => (
              <div key={article.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-yellow-400 transition-all hover:shadow-lg hover:shadow-yellow-400/10">
                <div className="flex gap-4">
                  {article.gambar_cover && (
                    <img 
                      src={article.gambar_cover} 
                      alt={article.judul}
                      className="w-32 h-24 object-cover rounded-md hidden sm:block flex-shrink-0"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs bg-yellow-400 text-black px-2 py-1 rounded font-bold">{article.kategori}</span>
                      <p className="text-sm text-gray-500">Oleh {article.penulis} • {formatDate(article.published_at)}</p>
                    </div>
                    <h2 className="text-xl font-bold mt-1 hover:text-yellow-400 transition-colors">
                      <Link href={`/blog/${article.slug}`}>
                        {article.judul}
                      </Link>
                    </h2>
                    <p className="text-gray-400 mt-2 line-clamp-2">
                      {article.meta_description || stripHtml(article.konten).substring(0, 150) + '...'}
                    </p>
                    <Link href={`/blog/${article.slug}`} className="text-yellow-400 mt-3 inline-block font-semibold hover:underline">
                      Baca Selengkapnya →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
