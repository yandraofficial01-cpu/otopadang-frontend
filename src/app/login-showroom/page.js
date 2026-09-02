'use client'
import { useState } from 'react'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function LoginShowroomPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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

      if(data.user.role.toLowerCase() !== 'showroom'){
        throw new Error(`Akun ini bukan showroom. Role: ${data.user.role}`)
      }
        
      document.cookie = `showroom_token=${data.access_token}; path=/; max-age=86400; SameSite=Lax; Secure`
      document.cookie = `showroom_id=${data.user.showroom_id}; path=/; max-age=86400; SameSite=Lax; Secure`

      alert('Login berhasil!')
      window.location.assign('/dashboard/mobil/input')

    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (/* ...form lu yg sama... */)
}
