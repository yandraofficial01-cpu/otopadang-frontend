'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const API_URL = 'https://otopadang-api.up.railway.app'

export default function LoginAdminPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()

      if(res.ok){
        // 1. CEK ROLE DULU
        if(data.role !== 'admin'){
          alert('Akun ini bukan admin')
          return
        }

        // 2. SIMPEN KE COOKIE BIAR MIDDLEWARE BACA
        document.cookie = `token=${data.access_token}; path=/; max-age=86400; SameSite=Lax`;
        
        // 3. SIMPEN INFO LAIN DI LOCALSTORAGE BOLEH
        localStorage.setItem('role', data.role)
        localStorage.setItem('email', data.email)
        
        router.push('/admin')
      } else {
        alert(data.detail?.message || data.detail || 'Login gagal')
      }
    } catch (error) {
      alert('Server error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0B0B0F]">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-[#1a1a20] p-8 rounded-2xl border-gray-800">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6 text-center">Login Admin</h1>
        
        <input 
          type="email" 
          placeholder="Email Admin"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-900 border border-gray-700 rounded-lg text-white"
          required
        />
        <input 
          type="password" 
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 bg-gray-900 border border-gray-700 rounded-lg text-white"
          required
        />
        
        <button disabled={loading} className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50">
          {loading ? 'Loading...' : 'Masuk sebagai Admin'}
        </button>
        
        <p className="text-center text-sm text-gray-500 mt-6">
          Bukan admin? <Link href="/login-showroom" className="text-yellow-400">Login Showroom</Link>
        </p>
      </form>
    </div>
  )
}
