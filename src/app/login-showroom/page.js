'use client'
import { useState } from 'react'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function LoginShowroomPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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

      if(!res.ok) throw new Error(data.detail || 'Login gagal')

      const accessToken = data.access_token
      const user = data.user

      if(user.role.toLowerCase() !== 'showroom'){
        throw new Error(`Akun ini bukan showroom. Role: ${user.role}`)
      }
        
      localStorage.clear()

      // FIX 1: JANGAN PAKE JS-COOKIE. PAKE document.cookie BIAR AMAN DI MOBILE
      // max-age 86400 = 1 hari
      document.cookie = `showroom_token=${accessToken}; path=/; max-age=86400; SameSite=Lax; Secure`
      document.cookie = `showroom_id=${user.showroom_id}; path=/; max-age=86400; SameSite=Lax; Secure`

      // FIX 2: KASIH JEDA DULU + PAKAI HARD REDIRECT
      // biar cookie bener2 ke-save sebelum pindah
      alert('Login berhasil!')
      window.location.assign('/dashboard/mobil/input') // JANGAN router.push

    } catch (error) {
      setError(error.message)
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0B0B0F]">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-[#1a1a20] p-8 rounded-2xl border border-gray-800">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Login Showroom</h1>
        
        <input 
          type="email" 
          placeholder="Email Showroom" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full p-3 mb-4 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-yellow-500 outline-none" 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full p-3 mb-4 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-yellow-500 outline-none" 
          required 
        />
        
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : 'Masuk sebagai Showroom'}
        </button>

        <p className="text-center mt-4 text-gray-400 text-sm">
          Belum punya akun? <Link href="/daftar-showroom" className="text-yellow-500 font-semibold hover:underline">Daftar Showroom</Link>
        </p>
      </form>
    </div>
  )
}
