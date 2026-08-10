'use client'
import { useState } from 'react'
import Link from 'next/link'

const API_URL = 'https://otopadang-api.up.railway.app'

export default function LoginAdminPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

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
      console.log('RESPONSE FULL:', data) // biar keliatan di console

      if(res.ok){
        // FIX 1: Ambil role dengan aman, jangan sampai object
        const userRole = data.user?.role || data.role || ''
        const userEmail = data.user?.email || data.email || email
        const accessToken = data.access_token || data.token

        console.log('Role:', userRole, 'Token ada:', !!accessToken)

        // FIX 2: Cek role, kalau bukan admin jangan stuck loading
        if(userRole !== 'admin'){
          alert(`Akun ini bukan admin!\nRole kamu: ${JSON.stringify(userRole)}\nData full: ${JSON.stringify(data)}`)
          setLoading(false)
          return
        }

        if(!accessToken){
          alert('Token kosong! Response: ' + JSON.stringify(data))
          setLoading(false)
          return
        }

        // FIX 3: Simpen SEMUA key biar sinkron sama admin/page.jsx
        document.cookie = `token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
        localStorage.setItem('access_token', accessToken)
        localStorage.setItem('token', accessToken)
        localStorage.setItem('token_admin', accessToken)
        localStorage.setItem('role', userRole)
        localStorage.setItem('email', userEmail)
        
        // FIX 4: Jangan pake router.push, pake href biar middleware ke-trigger
        window.location.href = '/admin'
        
      } else {
        // FIX 5: Alert nya jangan langsung object, pake JSON.stringify
        const errorMsg = data.detail?.message || data.detail || data.message || JSON.stringify(data)
        alert('Login gagal: ' + errorMsg)
        setLoading(false)
      }
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
