'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AutoLogout() {
  const router = useRouter()
  const pathname = usePathname()
  const timer = useRef(null)
  const [timeLeft, setTimeLeft] = useState(60 * 60) // 1 jam
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const LOGOUT_TIME_MS = 60 * 60 * 1000 // 1 JAM
  const LOGOUT_TIME_SEC = 60 * 60

  const logout = () => {
    localStorage.clear()
    // HAPUS SEMUA COOKIE TOKEN - panggil ke proxy biar kehapus bener
    fetch('/api/logout', { method: 'POST', credentials: 'include' }).catch(() => {})
    
    alert('Sesi habis 1 jam. Silakan login ulang')

    // CEK KITA LAGI DI ADMIN ATAU SHOWROOM
    if(pathname.startsWith('/admin')) {
      router.push('/login-admin') // samain sama middleware lu
    } else {
      router.push('/login/showroom')
    }
  }

  const resetTimer = () => {
    setTimeLeft(LOGOUT_TIME_SEC)
    if(timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(logout, LOGOUT_TIME_MS)
  }

  // Hitung mundur
  useEffect(() => {
    if(!isLoggedIn) return
    const interval = setInterval(() => {
      setTimeLeft(prev => prev > 0? prev - 1 : 0)
    }, 1000)
    return () => clearInterval(interval)
  }, [isLoggedIn])

  useEffect(() => {
    // JANGAN CEK document.cookie. CEK KE BE LANGSUNG
    fetch('/api/auth/me', { 
      method: 'GET',
      credentials: 'include' // biar cookie httpOnly kekirim
    })
   .then(res => {
      if(res.ok) {
        setIsLoggedIn(true) // baru jalanin timer kalau BE bilang ok
        
        const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']
        events.forEach(event => window.addEventListener(event, resetTimer))

        resetTimer()

        return () => {
          events.forEach(event => window.removeEventListener(event, resetTimer))
          clearTimeout(timer.current)
        }
      } else {
        setIsLoggedIn(false)
      }
    })
   .catch(() => setIsLoggedIn(false))

  }, [pathname])

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0')
    const s = (sec % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  if(!isLoggedIn) return null // kalau belum login jangan tampil

  return (
    <div className="fixed top-4 right-4 bg-zinc-900 border-zinc-800 text-yellow-400 text-xs px-3 py-2 rounded-lg z-50">
      Auto logout: {formatTime(timeLeft)}
    </div>
  )
}
