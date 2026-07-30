"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const [token, setToken] = useState(null)
  const [role, setRole] = useState(null)
  const router = useRouter()

  useEffect(() => {
    setToken(localStorage.getItem("token"))
    setRole(localStorage.getItem("role"))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    setToken(null)
    router.push("/login")
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="text-2xl font-bold text-blue-600">Otopadang</a>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="/mobil" className="text-gray-700 hover:text-blue-600 font-medium">Mobil</a>
          <a href="/rumah" className="text-gray-700 hover:text-blue-600 font-medium">Rumah</a>
          <a href="/blog" className="text-gray-700 hover:text-blue-600 font-medium">Blog</a>
        </nav>

        <div className="flex items-center gap-3">
          {token ? (
            <>
              <a href={role === "admin" ? "/admin" : "/dashboard"} className="text-gray-700 hover:text-blue-600 font-medium">
                Dashboard
              </a>
              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600">
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="text-gray-700 hover:text-blue-600 font-medium">Login</a>
              <a href="/register-showroom" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">+ Jual</a>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
