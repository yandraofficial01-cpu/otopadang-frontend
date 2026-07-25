'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      const res = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.detail)

      // Simpan ke localStorage biar ga ilang pas refresh
      localStorage.setItem('showroom_id', data.showroom_id)
      localStorage.setItem('email', data.email)
      
      router.push('/dashboard') // lempar ke dashboard abis login
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleLogin} className="p-8 shadow-lg rounded-lg w-96">
        <h1 className="text-2xl font-bold mb-4">Login Otopadang</h1>
        {error && <p className="text-red-500">{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border p-2 w-full mb-3" required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="border p-2 w-full mb-3" required />
        <button className="bg-blue-600 text-white w-full p-2 rounded">Login</button>
      </form>
    </div>
  )
}