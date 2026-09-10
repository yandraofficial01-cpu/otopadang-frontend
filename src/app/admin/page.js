'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Poppins, Playfair_Display } from 'next/font/google'
import {
  ShieldCheck, Car, Home, FileText, Building2,
  LogOut, Check, Flame, Crown, Trash2, DollarSign,
  Loader2, RefreshCw, AlertTriangle, Sun, Moon, Eye
} from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL // harusnya https://otopadang-api.vercel.app

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'] })

export default function AdminPage() {
  const router = useRouter()
  const [theme, setTheme] = useState('dark')
  const [allMobil, setAllMobil] = useState([])
  const [allRumah, setAllRumah] = useState([])
  const [allBlog, setAllBlog] = useState([])
  const [showrooms, setShowrooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const savedTheme = localStorage.getItem('admin_theme') || 'dark'
    setTheme(savedTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('admin_theme', newTheme)
  }

  const bg = theme === 'dark' ? 'bg-[#0B0B0F]' : 'bg-[#F8F9FA]'
  const card = theme === 'dark' ? 'bg-[#1a1a20]/60 border-gray-800' : 'bg-white/70 border-gray-200'
  const text = theme === 'dark' ? 'text-white' : 'text-gray-800'
  const textMuted = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'

  const fetchWithTimeout = async (url, timeout = 20000) => {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)
    try {
      const res = await fetch(`${API_URL}${url}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        signal: controller.signal, cache: 'no-store'
      })
      clearTimeout(id)
      if(!res.ok) {
        if(res.status === 401) router.push('/login-admin')
        const txt = await res.text()
        throw new Error(`${url.split('/').pop()} ${res.status}: ${txt.slice(0,100)}`)
      }
      return await res.json()
    } catch(e) { clearTimeout(id); throw e }
  }

  const fetchData = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const [mobil, showroom, rumah, blog] = await Promise.all([
        fetchWithTimeout('/admin/mobil/'),
        fetchWithTimeout('/admin/showroom/'),
        fetchWithTimeout('/admin/rumah/'),
        fetchWithTimeout('/admin/blog/'),
      ])
      setAllMobil(Array.isArray(mobil) ? mobil : [])
      setShowrooms(Array.isArray(showroom) ? showroom : [])
      setAllRumah(Array.isArray(rumah) ? rumah : [])
      setAllBlog(Array.isArray(blog) ? blog : [])
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }, [router])

  useEffect(() => {
    fetch(`${API_URL}/auth/me`, { credentials: 'include' }) // FIX 1: HAPUS /api
    .then(res => { if(!res.ok) router.push('/login-admin') })
    .then(() => fetchData())
    .catch(() => router.push('/login-admin'))
  }, [fetchData, router])

  const handleApproveMobil = async (id) => {
    if(!confirm('Approve mobil ini?')) return
    const res = await fetch(`${API_URL}/admin/mobil/${id}/approve`, { method: 'PUT', credentials: 'include' })
    if(res.ok) fetchData(); else alert(await res.text())
  }
  const handleSoldMobil = async (id) => {
    if(!confirm('Tandai mobil ini SOLD?')) return
    const res = await fetch(`${API_URL}/admin/mobil/${id}/sold`, { method: 'PUT', credentials: 'include' })
    if(res.ok) fetchData(); else alert(await res.text())
  }
  const handleDeleteMobil = async (id) => {
    if(!confirm('HAPUS PERMANEN?')) return
    const res = await fetch(`${API_URL}/admin/mobil/${id}`, { method: 'DELETE', credentials: 'include' })
    if(res.ok) fetchData(); else alert(await res.text())
  }
  const handleTerjualRumah = async (id) => {
    if(!confirm('Tandai rumah ini TERJUAL?')) return
    const res = await fetch(`${API_URL}/admin/rumah/${id}`, {
      method: 'PUT', 
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'terjual' }) 
    })
    if(res.ok) fetchData(); else alert(await res.text())
  }
  const handleDeleteRumah = async (id) => {
    if(!confirm('HAPUS PERMANEN RUMAH?')) return
    const res = await fetch(`${API_URL}/admin/rumah/${id}`, { method: 'DELETE', credentials: 'include' })
    if(res.ok) fetchData(); else alert(await res.text())
  }
  const handleApproveShowroom = async (id) => {
    if(!confirm('Approve showroom ini?')) return
    const res = await fetch(`${API_URL}/admin/showroom/${id}/approve`, { method: 'PUT', credentials: 'include' })
    if(res.ok) fetchData(); else alert(await res.text())
  }
  const handleSetPremium = async (id) => {
    if(!confirm('Jadikan Premium?')) return
    const res = await fetch(`${API_URL}/admin/showroom/${id}/premium`, { method: 'PUT', credentials: 'include' })
    if(res.ok) fetchData(); else alert(await res.text())
  }
  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' }) // FIX 2: HAPUS /api
    } catch(e) {}
    finally {
      document.cookie = "admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.vercel.app;"
      document.cookie = "showroom_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.vercel.app;"
      router.push('/login-admin')
    }
  }

  if(loading) return ( 
    <div className={`${bg} ${text} min-h-screen flex items-center justify-center gap-4 ${poppins.className}`}>
      <Loader2 className="w-10 h-10 animate-spin text-yellow-400"/>
      <p>Loading Panel Admin...</p>
    </div> 
  )

  const mobilPending = allMobil.filter(m => m.status === 'pending')
  const mobilApproved = allMobil.filter(m => m.status === 'approved')
  const mobilSold = allMobil.filter(m => m.status_jual === 'sold')
  const rumahAktif = allRumah.filter(r => r.status !== 'terjual')
  const rumahTerjual = allRumah.filter(r => r.status === 'terjual')

  const StatusBadge = ({status}) => { 
    const colors = { 
      pending: 'bg-yellow-500/20 text-yellow-400', 
      approved: 'bg-green-500/20 text-green-400', 
      sold: 'bg-blue-500/20 text-blue-400', 
      terjual: 'bg-purple-500/20 text-purple-400', 
      available: 'bg-green-500/20 text-green-400', 
      rejected: 'bg-red-500/20 text-red-400', 
    }; 
    return <span className={`px-2 py-1 text-xs font-bold rounded-full border ${colors[status] || colors.pending}`}>{status?.toUpperCase()}</span> 
  }

  return (
    <div className={`${bg} ${text} min-h-screen ${poppins.className} transition-colors duration-300`}>
      <header className={`${card} backdrop-blur-xl sticky top-0 z-50 p-4 flex justify-between items-center`}>
        <h1 className={`${playfair.className} text-2xl font-bold`}>Admin Panel</h1>
        <div className="flex gap-2">
          <button onClick={toggleTheme} className="p-2 rounded-lg border">{theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}</button>
          <button onClick={fetchData} className="p-2 rounded-lg border"><RefreshCw size={18}/></button>
          <button onClick={handleLogout} className="p-2 rounded-lg border bg-red-500/20"><LogOut size={18}/></button>
        </div>
      </header>

      <main className="p-4 md:p-8 grid-cols-1 lg:grid-cols-2 gap-6">
        {error && <div className="col-span-full bg-red-500/20 p-4 rounded-xl flex items-center gap-2"><AlertTriangle/> {error}</div>}
        
        <section className={`${card} backdrop-blur-xl rounded-2xl p-6`}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Car/> Mobil</h2>
          <p className={textMuted}>Pending: {mobilPending.length} | Approved: {mobilApproved.length} | Sold: {mobilSold.length}</p>
          <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
            {allMobil.length === 0 && <p className={textMuted}>Belum ada data</p>}
            {allMobil.map(m => (
              <div key={m.id} className="flex justify-between items-center p-2 border-b border-gray-700/50">
                <div>
                  <p className="font-semibold">{m.merk} {m.model}</p>
                  <StatusBadge status={m.status}/>
                </div>
                <div className="flex gap-2">
                  {m.status === 'pending' && <button onClick={() => handleApproveMobil(m.id)} className="bg-green-600 px-3 py-1 rounded-lg text-xs">Approve</button>}
                  {m.status === 'approved' && <button onClick={() => handleSoldMobil(m.id)} className="bg-blue-600 px-3 py-1 rounded-lg text-xs">Sold</button>}
                  <button onClick={() => handleDeleteMobil(m.id)} className="bg-red-600 px-3 py-1 rounded-lg text-xs"><Trash2 size={14}/></button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={`${card} backdrop-blur-xl rounded-2xl p-6`}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Home/> Rumah</h2>
          <div className="flex justify-between items-center mb-2">
            <p className={textMuted}>Aktif: {rumahAktif.length} | Terjual: {rumahTerjual.length}</p>
            <Link href="/admin/upload-rumah" className="text-xs bg-blue-600 px-3 py-1 rounded-lg flex items-center gap-1"><Eye size={14}/>Kelola</Link>
          </div>
          <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
            {rumahAktif.length === 0 && <p className={textMuted}>Belum ada data</p>}
            {rumahAktif.map(r => (
              <div key={r.id} className="flex justify-between items-center p-2 border-b border-gray-700/50">
                <div>
                  <p className="font-semibold">{r.nama_rumah}</p>
                  <StatusBadge status={r.status}/>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleTerjualRumah(r.id)} className="bg-green-600 px-3 py-1 rounded-lg text-xs">Jual</button>
                  <button onClick={() => handleDeleteRumah(r.id)} className="bg-red-600 px-3 py-1 rounded-lg text-xs"><Trash2 size={14}/></button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={`${card} backdrop-blur-xl rounded-2xl p-6`}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Building2/> Showroom</h2>
          <div className="flex justify-between items-center mb-2">
            <p className={textMuted}>Total: {showrooms.length} | Pending: {showrooms.filter(s => s.status === 'pending').length}</p>
            <Link href="/admin/approve-showroom" className="text-xs bg-blue-600 px-3 py-1 rounded-lg flex items-center gap-1"><Eye size={14}/>Kelola</Link>
          </div>
          <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
            {showrooms.length === 0 && <p className={textMuted}>Belum ada data</p>}
            {showrooms.map(s => (
              <div key={s.id} className="flex justify-between items-center p-2 border-b border-gray-700/50">
                <div>
                  <p className="font-semibold">{s.nama_showroom}</p>
                  <StatusBadge status={s.status}/>
                  {s.is_premium && <span className="ml-2 text-yellow-400"><Crown size={14} className="inline"/></span>}
                </div>
                <div className="flex gap-2">
                  {s.status === 'pending' && <button onClick={() => handleApproveShowroom(s.id)} className="bg-green-600 px-3 py-1 rounded-lg text-xs">Approve</button>}
                  <button onClick={() => handleSetPremium(s.id)} className="bg-yellow-600 px-3 py-1 rounded-lg text-xs"><Crown size={14}/></button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={`${card} backdrop-blur-xl rounded-2xl p-6`}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText/> Blog</h2>
          <div className="flex justify-between items-center mb-2">
            <p className={textMuted}>Total Artikel: {allBlog.length}</p>
            <Link href="/admin/blog" className="text-xs bg-blue-600 px-3 py-1 rounded-lg flex items-center gap-1"><Eye size={14}/>Kelola</Link>
          </div>
          <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
            {allBlog.length === 0 && <p className={textMuted}>Belum ada data</p>}
            {allBlog.map(b => (
              <div key={b.id} className="p-2 border-b border-gray-700/50">
                <p className="font-semibold">{b.judul}</p>
                <StatusBadge status={b.status}/>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
