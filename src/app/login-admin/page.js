'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2, LogIn } from 'lucide-react'

const API_URL = 'https://otopadang-api.vercel.app'

export default function LoginAdminPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogoutDulu = () => {
    localStorage.clear()
    document.cookie = "token=; path=/; max-age=0"
    alert('Sudah logout. Silakan login lagi sebagai admin')
    window.location.reload()
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
      
      const data = await res.json()

      if(!res.ok){
        alert('Login gagal: ' + (data.detail || 'Email atau password salah'))
        return
      }

      const accessToken = data.access_token
      const user = data.user

      if(!accessToken){
        alert('Token kosong! Cek BE lu')
        return
      }

      if(user.role.toLowerCase() !== 'admin'){
        alert(`Akses ditolak! Akun kamu role: ${user.role}. Harus 'admin'`)
        return
      }

      localStorage.setItem('token', accessToken)
      localStorage.setItem('role', user.role)
      localStorage.setItem('email', user.email)
      localStorage.setItem('showroom_id', user.showroom_id || '')
      document.cookie = `token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;

      alert("Login berhasil!") 
      router.push('/admin') // GANTI JADI /dashboard/admin KALO FOLDER NYA ITU
      
    } catch (error) {
      console.error(error)
      alert('Server error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0B0B0F]">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-[#1a1a20] p-8 rounded-2xl border border-gray-800 shadow-xl">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6 text-center">Login Admin Otopadang</h1>
        
        <input type="email" placeholder="Email Admin" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 mb-4 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-yellow-500 outline-none" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 mb-6 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-yellow-500 outline-none" required />
        
        <button disabled={loading} className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? <Loader2 className="animate-spin" size={20}/> : <LogIn size={20}/>}
          {loading ? 'Loading...' : 'Masuk sebagai Admin'}
        </button>

        <button type="button" onClick={handleLogoutDulu} className="w-full mt-3 bg-gray-800 text-gray-400 text-sm py-2 rounded-lg hover:bg-gray-700">
          Force Logout Dulu
        </button>
        
        <p className="text-center text-sm text-gray-500 mt-6">
          Bukan admin? <Link href="/login-showroom" className="text-yellow-400 hover:underline">Login Showroom</Link>
        </p>
      </form>
    </div>
  )
}
