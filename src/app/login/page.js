'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter() // <- INI DOANG, HAPUS SISANYA

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('https://otopadang-api.up.railway.app/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.detail)

      // 1. SIMPAN TOKEN KE COOKIE
      document.cookie = `token=${data.access_token}; path=/; max-age=86400; SameSite=Lax`
      
      // 2. Simpan data lain
      localStorage.setItem('showroom_id', data.showroom_id)
      localStorage.setItem('role', data.role)
      localStorage.setItem('email', data.email)

      router.push('/dashboard') 
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <form onSubmit={handleLogin} className="p-8 shadow-lg rounded-lg w-96 bg-gray-900 text-gold">
        <h1 className="text-2xl font-bold mb-4">Login Otopadang</h1>
        {error && <p className="text-red-500">{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border p-2 w-full mb-2 rounded bg-black" required/>
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="border p-2 w-full mb-4 rounded bg-black" required/>
        <button className="bg-yellow-500 text-black font-bold w-full p-2 rounded">Login</button>
      </form>
    </div>
  )
}
