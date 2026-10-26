"use client"
import { useState } from "react";

export default function ImageSliderClient({ item, tipe }) {
  const [current, setCurrent] = useState(0);
  const [zoomImg, setZoomImg] = useState(null);
  const imageUrls = [
    item.foto_url_1, item.foto_url_2, item.foto_url_3, item.foto_url_4,
    item.foto_url_5, item.foto_url_6, item.foto_url_7, item.foto_url_8
  ].filter(url => url);

  const prev = (e) => { e.stopPropagation(); setCurrent(current === 0 ? imageUrls.length - 1 : current - 1); };
  const next = (e) => { e.stopPropagation(); setCurrent(current === imageUrls.length - 1 ? 0 : current + 1); };

  return (
    <div className="relative aspect-[16/9] bg-[#0B0B0F] overflow-hidden">
      <img src={imageUrls[current] || 'https://placehold.co/600x400'} alt="foto" className="w-full h-full object-cover cursor-zoom-in" onClick={() => setZoomImg(imageUrls[current])} />
      {imageUrls.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full">‹</button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full">›</button>
        </>
      )}
      {zoomImg && <div onClick={() => setZoomImg(null)} className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"><img src={zoomImg} className="max-w-full max-h-full" /></div>}
    </div>
  );
}
