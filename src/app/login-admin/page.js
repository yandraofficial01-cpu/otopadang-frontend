'use client'
import { useState } from 'react'
import Link from 'next/link'

const API_URL = 'https://otopadang-api.up.railway.app'

export default function LoginAdminPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogoutDulu = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('access_token')
    localStorage.removeItem('token_admin')
    localStorage.removeItem('role')
    localStorage.removeItem('email')
    document.cookie = "token=; path=/; max-age=0"
    alert('Sudah logout, sekarang login lagi sebagai admin')
    window.location.reload()
  }

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
      console.log('RESPONSE FULL:', data)

      if(!res.ok){
        alert('Login gagal: ' + (data.detail || JSON.stringify(data)))
        setLoading(false)
        return
      }

      const user = data.user || data
      const userRole = (user.role || data.role || '').toLowerCase()
      const accessToken = data.access_token || data.token || data.accessToken
      const showroomId = user.showroom_id ?? data.showroom_id

      console.log('Role:', userRole, 'showroom_id:', showroomId)

      if(!accessToken){
        alert('Token kosong!')
        setLoading(false)
        return
      }

      // BLOKIR SHOWROOM
      if(showroomId !== null && showroomId !== undefined){
        alert('AKUN SHOWROOM TIDAK BOLEH MASUK ADMIN! Redirect ke login showroom')
        window.location.href = '/login-showroom'
        return
      }

      if(userRole !== 'admin'){
        alert(`Akses ditolak! Role kamu: ${userRole}`)
        setLoading(false)
        return
      }

      // JANGAN pakai clear(), set satu2
      localStorage.setItem('token', accessToken)
      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('role', 'admin')
      localStorage.setItem('email', user.email || email)
      // Cookie penting buat middleware Next.js
      document.cookie = `token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;

      // Kasih jeda 300ms biar cookie ke-save dulu
      setTimeout(() => {
        window.location.replace('/admin')
      }, 300)
      
    } catch (error) {
      console.error(error)
      alert('Server error: ' + error.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0B0B0F]">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-[#1a1a20] p-8 rounded-2xl border border-gray-800">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6 text-center">Login Admin</h1>
        
        <input type="email" placeholder="Email Admin" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 mb-4 bg-gray-900 border border-gray-700 rounded-lg text-white" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 mb-6 bg-gray-900 border border-gray-700 rounded-lg text-white" required />
        
        <button disabled={loading} className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50">
          {loading ? 'Loading...' : 'Masuk sebagai Admin'}
        </button>

        <button type="button" onClick={handleLogoutDulu} className="w-full mt-3 bg-gray-800 text-gray-400 text-sm py-2 rounded-lg">
          Force Logout Dulu (kalau stuck)
        </button>
        
        <p className="text-center text-sm text-gray-500 mt-6">
          Bukan admin? <Link href="/login-showroom" className="text-yellow-400">Login Showroom</Link>
        </p>
      </form>
    </div>
  )
}
