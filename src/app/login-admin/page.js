'use client'
import { useState } from 'react'
import Link from 'next/link'

const API_URL = 'https://otopadang-api.vercel.app'

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
    localStorage.removeItem('showroom_id')
    document.cookie = "token=; path=/; max-age=0"
    alert('Sudah logout. Silakan login lagi sebagai admin')
    window.location.reload()
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // PENTING: /auth/login + JSON
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          email: email, 
          password: password 
        })
      })
      
      const data = await res.json()
      console.log('RESPONSE FULL:', data)

      if(!res.ok){
        alert('Login gagal: ' + (data.detail || 'Email atau password salah'))
        setLoading(false)
        return
      }

      const accessToken = data.access_token
      const user = data.user

      if(!accessToken){
        alert('Token kosong!')
        setLoading(false)
        return
      }

      // Cek role harus admin
      if(user.role.toLowerCase() !== 'admin'){
        alert(`Akses ditolak! Akun kamu role: ${user.role}`)
        setLoading(false)
        return
      }

      // Simpen semua data
      localStorage.setItem('token', accessToken)
      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('role', user.role)
      localStorage.setItem('email', user.email)
      localStorage.setItem('showroom_id', user.showroom_id)
      
      // Cookie buat middleware Next.js
      document.cookie = `token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;

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
      <form onSubmit={handleLogin} className="w-full max-w-md bg-[#1a1a20] p-8 rounded-2xl border border-gray-800 shadow-xl">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6 text-center">Login Admin Otopadang</h1>
        
        <input 
          type="email" 
          placeholder="Email Admin" 
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
          className="w-full p-3 mb-6 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-yellow-500 outline-none" 
          required 
        />
        
        <button 
          disabled={loading} 
          className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : 'Masuk sebagai Admin'}
        </button>

        <button 
          type="button" 
          onClick={handleLogoutDulu} 
          className="w-full mt-3 bg-gray-800 text-gray-400 text-sm py-2 rounded-lg hover:bg-gray-700"
        >
          Force Logout Dulu
        </button>
        
        <p className="text-center text-sm text-gray-500 mt-6">
          Bukan admin? <Link href="/login-showroom" className="text-yellow-400 hover:underline">Login Showroom</Link>
        </p>
      </form>
    </div>
  )
}
