'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Loader2, LogIn } from 'lucide-react'
import Cookies from 'js-cookie' // npm i js-cookie

const API_URL = 'https://otopadang-api.vercel.app'

export default function LoginAdminPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('') // ganti alert pake state

  const handleLogoutDulu = () => {
    localStorage.clear()
    Cookies.remove('token')
    Cookies.remove('admin_token') // baru
    Cookies.remove('showroom_token') // baru
    Cookies.remove('role')
    window.location.reload()
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/auth/login`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      const data = await res.json()
      if(!res.ok) throw new Error(data.detail || 'Email atau password salah')

      const accessToken = data.access_token
      const user = data.user

      if(user.role.toLowerCase() !== 'admin'){
        throw new Error(`Akses ditolak! Akun kamu role: ${user.role}`)
      }

      // 1. SET COOKIE PAKE JS-COOKIE + SECURE TRUE BUAT VERCEL
      Cookies.set('admin_token', accessToken, { 
        expires: 1, 
        path: '/', 
        SameSite: 'Lax',
        secure: true // WAJIB di https
      })
      Cookies.set('admin_role', user.role, { expires: 1, path: '/', SameSite: 'Lax', secure: true })

      // 2. JANGAN PAKE ALERT. LANGSUNG REDIRECT
      window.location.assign('/admin') // assign lebih kuat dari href di mobile
      
    } catch (error: any) {
      console.error(error)
      setError(error.message) // tampilin di bawah button
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0B0B0F]">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-[#1a1a20] p-8 rounded-2xl border-gray-800 shadow-xl">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6 text-center">Login Admin Otopadang</h1>
        
        <input type="email" placeholder="Email Admin" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 mb-4 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-yellow-500 outline-none" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 mb-4 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-yellow-500 outline-none" required />
        
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button disabled={loading} className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? <Loader2 className="animate-spin" size={20}/> : <LogIn size={20}/>}
          {loading ? 'Loading...' : 'Masuk sebagai Admin'}
        </button>

        <button type="button" onClick={handleLogoutDulu} className="w-full mt-3 bg-gray-800 text-gray-400 text-sm py-2 rounded-lg hover:bg-gray-700">
          Force Logout Dulu
        </button>
        
        <p className="text-center text-sm text-gray-500 mt-6">
          Bukan admin? <Link href="/login-showroom" className="text-yellow-400 hover:underline">Login Showroom</Link>
        </p>
      </form>
    </div>
  )
}
