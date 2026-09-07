'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation' // 1. TAMBAH INI
import { Poppins, Playfair_Display } from 'next/font/google'
import {
  ShieldCheck, Car, Home, FileText, Building2,
  LogOut, Check, Flame, Crown, Trash2, DollarSign,
  Loader2, RefreshCw, AlertTriangle, Sun, Moon
} from 'lucide-react'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'] })

// 2. HAPUS INI: const API_URL = 'https://otopadang-api.vercel.app'

export default function AdminPage() {
  // 3. HAPUS INI: const [token, setToken] = useState('')
  const router = useRouter() // 4. TAMBAH INI
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
    const newTheme = theme === 'dark'? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('admin_theme', newTheme)
  }
  const bg = theme === 'dark'? 'bg-[#0B0B0F]' : 'bg-[#F8F9FA]'
  const card = theme === 'dark'? 'bg-[#1a1a20]/60 border border-gray-800' : 'bg-white/70 border-gray-200'
  const text = theme === 'dark'? 'text-white' : 'text-gray-800'
  const textMuted = theme === 'dark'? 'text-gray-400' : 'text-gray-500'

  const fetchWithTimeout = async (url, timeout = 20000) => { // 5. HAPUS PARAM t
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)
    try {
      const res = await fetch(url, {
        credentials: 'include', // 6. TAMBAH INI WAJIB
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        signal: controller.signal, cache: 'no-store'
      })
      clearTimeout(id)
      if(!res.ok) {
        if(res.status === 401) router.push('/login-admin') // 7. AUTO LOGOUT KALO COOKIE MATI
        const txt = await res.text()
        throw new Error(`${url.split('/').pop()} ${res.status}: ${txt.slice(0,100)}`)
      }
      return await res.json()
    } catch(e) { clearTimeout(id); throw e }
  }

  const fetchData = useCallback(async () => { // 8. HAPUS PARAM t
    setLoading(true); setError('')
    try {
      const [mobil, showroom, rumah, blog] = await Promise.all([
        fetchWithTimeout('/api/admin/mobil/').catch(() => []), // 9. UBAH KE /api
        fetchWithTimeout('/api/admin/showroom/').catch(() => []),
        fetchWithTimeout('/api/admin/rumah/').catch(() => []),
        fetchWithTimeout('/api/admin/blog/').catch(() => []),
      ])
      setAllMobil(Array.isArray(mobil)? mobil : [])
      setShowrooms(Array.isArray(showroom)? showroom : [])
      setAllRumah(Array.isArray(rumah)? rumah : [])
      setAllBlog(Array.isArray(blog)? blog : [])
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }, [router])

  useEffect(() => {
    // 10. CEK LOGIN PAKE COOKIE DULU
    fetch('/api/auth/me', { credentials: 'include' })
    .then(res => { if(!res.ok) router.push('/login-admin') })
    .then(() => fetchData())
    .catch(() => router.push('/login-admin'))
  }, [fetchData, router])

  // 11. SEMUA HANDLE UBAH KE /api + credentials
  const handleApproveMobil = async (id) => {
    if(!confirm('Approve mobil ini?')) return
    const res = await fetch(`/api/admin/mobil/${id}/approve`, { method: 'PUT', credentials: 'include' })
    if(res.ok) fetchData(); else alert(await res.text())
  }
  const handleSoldMobil = async (id) => {
    if(!confirm('Tandai mobil ini SOLD?')) return
    const res = await fetch(`/api/admin/mobil/${id}/sold`, { method: 'PUT', credentials: 'include' })
    if(res.ok) fetchData(); else alert(await res.text())
  }
  const handleDeleteMobil = async (id) => {
    if(!confirm('HAPUS PERMANEN?')) return
    const res = await fetch(`/api/admin/mobil/${id}`, { method: 'DELETE', credentials: 'include' })
    if(res.ok) fetchData(); else alert(await res.text())
  }
  const handleTerjualRumah = async (id) => {
    if(!confirm('Tandai rumah ini TERJUAL?')) return
    const res = await fetch(`/api/admin/rumah/${id}`, { method: 'PUT', credentials: 'include', body: JSON.stringify({ status: 'terjual' }) })
    if(res.ok) fetchData(); else alert(await res.text())
  }
  const handleDeleteRumah = async (id) => {
    if(!confirm('HAPUS PERMANEN RUMAH?')) return
    const res = await fetch(`/api/admin/rumah/${id}`, { method: 'DELETE', credentials: 'include' })
    if(res.ok) fetchData(); else alert(await res.text())
  }
  const handleApproveShowroom = async (id) => {
    if(!confirm('Approve showroom ini?')) return
    const res = await fetch(`/api/admin/showroom/${id}/approve`, { method: 'PUT', credentials: 'include' })
    if(res.ok) fetchData(); else alert(await res.text())
  }
  const handleSetPremium = async (id) => {
    if(!confirm('Jadikan Premium?')) return
    const res = await fetch(`/api/admin/showroom/${id}/premium`, { method: 'PUT', credentials: 'include' })
    if(res.ok) fetchData(); else alert(await res.text())
  }
  const handleLogout = async () => { // 12. UBAH LOGOUT
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    router.push('/login-admin')
  }

  // SISA UI LU 100% TETAP SAMA. COPY DARI KODE LU DI ATAS
  if(loading) return ( <div className={`${bg} ${text} min-h-screen flex flex-col items-center justify-center gap-4 ${poppins.className}`}><Loader2 className="w-10 h-10 animate-spin text-yellow-400"/><p>Loading Panel Admin...</p><button onClick={handleLogout} className="mt-4 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2"><LogOut size={18}/> Force Logout</button></div> )

  const mobilPending = allMobil.filter(m => m.status === 'pending')
  const mobilApproved = allMobil.filter(m => m.status === 'approved')
  const mobilSold = allMobil.filter(m => m.status_jual === 'sold')
  const rumahAktif = allRumah.filter(r => r.status!== 'terjual')
  const StatusBadge = ({status}) => { const colors = { pending: 'bg-yellow-500/20 text-yellow-400', approved: 'bg-green-500/20 text-green-400', sold: 'bg-blue-500/20 text-blue-400', terjual: 'bg-purple-500/20 text-purple-400', available: 'bg-green-500/20 text-green-400', rejected: 'bg-red-500/20 text-red-400', }; return <span className={`px-2 py-1 text-xs font-bold rounded-full border ${colors[status] || colors.pending}`}>{status?.toUpperCase()}</span> }

  return ( /* COPY SEMUA RETURN DARI KODE LU YANG LAMA */ <div className={`${bg} ${text} min-h-screen ${poppins.className} transition-colors duration-300`}>...</div> )
}
