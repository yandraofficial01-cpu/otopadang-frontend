'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // PAKE PROXY BIAR GAK KENA CORS
      const res = await fetch('/api/login', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Login gagal')

      // HAPUS INI: document.cookie = ...
      // Cookie udah di-set otomatis dari server di /api/login
      
      // Simpan data lain di localStorage
      localStorage.setItem('showroom_id', data.showroom_id)
      localStorage.setItem('role', data.role)
      localStorage.setItem('email', data.email)

      router.push('/dashboard') 
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <form onSubmit={handleLogin} className="p-8 shadow-lg rounded-lg w-96 bg-gray-900 text-yellow-400">
        <h1 className="text-2xl font-bold mb-4 text-center">Login Otopadang</h1>
        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}
        
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          className="border border-gray-700 p-2 w-full mb-3 rounded bg-black text-white" 
          required
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          className="border border-gray-700 p-2 w-full mb-4 rounded bg-black text-white" 
          required
        />
        
        <button 
          disabled={loading}
          className="bg-yellow-500 text-black font-bold w-full p-2 rounded hover:bg-yellow-400 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
    </div>
  )
}
