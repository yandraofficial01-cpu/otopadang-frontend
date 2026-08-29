"use client"
import { useEffect, useState, useMemo } from "react";
import { X, MapPin, Home, Phone, Ruler, Maximize, Share2, MessageCircle } from "lucide-react";

const API_URL = "https://otopadang-api.vercel.app";

const DAERAH_SUMBAR = ["Semua Lokasi","Kota Padang", "Kota Bukittinggi", "Kota Payakumbuh", "Kota Pariaman", "Kota Padang Panjang", "Kota Solok", "Kota Sawahlunto","Kab. Padang Pariaman", "Kab. Pesisir Selatan", "Kab. Agam", "Kab. Tanah Datar", "Kab. Lima Puluh Kota","Kab. Pasaman", "Kab. Pasaman Barat", "Kab. Solok", "Kab. Solok Selatan", "Kab. Sijunjung", "Kab. Dharmasraya", "Kab. Kepulauan Mentawai"];

const RANGE_HARGA = [ // UDAH DIBENERIN 100%
  { label: "Semua Harga", min: 0, max: Infinity },
  { label: "100 Juta - 200 Juta", min: 100000000, max: 200000000 },
  { label: "200 Juta - 300 Juta", min: 200000000, max: 300000000 },
  { label: "300 Juta - 400 Juta", min: 300000000, max: 400000000 },
  { label: "400 Juta - 500 Juta", min: 400000000, max: 500000000 },
  { label: "500 Juta - 600 Juta", min: 500000000, max: 600000 }, // FIX
  { label: "600 Juta - 700 Juta", min: 600000000, max: 700000000 }, // FIX
  { label: "700 Juta - 800 Juta", min: 700000, max: 800000000 }, // FIX
  { label: "800 Juta - 900 Juta", min: 800000, max: 900000000 },
  { label: "900 Juta - 1 Miliar", min: 900000000, max: 1000000000 }, // FIX
  { label: "Di atas 1 Miliar", min: 1000000, max: Infinity },
];

const TABS = ["Semua", "Ready", "Pre-Project", "DP Ringan"];

