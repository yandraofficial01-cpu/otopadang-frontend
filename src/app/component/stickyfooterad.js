'use client'
import { useState } from "react"

export default function StickyFooterAd({ wa, banner }) {
  const [isClosed, setIsClosed] = useState(false)
  
  if(isClosed ||!wa ||!banner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 p-1 shadow-[0_-4px_15px_rgba(0,0,0,0.6)]">
      <button 
        onClick={() => setIsClosed(true)} 
        className="absolute -top-3 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold z-10 hover:bg-red-700"
      >
        X
      </button>
      <a href={`https://wa.me/${wa}?text=Halo%20saya%20lihat%20iklan%20di%20OtoPadang`} target="_blank" rel="noopener noreferrer">
        <img src={banner} alt="Iklan Endorse" className="w-full h-16 object-contain"/>
      </a>
    </div>
  )
}
