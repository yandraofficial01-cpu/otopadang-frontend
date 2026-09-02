'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AutoLogout() {
  const router = useRouter()
  const pathname = usePathname()
  const timer = useRef(null)
  const [timeLeft, setTimeLeft] = useState(60 * 60) // 1 jam

  const LOGOUT_TIME_MS = 60 * 60 * 1000 // 1. UBAH JADI 1 JAM ✅
  const LOGOUT_TIME_SEC = 60 * 60

  const logout = () => {
    localStorage.clear()
    document.cookie = "token=; path=/; max-age=0"
    alert('Sesi habis 1 jam. Silakan login ulang')
    router.push('/admin/login') // samain sama folder lu
  }

  const resetTimer = () => {
    setTimeLeft(LOGOUT_TIME_SEC) // reset hitungan mundur
    if(timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(logout, LOGOUT_TIME_MS)
  }

  // Hitung mundur
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => prev > 0? prev - 1 : 0)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if(!token) return

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']
    events.forEach(event => window.addEventListener(event, resetTimer))

    // 2. HAPUS BAGIAN INI. Biar gak logout pas buka WA
    // const handleVisibility = () => {... }
    // document.addEventListener('visibilitychange', handleVisibility)

    resetTimer()

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer))
      // document.removeEventListener('visibilitychange', handleVisibility)
      clearTimeout(timer.current)
    }
  }, [pathname])

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0')
    const s = (sec % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  return (
    <div className="fixed top-4 right-4 bg-zinc-900 border border-zinc-800 text-yellow-400 text-xs px-3 py-2 rounded-lg z-50">
      Auto logout: {formatTime(timeLeft)}
    </div>
  )
}
