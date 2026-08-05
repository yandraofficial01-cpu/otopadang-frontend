'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const API_URL = 'https://otopadang-api.up.railway.app'

export default function LoginShowroomPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // FIX 1: TAMBAH /auth
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()

      if(res.ok){
        // FIX 2: PAKE access_token + SIMPEN DATA DARI API
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('role', data.role)
        localStorage.setItem('showroom_id', data.showroom_id)
        localStorage.setItem('nama_showroom', data.nama_showroom)
        localStorage.setItem('email', data.email)

        // JAGA2: PASTIIN BENERAN SHOWROOM
        if(data.role !== 'showroom'){
          alert('Akun ini bukan showroom')
          localStorage.clear()
          return
        }
        router.push('/dashboard/mobil/input')
      } else {
        // FIX 3: HANDLE ERROR 403 BELUM APPROVE
        if(res.status === 403 && data.detail?.hubungi_admin){
          if(confirm(data.detail.message + '\n\nHubungi admin via WA?')){
            window.open(data.detail.hubungi_admin, '_blank')
          }
        } else {
          alert(data.detail?.message || data.detail || 'Login gagal')
        }
      }
    } catch (error) {
      alert('Server error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-[#1a1a20] p-8 rounded-2xl border border-gray-800">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Login Showroom</h1>
        
        <input 
          type="email" 
          placeholder="Email Showroom"
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
          className="w-full p-3 mb-6 bg-gray-900 border-gray-700 rounded-lg text-white"
          required
        />
        
        <button disabled={loading} className="w-full bg-gray-700 text-white font-bold py-3 rounded-lg hover:bg-gray-600 transition disabled:opacity-50">
          {loading ? 'Loading...' : 'Masuk sebagai Showroom'}
        </button>
        
        <p className="text-center text-sm text-gray-500 mt-6">
          Belum punya akun? <Link href="/register-showroom" className="text-yellow-400">Daftar Showroom</Link>
        </p>
      </form>
    </div>
  )
}
