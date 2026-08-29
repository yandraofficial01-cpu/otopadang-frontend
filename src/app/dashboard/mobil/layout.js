'use client'
import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AutoLogout() {
  const router = useRouter()
  const pathname = usePathname()
  const timer = useRef(null)
  const LOGOUT_TIME = 30 * 60 * 1000 // 30 menit

  const logout = () => {
    localStorage.clear()
    document.cookie = "token=; path=/; max-age=0"
    alert('Sesi habis. Silakan login ulang')
    router.push('/login-admin') // kalau showroom ganti ke /login-showroom
  }

  const resetTimer = () => {
    if(timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(logout, LOGOUT_TIME)
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if(!token) return

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']
    events.forEach(event => window.addEventListener(event, resetTimer))

    const handleVisibility = () => {
      if(document.visibilityState === 'hidden') {
        logout() // pindah aplikasi langsung logout
      } else {
        resetTimer()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    resetTimer()

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer))
      document.removeEventListener('visibilitychange', handleVisibility)
      clearTimeout(timer.current)
    }
  }, [pathname])

  return null
}
