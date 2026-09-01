'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Poppins, Playfair_Display } from 'next/font/google'
import {
  ShieldCheck, Car, Home, FileText, Building2,
  LogOut, Check, Flame, Crown, Trash2, DollarSign,
  Loader2, RefreshCw, AlertTriangle, Sun, Moon
} from 'lucide-react'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'] })

const API_URL = 'https://otopadang-api.vercel.app' // UDAH HARDCODE

export default function AdminPage() {
  const [token, setToken] = useState('')
  const [theme, setTheme] = useState('dark') // dark | light
  const [allMobil, setAllMobil] = useState([])
  const [allRumah, setAllRumah] = useState([])
  const [allBlog, setAllBlog] = useState([])
  const [showrooms, setShowrooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // THEME LOGIC
  useEffect(() => {
    const savedTheme = localStorage.getItem('admin_theme') || 'dark'
    setTheme(savedTheme)
  }, [])
  const toggleTheme = () => {
    const newTheme = theme === 'dark'? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('admin_theme', newTheme)
  }
  const bg = theme === 'dark'? 'bg-[#0B0B0F]' : 'bg-[#F8F9FA]'
  const card = theme === 'dark'? 'bg-[#1a1a20]/60 border-gray-800' : 'bg-white/70 border-gray-200'
  const text = theme === 'dark'? 'text-white' : 'text-gray-800'
  const textMuted = theme === 'dark'? 'text-gray-400' : 'text-gray-500'

  // INI YG DI FIX - TAMBAH HEADER
  const fetchWithTimeout = async (url, t, timeout = 20000) => {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)
    try {
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${t}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        signal: controller.signal,
        cache: 'no-store'
      })
      clearTimeout(id)
      if(!res.ok) {
        const txt = await res.text()
        throw new Error(`${url.split('/').pop()} ${res.status}: ${txt.slice(0,100)}`)
      }
      return await res.json()
    } catch(e) {
      clearTimeout(id)
      throw e
    }
  }

  const fetchData = useCallback(async (t) => {
    setLoading(true)
    setError('')
    const safetyTimer = setTimeout(() => setLoading(false), 22000)

    try {
      let mobil = [], showroom = [], rumah = [], blog = []

      const fetchRetry = async (endpoint, name) => {
        try { return await fetchWithTimeout(`${API_URL}${endpoint}`, t) }
        catch(e1){
          await new Promise(r => setTimeout(r, 2000))
          try { return await fetchWithTimeout(`${API_URL}${endpoint}`, t) }
          catch(e2){
            setError(prev => prev + ` | ${name}: ${e2.message}`)
            return []
          }
        }
      }

      [mobil, showroom, rumah, blog] = await Promise.all([
        fetchRetry('/admin/mobil/', 'Mobil'), // FIX 1: TAMBAH /
        fetchRetry('/admin/showroom', 'Showroom'),
        fetchRetry('/admin/rumah', 'Rumah'),
        fetchRetry('/admin/blog', 'Blog'),
      ])

      setAllMobil(Array.isArray(mobil)? mobil : [])
      setShowrooms(Array.isArray(showroom)? showroom : [])
      setAllRumah(Array.isArray(rumah)? rumah : [])
      setAllBlog(Array.isArray(blog)? blog : [])

      if(!mobil.length &&!showroom.length &&!rumah.length) {
        setError('Data masih 0. Cek: 1. Role admin 2. Vercel lagi bangun. Pencet Refresh 1x lagi')
      }

    } catch (err) {
      setError(err.message)
    } finally {
      clearTimeout(safetyTimer)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const t = localStorage.getItem('token')
    if (!t) {
      window.location.href = '/login-admin'
      return
    }
    setToken(t)
    fetchData(t)
  }, [fetchData])

  const handleApproveMobil = async (id) => {
    if(!confirm('Approve mobil ini?')) return
    const res = await fetch(`${API_URL}/admin/mobil/${id}/approve`, { // FIX: TAMBAH /approve
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    })
    if(res.ok) fetchData(token); else alert(await res.text())
  }

  const handleSoldMobil = async (id) => {
    if(!confirm('Tandai mobil ini SOLD?')) return
    const res = await fetch(`${API_URL}/admin/mobil/${id}/sold`, { // FIX: PINDAH KE /sold
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    })
    if(res.ok) fetchData(token); else alert(await res.text())
  }

  const handleDeleteMobil = async (id) => {
    if(!confirm('HAPUS PERMANEN? Data tidak bisa dikembalikan!')) return
    const res = await fetch(`${API_URL}/admin/mobil/${id}`, {
      method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
    })
    if(res.ok) fetchData(token); else alert(await res.text())
  }

  const handleTerjualRumah = async (id) => {
    if(!confirm('Tandai rumah ini TERJUAL?')) return
    const res = await fetch(`${API_URL}/admin/rumah/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'terjual' })
    })
    if(res.ok) fetchData(token); else alert(await res.text())
  }

  const handleDeleteRumah = async (id) => {
    if(!confirm('HAPUS PERMANEN RUMAH?')) return
    const res = await fetch(`${API_URL}/admin/rumah/${id}`, {
      method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
    })
    if(res.ok) fetchData(token); else alert(await res.text())
  }

  const handleApproveShowroom = async (id) => {
    if(!confirm('Approve showroom ini?')) return
    const res = await fetch(`${API_URL}/admin/showroom/${id}/approve`, {
      method: 'PUT', headers: { 'Authorization': `Bearer ${token}` }
    })
    if(res.ok) fetchData(token); else alert(await res.text())
  }

  const handleSetPremium = async (id) => {
    if(!confirm('Jadikan Premium?')) return
    const res = await fetch(`${API_URL}/admin/showroom/${id}/premium`, {
      method: 'PUT', headers: { 'Authorization': `Bearer ${token}` }
    })
    if(res.ok) fetchData(token); else alert(await res.text())
  }

  const handleLogout = () => {
    localStorage.clear()
    document.cookie = "token=; path=/; max-age=0"
    window.location.href = '/login-admin'
  }

  if(loading) return (
    <div className={`${bg} ${text} min-h-screen flex flex-col items-center justify-center gap-4 ${poppins.className}`}>
      <Loader2 className="w-10 h-10 animate-spin text-yellow-400"/>
      <p className="animate-pulse font-semibold">Loading Panel Admin...</p>
      <button onClick={handleLogout} className="mt-4 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2"><LogOut size={18}/> Force Logout</button>
    </div>
  )

  const mobilPending = allMobil.filter(m => m.status === 'pending')
  const mobilApproved = allMobil.filter(m => m.status === 'approved')
  const mobilSold = allMobil.filter(m => m.status_jual === 'sold') // FIX 3: filter status_jual
  const rumahAktif = allRumah.filter(r => r.status!== 'terjual')

  const StatusBadge = ({status}) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      approved: 'bg-green-500/20 text-green-400 border-green-500/30',
      sold: 'bg-blue-500/20 text-blue-400 border-blue-500/30', // FIX: sold
      terjual: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    }
    return <span className={`px-2 py-1 text-xs font-bold rounded-full border backdrop-blur-sm ${colors[status] || colors.pending}`}>{status?.toUpperCase()}</span>
  }

  return (
    <div className={`${bg} ${text} min-h-screen ${poppins.className} transition-colors duration-300`}>
      <div className="p-6 md:p-10">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-700/30 pb-4">
          <h1 className={`text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent ${playfair.className}`}>
            <ShieldCheck size={32} className="inline-block mr-2 text-yellow-400"/> OTO PADANG ADMIN
          </h1>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className={`${card} p-2 rounded-lg backdrop-blur-sm`}>
              {theme === 'dark'? <Sun size={20}/> : <Moon size={20}/>}
            </button>
            <button onClick={handleLogout} className="bg-red-600/20 hover:bg-red-600 border-red-500/30 px-5 py-2 rounded-lg font-semibold transition flex items-center gap-2 backdrop-blur-sm">
              <LogOut size={18}/> Logout
            </button>
          </div>
        </div>

        {error && <div className="bg-red-900/50 border-red-500 p-3 rounded-lg mb-4 flex items-center gap-2 backdrop-blur-sm"><AlertTriangle size={18}/> {error} <button onClick={()=>fetchData(token)} className="ml-2 bg-white text-black px-2 py-1 rounded text-xs flex items-center gap-1"><RefreshCw size={12}/> Refresh</button></div>}

        {/* STATS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className={`${card} p-5 rounded-2xl shadow-lg backdrop-blur-sm hover:scale-[1.02] transition`}>
            <p className={`${textMuted} text-sm flex items-center gap-2`}><Car size={16}/> Total Mobil</p>
            <p className="text-3xl font-bold mt-2">{allMobil.length}</p>
            <p className="text-xs text-yellow-400 mt-1">{mobilPending.length} pending</p>
          </div>
          <div className={`${card} p-5 rounded-2xl shadow-lg backdrop-blur-sm hover:scale-[1.02] transition`}>
            <p className={`${textMuted} text-sm flex items-center gap-2`}><Building2 size={16}/> Showroom</p>
            <p className="text-3xl font-bold mt-2">{showrooms.length}</p>
          </div>
          <div className={`${card} p-5 rounded-2xl shadow-lg backdrop-blur-sm hover:scale-[1.02] transition`}>
            <p className={`${textMuted} text-sm flex items-center gap-2`}><Home size={16}/> Rumah</p>
            <p className="text-3xl font-bold mt-2">{allRumah.length}</p>
          </div>
          <div className={`${card} p-5 rounded-2xl shadow-lg backdrop-blur-sm hover:scale-[1.02] transition`}>
            <p className={`${textMuted} text-sm flex items-center gap-2`}><FileText size={16}/> Blog</p>
            <p className="text-3xl font-bold mt-2">{allBlog.length}</p>
          </div>
        </div>

        {/* MOBIL PENDING */}
        <div className="mb-8 p-6 border-yellow-500/30 rounded-2xl bg-gradient-to-br from-yellow-900/10 to-transparent backdrop-blur-sm">
          <h2 className="text-xl font-bold mb-4 text-yellow-400 flex items-center gap-2"><Flame size={20}/> Review Mobil Baru ({mobilPending.length})</h2>
          {mobilPending.length === 0? <p className={textMuted}>Tidak ada mobil baru - Total di DB: {allMobil.length}</p> :
            mobilPending.slice(0, 10).map(m => (
              <div key={m.id} className={`${card} p-4 rounded-xl mb-3 flex flex-col md:flex-row justify-between items-start md:items-center backdrop-blur-sm hover:bg-opacity-80 transition`}>
                <div className="flex gap-3 w-full">
                  <img src={m.foto_url_1 || m.foto_url || 'https://via.placeholder.com/100x100.png?text=No+Image'} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" alt={m.nama_mobil} />
                  <div className="flex-1">
                    <p className="font-bold text-lg">{m.merek} {m.nama_mobil} {m.tahun}</p>
                    <p className={`text-sm ${textMuted}`}>Dari: {m.showroom_nama} | ID: {m.id}</p>
                    <p className="text-yellow-400 font-bold">Rp{(m.harga || 0).toLocaleString('id-ID')}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 md:mt-0 w-full md:w-auto">
                  <button onClick={() => handleApproveMobil(m.id)} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 flex-1"><Check size={16}/> Approve</button>
                  <button onClick={() => handleDeleteMobil(m.id)} className="bg-red-600/50 hover:bg-red-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2 flex-1"><Trash2 size={16}/> Delete</button>
                </div>
              </div>
            ))
          }
        </div>

        {/* MOBIL AKTIF */}
        <div className="mb-8 p-6 border-green-500/30 rounded-2xl bg-gradient-to-br from-green-900/10 to-transparent backdrop-blur-sm">
          <h2 className="text-xl font-bold mb-4 text-green-400 flex items-center gap-2"><Check size={20}/> Mobil Aktif ({mobilApproved.length})</h2>
          {mobilApproved.slice(0, 5).map(m => (
            <div key={m.id} className={`${card} p-4 rounded-xl mb-3 flex flex-col md:flex-row justify-between items-start md:items-center backdrop-blur-sm`}>
              <div className="flex gap-3">
                <img src={m.foto_url_1 || m.foto_url || 'https://via.placeholder.com/80x80.png'} className="w-16 h-16 rounded-lg object-cover" />
                <div>
                  <p className="font-bold">{m.merek} {m.nama_mobil}</p>
                  <p className={`text-sm ${textMuted}`}>Dari: {m.showroom_nama}</p>
                  <div className="flex items-center gap-2 mt-1"><StatusBadge status={m.status}/></div>
                </div>
              </div>
              <button onClick={() => handleSoldMobil(m.id)} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 mt-3 md:mt-0"><DollarSign size={16}/> Tandai SOLD</button>
            </div>
          ))}
        </div>

        {/* MENU */}
        <h2 className={`text-xl font-bold mb-4 ${playfair.className}`}>Menu Lainnya</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/admin/upload-rumah" className={`${card} p-4 rounded-xl hover:border-yellow-400 hover:bg-yellow-400/10 transition flex-col items-center gap-2 backdrop-blur-sm`}><Home size={24}/> <h2 className="font-bold">Upload Rumah</h2></Link>
          <Link href="/admin/blog" className={`${card} p-4 rounded-xl hover:border-yellow-400 hover:bg-yellow-400/10 transition flex flex-col items-center gap-2 backdrop-blur-sm`}><FileText size={24}/> <h2 className="font-bold">Kelola Blog</h2></Link>
          <Link href="/admin/register-showroom" className={`${card} p-4 rounded-xl hover:border-yellow-400 hover:bg-yellow-400/10 transition flex-col items-center gap-2 backdrop-blur-sm`}><Building2 size={24}/> <h2 className="font-bold">Daftar Showroom</h2></Link>
          <Link href="/admin/approve-showroom" className={`${card} p-4 rounded-xl hover:border-yellow-400 hover:bg-yellow-400/10 transition flex-col items-center gap-2 backdrop-blur-sm`}><ShieldCheck size={24}/> <h2 className="font-bold">Approve Showroom</h2></Link>
        </div>
      </div>
    </div>
  )
}
