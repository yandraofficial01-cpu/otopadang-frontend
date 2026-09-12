'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Poppins, Playfair_Display } from 'next/font/google'
import { Car, Home, FileText, Building2, LogOut, Crown, Trash2, Loader2, RefreshCw, AlertTriangle, Sun, Moon, Eye } from 'lucide-react'

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
  const isMounted = useRef(false)

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
  const card = theme === 'dark' ? 'bg-[#1a1a20]/60 border border-gray-800' : 'bg-white/70 border border-gray-200'
  const text = theme === 'dark' ? 'text-white' : 'text-gray-800'
  const textMuted = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'

  const fetchWithTimeout = async (url, timeout = 20000) => {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)
    try {
      // 1. FETCH KE PROXY KITA SENDIRI
      const res = await fetch(`/api${url}`, { 
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        signal: controller.signal, cache: 'no-store'
      })
      clearTimeout(id)
      if(!res.ok) {
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
    } catch (err) { 
      console.error(err)
      setError(err.message) 
    }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    if(isMounted.current) return
    isMounted.current = true
    
    // 2. CEK AUTH LEWAT PROXY JUGA
    fetch(`/api/auth/me`, { credentials: 'include' })
    .then(res => { 
      if(!res.ok) throw new Error('401')
      return res.json()
    })
    .then(data => {
      if(data.role?.toLowerCase() !== 'admin'){
        alert('Akses ditolak. Khusus Admin');
        router.push('/login-admin');
        return;
      }
      fetchData();
    })
    .catch(() => router.push('/login-admin'))
  }, [fetchData, router])

  // 3. SEMUA HANDLE JUGA PAKE PROXY
  const handleApproveMobil = async (id) => {
    if(!confirm('Approve mobil ini?')) return
    const res = await fetch(`/api/admin/mobil/${id}/approve`, { method: 'PUT', credentials: 'include' })
    if(res.ok) fetchData(); else alert(await res.text())
  }
  // ... sisanya sama. ganti API_URL jadi /api

  const handleLogout = async () => {
    await fetch(`/api/auth/logout`, { method: 'POST', credentials: 'include' })
    router.push('/login-admin')
  }

  if(loading) return ( 
    <div className={`${bg} ${text} min-h-screen flex items-center justify-center gap-4 ${poppins.className}`}>
      <Loader2 className="w-10 h-10 animate-spin text-yellow-400"/>
      <p>Loading Panel Admin...</p>
    </div> 
  )
  // ... SISA KODE LU SAMA
}
