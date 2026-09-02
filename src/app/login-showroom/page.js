'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Cookies from 'js-cookie' // npm i js-cookie

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function LoginShowroomPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('') // ganti alert pake state
  const router = useRouter()

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
        
      // 1. HAPUS LOCALSTORAGE. GAK DIPAKE LAGI
      localStorage.clear() 

      // 2. SET COOKIE KHUSUS SHOWROOM
      Cookies.set('showroom_token', accessToken, { 
        expires: 1, 
        path: '/', 
        SameSite: 'Lax',
        secure: true // wajib di vercel https
      })
      Cookies.set('showroom_id', user.showroom_id, { expires: 1, path: '/', SameSite: 'Lax', secure: true })

      // 3. HAPUS ALERT. LANGSUNG PUSH
      router.push('/dashboard/mobil/input')

    } catch (error: any) {
      setError(error.message)
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
          className="w-full p-3 mb-4 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-yellow-400 outline-none"
          required
        />
        <input 
          type="password" 
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-yellow-400 outline-none"
          required
        />
        
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button 
          type="submit"
          disabled={loading} 
          className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Masuk sebagai Showroom'}
        </button>
        
        <p className="text-center text-sm text-gray-400 mt-6">
          Belum punya akun? <Link href="/daftar-showroom" className="text-yellow-400 font-semibold hover:underline">Daftar Showroom</Link>
        </p>
      </form>
    </div>
  )
}
