"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// GANTI INI: pake env biar fleksibel
const API_URL = process.env.NEXT_PUBLIC_API_URL;

function ImageSlider({ images }) {
  const [current, setCurrent] = useState(0);
  const [zoomImg, setZoomImg] = useState(null);
  const prev = (e) => { e.stopPropagation(); setCurrent(current === 0? images.length - 1 : current - 1); };
  const next = (e) => { e.stopPropagation(); setCurrent(current === images.length - 1? 0 : current + 1); };
  return (
    <div className="relative aspect-[16/9] bg-[#0B0B0F] rounded-t-2xl overflow-hidden">
      <img src={images[current] || 'https://placehold.co/600x400'} alt="" className="w-full h-full object-cover cursor-zoom-in group-hover:scale-110 transition duration-500" onClick={() => setZoomImg(images[current])} />
      {images.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/80 active:scale-90">‹</button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/80 active:scale-90">›</button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => <div key={i} className={`w-2 h-2 rounded-full transition ${i === current? 'bg-yellow-400' : 'bg-white/50'}`}></div>)}
          </div>
        </>
      )}
      {zoomImg && (<div onClick={() => setZoomImg(null)} className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-zoom-out"><img src={zoomImg} className="max-w-full max-h-full object-contain" /></div>)}
    </div>
  )
}

function CursorPointer() {
  return (<div className="absolute -bottom-6 left-1/2 -translate-x-1/2 pointer-events-none"><motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity }}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-yellow-400 drop-shadow-lg"><path d="M12 2L3 20L12 17L21 20L12 2Z" fill="currentColor" stroke="black" strokeWidth="1.5"/></svg></motion.div><div className="absolute top-1 left-1 w-7 h-7 border-2 border-yellow-400 rounded-full animate-ping"></div></div>)
}

export default function HomePage() {
  const [mobil, setMobil] = useState([]); 
  const [rumah, setRumah] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [activeBtn, setActiveBtn] = useState('mobil');

  useEffect(() => { 
    const interval = setInterval(() => { 
      setActiveBtn(prev => prev === 'mobil'? 'rumah' : 'mobil'); 
    }, 2000); 
    return () => clearInterval(interval); 
  }, []);

  useEffect(() => {
    const getData = async () => {
      setLoading(true); setError(null);
      try {
        const [resMobil, resRumah] = await Promise.all([
          fetch(`${API_URL}/mobil/all-public`, { cache: 'no-store' }), 
          fetch(`${API_URL}/rumah/`, { cache: 'no-store' })
        ]);
        
        if (!resMobil.ok ||!resRumah.ok) throw new Error('Gagal fetch data');

        const dataMobil = await resMobil.json(); 
        const dataRumah = await resRumah.json();

        const mobilArray = Array.isArray(dataMobil)? dataMobil : [];
        const rumahArray = Array.isArray(dataRumah)? dataRumah : [];

        setMobil(mobilArray.slice(0, 8)); 
        setRumah(rumahArray.slice(0, 8));
      } catch (err) { 
        console.error(err);
        setError(err.message); 
      } finally { 
        setLoading(false); 
      }
    }; 
    getData();
  }, []);

  const pesanWA = (item, tipe) => { 
    const noWa = item.wa_showroom || item.wa_number || "62812PUSAT";
    const nama = tipe === 'rumah'? item.nama_rumah : item.nama_mobil || `${item.merek} ${item.tipe}`; 
    const text = `Halo Otopadang, saya tertarik dengan ${nama} seharga Rp ${item.harga?.toLocaleString('id-ID')}. Apakah masih tersedia?`; 
    window.open(`https://wa.me/${noWa}?text=${encodeURIComponent(text)}`, '_blank'); 
  }

  return (
    //... sisanya sama persis punya lu, gak usah diubah
    // copy aja semua dari return ke bawah
  )
}
