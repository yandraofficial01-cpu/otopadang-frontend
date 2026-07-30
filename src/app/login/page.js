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
      // INI YANG DIGANTI -> pake proxy
      const res = await fetch('/api/login', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.detail)

      document.cookie = `token=${data.access_token}; path=/; max-age=86400; SameSite=Lax`
      localStorage.setItem('showroom_id', data.showroom_id)
      localStorage.setItem('role', data.role)
      localStorage.setItem('email', data.email)

      router.push('/dashboard') 
    } catch (err) {
      setError(err.message)
    }
  }

  return ( ...sama kayak punya kamu... )
}
