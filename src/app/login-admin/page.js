'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Loader2, LogIn } from 'lucide-react' // <- js-cookie udah dihapus

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function LoginAdminPage() {
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

      if(data.user.role.toLowerCase() !== 'admin'){
        throw new Error(`Akun ini bukan admin. Role: ${data.user.role}`)
      }
        
      document.cookie = `admin_token=${data.access_token}; path=/; max-age=86400; SameSite=Lax; Secure`
      
      alert('Login Admin Berhasil!')
      window.location.assign('/admin')

    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0B0B0F]">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-[#1a1a20] p-8 rounded-2xl border border-gray-800">
        <h1 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2"><LogIn/> Login Admin</h1>
        <input type="email" placeholder="Email Admin" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 mb-4 bg-gray-900 border border-gray-700 rounded-lg text-white" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 mb-4 bg-gray-900 border border-gray-700 rounded-lg text-white" required />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button type="submit" disabled={loading} className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2">
          {loading ? <Loader2 className="animate-spin"/> : 'Masuk'}
        </button>
      </form>
    </div>
  )
}