function DetailModal({ rumah, onClose }) {
  if(!rumah) return null;
  const images = [rumah.foto_url_1, rumah.foto_url_2, rumah.foto_url_3, rumah.foto_url_4, rumah.foto_url_5, rumah.foto_url_6, rumah.foto_url_7, rumah.foto_url_8].filter(Boolean);
  const pesanWA = () => {
    const noWa = rumah.wa_number || "628979879518";
    const text = `Halo Otopadang, saya tertarik dengan *${rumah.nama_rumah}* di ${rumah.alamat} seharga *Rp ${rumah.harga?.toLocaleString('id-ID')}*. Apakah masih tersedia?`;
    window.open(`https://wa.me/${noWa}?text=${encodeURIComponent(text)}`, '_blank');
  }
  return (
    <div className="fixed inset-0 bg-black/90 z-50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="max-w-5xl mx-auto bg-[#1A1A1F] rounded-2xl border border-yellow-400/20 my-8" onClick={e => e.stopPropagation()}>
        <div className="relative">
          <img src={images[0]} className="w-full h-96 object-cover rounded-t-2xl" alt=""/>
          <button onClick={onClose} className="absolute top-4 right-4 bg-black/60 p-2 rounded-full text-white"><X/></button>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="text-3xl font-bold text-yellow-400">{rumah.nama_rumah}</h2>
          <p className="text-gray-400 flex items-center gap-2 mt-1"><MapPin size={16}/> {rumah.alamat}</p>
          <p className="text-4xl font-black text-white mt-4">Rp {rumah.harga?.toLocaleString('id-ID')}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6 text-center">
            <div className="bg-black/30 p-3 rounded-lg"><Ruler size={18} className="mx-auto mb-1 text-yellow-400"/><p className="text-xs text-gray-400">Luas Tanah</p><p className="font-bold">{rumah.luas_tanah} m²</p></div>
            <div className="bg-black/30 p-3 rounded-lg"><Home size={18} className="mx-auto mb-1 text-yellow-400"/><p className="text-xs text-gray-400">Luas Bangunan</p><p className="font-bold">{rumah.luas_bangunan} m²</p></div>
            <div className="bg-black/30 p-3 rounded-lg"><Maximize size={18} className="mx-auto mb-1 text-yellow-400"/><p className="text-xs text-gray-400">Type</p><p className="font-bold">{rumah.tipe}</p></div>
            <div className="bg-black/30 p-3 rounded-lg"><p className="text-xs text-gray-400">Angsuran</p><p className="font-bold">Rp {rumah.angsuran?.toLocaleString('id-ID')}/bln</p></div>
          </div>
          <h3 className="font-bold text-lg mb-2">Spesifikasi Lengkap</h3>
          <p className="text-gray-300 bg-black/30 p-4 rounded-lg whitespace-pre-line">{rumah.spesifikasi || "Belum ada spesifikasi"}</p>
          <h3 className="font-bold text-lg mb-2 mt-6">Galeri Foto</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {images.map((img, i) => <img key={i} src={img} className="w-full h-32 object-cover rounded-lg" alt=""/>)}
          </div>
          {rumah.badge_bonus && <span className="inline-block mt-4 text-sm bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full">🎁 {rumah.badge_bonus}</span>}
          <button onClick={pesanWA} className="w-full mt-6 bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-4 rounded-lg flex items-center justify-center gap-2 text-lg">
            <Phone size={20}/> Hubungi Penjual via WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}

function ImageSlider({ images }) {
  const [current, setCurrent] = useState(0);
  const validImages = images.filter(Boolean);
  if (validImages.length === 0) validImages.push('https://placehold.co/600x400/1A1A1F/FACC15?text=No+Image');
  const prev = (e) => { e.stopPropagation(); setCurrent(current === 0? validImages.length - 1 : current - 1); };
  const next = (e) => { e.stopPropagation(); setCurrent(current === validImages.length - 1? 0 : current + 1); };
  return (
    <div className="relative overflow-hidden">
      <img src={validImages[current]} alt="" className="w-full h-48 object-cover group-hover:scale-110 transition duration-500" />
      {validImages.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full">‹</button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full">›</button>
        </>
      )}
    </div>
  )
}

export default function RumahPage() {
  const [rumahList, setRumahList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRumah, setSelectedRumah] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLokasi, setFilterLokasi] = useState("Semua Lokasi");
  const [filterLokasiDetail, setFilterLokasiDetail] = useState("");
  const [filterHarga, setFilterHarga] = useState(RANGE_HARGA[0]);
  const [activeTab, setActiveTab] = useState("Semua");

  useEffect(() => {
    fetch(`${API_URL}/rumah/all-public`, { cache: 'no-store' })
      .then(res => res.json())
      .then(result => setRumahList(Array.isArray(result)? result : result.data || []))
      .finally(() => setLoading(false));
  }, []);

  const filteredRumah = useMemo(() => {
    let data = rumahList;
    // Filter Tab
    if(activeTab !== "Semua") {
      data = data.filter(r => r.status?.toLowerCase().includes(activeTab.toLowerCase().replace("-", "")))
    }
    // Filter lainnya
    return data.filter(r => {
      const matchSearch = r.nama_rumah?.toLowerCase().includes(searchTerm.toLowerCase());
      const keywordLokasi = filterLokasi.replace("Kota ", "").replace("Kab. ", "").toLowerCase();
      const matchLokasi = filterLokasi === "Semua Lokasi" || r.alamat?.toLowerCase().includes(keywordLokasi);
      const matchLokasiDetail = filterLokasiDetail === "" || r.alamat?.toLowerCase().includes(filterLokasiDetail.toLowerCase());
      const matchHarga = (r.harga || 0) >= filterHarga.min && (r.harga || 0) < filterHarga.max;
      return matchSearch && matchLokasi && matchLokasiDetail && matchHarga;
    });
  }, [rumahList, searchTerm, filterLokasi, filterLokasiDetail, filterHarga, activeTab]);

  const pesanWA = (item) => {
    const noWa = item.wa_number || "628979879518";
    const text = `Halo Otopadang, saya tertarik dengan *${item.nama_rumah}*`;
    window.open(`https://wa.me/${noWa}?text=${encodeURIComponent(text)}`, '_blank');
  }
  const handleShare = (item) => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link disalin")
  }

  return (
    <main className="min-h-screen bg-[#0B0B0F] text-white pb-20">
      <DetailModal rumah={selectedRumah} onClose={() => setSelectedRumah(null)} />
      
      <div className="sticky top-0 bg-[#0B0B0F] z-10 p-4 border-b border-gray-800">
        {/* TAB FILTER KAYA DI SS */}
        <div className="flex bg-[#1A1A1F] p-1 rounded-lg">
          {TABS.map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-sm font-semibold rounded-md ${activeTab === tab ? 'bg-blue-500 text-white' : 'text-gray-400'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* FILTER 4 KOLOM */}
        <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-2">
          <input type="text" placeholder="Cari nama rumah..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-[#1A1A1F] border-gray-700 rounded-lg px-4 py-2" />
          <select value={filterLokasi} onChange={(e) => setFilterLokasi(e.target.value)} className="bg-[#1A1A1F] border border-gray-700 rounded-lg px-4 py-2">{DAERAH_SUMBAR.map(lok => <option key={lok} value={lok}>{lok}</option>)}</select>
          <input type="text" placeholder="Contoh: Kuranji" value={filterLokasiDetail} onChange={(e) => setFilterLokasiDetail(e.target.value)} className="bg-[#1A1A1F] border-gray-700 rounded-lg px-4 py-2" />
          <select value={JSON.stringify(filterHarga)} onChange={(e) => setFilterHarga(JSON.parse(e.target.value))} className="bg-[#1A1A1F] border border-gray-700 rounded-lg px-4 py-2">{RANGE_HARGA.map(range => <option key={range.label} value={JSON.stringify(range)}>{range.label}</option>)}</select>
        </div>
      </div>

      {loading && <p className="text-center p-10">Loading...</p>}
      
      <div className="p-4 space-y-4">
        {filteredRumah.map((r) => (
          <div key={r.id} className="bg-[#1A1A1F] rounded-2xl border-2 border-blue-500/50 p-3">
            <div className="flex justify-between items-start mb-2">
              <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-lg">{r.status?.toUpperCase() || "READY"}</span>
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">🔥 HOT</span>
            </div>

            <div onClick={() => setSelectedRumah(r)} className="cursor-pointer">
              <h3 className="text-xl font-bold">{r.nama_rumah}</h3>
              <div className="text-gray-300 text-sm mt-2 space-y-1">
                <p><b>Harga:</b>{(r.harga / 1000000).toFixed(0)}jt</p>
                <p><b>Luas:</b>{r.luas_bangunan}m²</p>
                <p className="flex items-center gap-1"><MapPin size={12}/><b>Lokasi:</b>{r.alamat}</p>
              </div>
              <ImageSlider images={[r.foto_url_1, r.foto_url_2, r.foto_url_3, r.foto_url_4, r.foto_url_5, r.foto_url_6, r.foto_url_7, r.foto_url_8]} />
            </div>

            <div className="flex gap-2 mt-3">
              <button onClick={() => pesanWA(r)} className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2">
                <Phone size={16}/> Hubungi via WhatsApp
              </button>
              <button onClick={() => handleShare(r)} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg">
                <Share2 size={16}/>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* FLOATING WA */}
      <a href="https://wa.me/628979879518" target="_blank" className="fixed bottom-6 right-6 bg-green-500 p-4 rounded-full shadow-lg">
        <MessageCircle size={28} fill="white"/>
      </a>
    </main>
  )
}
