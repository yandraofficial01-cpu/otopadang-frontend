'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation' // 1. TAMBAH INI
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function LoginShowroomPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter() // 2. TAMBAH INI

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // 3. INI WAJIB. Biar cookie httponly dari BE masuk
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()

      if(!res.ok) throw new Error(data.detail || 'Login gagal')

      if(data.user.role.toLowerCase() !== 'showroom'){
        throw new Error(`Akun ini bukan showroom. Role: ${data.user.role}`)
      }
        
      // 4. HAPUS 2 BARIS INI. UDAH DI HANDLE BE
      // document.cookie = `showroom_token=${data.access_token}; path=/; max-age=86400; SameSite=Lax; Secure`
      // document.cookie = `showroom_id=${data.user.showroom_id}; path=/; max-age=86400; SameSite=Lax; Secure`

      alert('Login berhasil!')
      router.push('/dashboard/mobil/input') // 5. LEBIH BAGUS DARI window.location

    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0B0B0F]">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-[#1a1a20] p-8 rounded-2xl border border-gray-800">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Login Showroom</h1>
        <input type="email" placeholder="Email Showroom" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 mb-4 bg-gray-900 border-gray-700 rounded-lg text-white" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 mb-4 bg-gray-900 border border-gray-700 rounded-lg text-white" required />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button type="submit" disabled={loading} className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg">
          {loading ? 'Loading...' : 'Masuk'}
        </button>
      </form>
    </div>
  )
}
