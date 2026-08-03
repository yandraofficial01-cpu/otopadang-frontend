"use client"

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-[#0B0B0F]/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-3xl font-bold text-yellow-400">Otopadang</Link>
        
        {/* NAV DESKTOP */}
        <nav className="hidden md:flex items-center gap-8 font-semibold">
          <Link href="/mobil" className="text-gray-300 hover:text-yellow-400 transition">Mobil</Link>
          <Link href="/rumah" className="text-gray-300 hover:text-yellow-400 transition">Rumah</Link>
          <Link href="/blog" className="text-gray-300 hover:text-yellow-400 transition">Blog</Link>
        </nav>

        {/* TOMBOL DESKTOP */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login"><button className="px-4 py-2 text-sm font-semibold text-yellow-400 border-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black transition">Login</button></Link>
          <Link href="/register-showroom"><button className="px-4 py-2 text-sm font-semibold bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition">Daftar</button></Link>
        </div>

        {/* TOMBOL MOBILE */}
        <button className="md:hidden text-gray-300" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* DROP SLIDE MOBILE */}
      {isOpen && (
        <div className="md:hidden bg-[#0B0B0F] border-t border-gray-800 px-4 py-4 flex-col gap-4">
          <Link href="/mobil" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-yellow-400">Mobil</Link>
          <Link href="/rumah" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-yellow-400">Rumah</Link>
          <Link href="/blog" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-yellow-400">Blog</Link>
          <hr className="border-gray-800" />
          <Link href="/login" onClick={() => setIsOpen(false)} className="text-yellow-400 font-semibold">Login Admin/Showroom</Link>
          <Link href="/register-showroom" onClick={() => setIsOpen(false)} className="bg-yellow-500 text-black text-center py-2 rounded-lg font-semibold">Daftar Showroom</Link>
        </div>
      )}
    </header>
  )
}
