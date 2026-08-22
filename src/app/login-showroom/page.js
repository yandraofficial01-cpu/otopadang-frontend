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
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()

      if(res.ok){
        const user = data.user
        
        console.log("DATA USER:", user) // buat debug

        // 1. Simpan ke localStorage buat dipake di FE
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('role', user.role)
        localStorage.setItem('showroom_id', user.showroom_id)
        localStorage.setItem('email', user.email)

        // 2. PENTING: Simpan ke cookie biar kebaca middleware
        document.cookie = `token=${data.access_token}; path=/; max-age=86400; SameSite=Lax`;

        if(user.role !== 'showroom'){
          alert('Akun ini bukan showroom')
          localStorage.clear()
          // hapus cookie juga
          document.cookie = `token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
          return
        }
        
        alert('Login berhasil!')
        router.push('/dashboard/mobil/input')
      } else {
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
          className="w-full p-3 mb-6 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-yellow-400 outline-none"
          required
        />
        
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
