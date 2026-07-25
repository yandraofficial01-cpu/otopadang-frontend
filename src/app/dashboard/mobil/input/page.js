'use client' // <- TAMBAHIN INI DI PALING ATAS

import { useState, useEffect } from 'react'

export default function InputMobilPage() {
  const [token, setToken] = useState('')

  // Pake useEffect biar cuma jalan di browser
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      setToken(savedToken)
    }
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Input Data Mobil</h1>
      <p>Token: {token}</p>
      {/* form lu disini */}
    </div>
  )
}
