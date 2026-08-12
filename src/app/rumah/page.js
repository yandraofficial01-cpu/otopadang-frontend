"use client"
import { useEffect, useState, useMemo } from "react";

const API_URL = "https://otopadang-api.up.railway.app";

// 1. LIST KOTA POPULER BUAT TOMBOL CEPAT
const KOTA_POPULER = [
  { nama: "Padang", emoji: "🏙️" },
  { nama: "Bukittinggi", emoji: "⛰️" },
  { nama: "Payakumbuh", emoji: "🏡" },
  { nama: "Pariaman", emoji: "🏖️" },
  { nama: "Solok", emoji: "🌾" },
];

// 2. LIST LENGKAP 19 KAB/KOTA SUMBAR BUAT DROPDOWN
const DAERAH_SUMBAR = [
  "Semua Lokasi",
  "Kota Padang", "Kota Bukittinggi", "Kota Payakumbuh", "Kota Pariaman", "Kota Padang Panjang", "Kota Solok", "Kota Sawahlunto",
  "Kab. Padang Pariaman", "Kab. Pesisir Selatan", "Kab. Agam", "Kab. Tanah Datar", "Kab. Lima Puluh Kota",
  "Kab. Pasaman", "Kab. Pasaman Barat", "Kab. Solok", "Kab. Solok Selatan", "Kab. Sijunjung", "Kab. Dharmasraya", "Kab. Kep. Mentawai"
];

// 3. RANGE HARGA PER 100JT
const RANGE_HARGA = [
  { label: "Semua Harga", min: 0, max: Infinity },
  { label: "100 Juta - 200 Juta", min: 100000000, max: 200000000 },
  { label: "200 Juta - 300 Juta", min: 200000000, max: 300000000 },
  { label: "300 Juta - 400 Juta", min: 300000000, max: 400000000 },
  { label: "400 Juta - 500 Juta", min: 400000000, max: 500000000 },
  { label: "500 Juta - 600 Juta", min: 500000, max: 600000 },
  { label: "600 Juta - 700 Juta", min: 600000, max: 700000 },
  { label: "700 Juta - 800 Juta", min: 700000, max: 800000000 },
  { label: "800 Juta - 900 Juta", min: 800000, max: 900000 },
  { label: "900 Juta - 1 Miliar", min: 900000, max: 1000000 },
  { label: "Di atas 1 Miliar", min: 1000000000, max: Infinity },
];

function ImageSlider({ images }) {
  const [current, setCurrent] = useState(0);
  const prev = (e) => { e.stopPropagation(); setCurrent(current === 0? images.length - 1 : current - 1); };
  const next = (e) => { e.stopPropagation(); setCurrent(current === images.length - 1? 0 : current + 1); };
  return ( <div className="relative overflow-hidden"><img src={images[current] || 'https://placehold.co/600x400'} alt="" className="w-full h-48 object-cover group-hover:scale-110 transition duration-500" />{images.length > 1 && (<><button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 active:scale-90">‹</button><button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 active:scale-90">›</button><div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">{images.map((_, i) => <div key={i} className={`w-2 h-2 rounded-full transition ${i === current? 'bg-yellow-400' : 'bg-white/50'}`}></div>)}</div></>)}</div> )
}

export default function RumahPage() {
  const [rumahList, setRumahList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLokasi, setFilterLokasi] = useState("Semua Lokasi");
  const [filterHarga, setFilterHarga] = useState(RANGE_HARGA[0]);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/rumah/`, { cache: 'no-store' });
        const result = await res.json();
        const data = Array.isArray(result)? result : result.data || [];
        setRumahList(data);
      } catch (err) { setError(err.message); } finally { setLoading(false); }
    };
    getData();
  }, []);

  const filteredRumah = useMemo(() => {
    return rumahList.filter(r => {
      const matchSearch = r.nama_rumah.toLowerCase().includes(searchTerm.toLowerCase());
      const keywordLokasi = filterLokasi.replace("Kota ", "").replace("Kab. ", "").toLowerCase();
      const matchLokasi = filterLokasi === "Semua Lokasi" || r.alamat.toLowerCase().includes(keywordLokasi);
      const matchHarga = r.harga >= filterHarga.min && r.harga < filterHarga.max;
      return matchSearch && matchLokasi && matchHarga;
    });
  }, [rumahList, searchTerm, filterLokasi, filterHarga]);

  const handlePilihKota = (namaKota) => {
    // Otomatis set dropdown ke "Kota Padang" dll
    const fullName = DAERAH_SUMBAR.find(d => d.includes(namaKota));
    setFilterLokasi(fullName || `Kota ${namaKota}`);
    window.scrollTo({ top: 250, behavior: 'smooth' }); // scroll ke hasil
  }

  const resetFilter = () => {
    setSearchTerm("");
    setFilterLokasi("Semua Lokasi");
    setFilterHarga(RANGE_HARGA[0]);
  }

  const pesanWA = (item) => {
    const noWa = item.wa_number || "62812PUSAT";
    const text = `Halo Otopadang, saya tertarik dengan ${item.nama_rumah} seharga Rp ${item.harga?.toLocaleString('id-ID')}. Apakah masih tersedia?`;
    window.open(`https://wa.me/${noWa}?text=${encodeURIComponent(text)}`, '_blank');
  }

  return (
    <main className="min-h-screen bg-[#0B0B0F] container mx-auto max-w-7xl px-4 py-16">
      <div className="text-center mb-8 animate-fade-in-down">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 animate-gradient-text">Temukan Rumah Impianmu</h1>
        <p className="text-gray-400 text-lg">Ratusan pilihan rumah terbaik di Sumatera Barat. Dari subsidi sampai mewah.</p>
      </div>

      {/* TOMBOL KOTA POPULER */}
      <div className="mb-6 animate-fade-in-up">
        <p className="text-gray-400 text-sm mb-3 text-center">Cari cepat berdasarkan kota:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {KOTA_POPULER.map(kota => (
            <button key={kota.nama} onClick={() => handlePilihKota(kota.nama)}
              className="bg-[#1A1A1F] border-gray-700 hover:border-yellow-400 text-white px-4 py-2 rounded-full transition active:scale-95">
              {kota.emoji} {kota.nama}
            </button>
          ))}
        </div>
      </div>

      {/* BOX FILTER */}
      <div className="bg-[#1A1A1F] p-4 rounded-xl border border-gray-800 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in-up">
        <input type="text" placeholder="Cari nama rumah..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="md:col-span-2 bg-[#0B0B0F] border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-yellow-400 outline-none" />

        <select value={filterLokasi} onChange={(e) => setFilterLokasi(e.target.value)} className="bg-[#0B0B0F] border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-yellow-400 outline-none">
          {DAERAH_SUMBAR.map(lok => <option key={lok} value={lok}>{lok}</option>)}
        </select>

        <select value={JSON.stringify(filterHarga)} onChange={(e) => setFilterHarga(JSON.parse(e.target.value))} className="bg-[#0B0B0F] border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-yellow-400 outline-none">
          {RANGE_HARGA.map(range => <option key={range.label} value={JSON.stringify(range)}>{range.label}</option>)}
        </select>
      </div>

      <div className="flex justify-end mb-4">
        <button onClick={resetFilter} className="text-yellow-400 text-sm hover:underline">Reset Filter</button>
      </div>

      {loading && <p className="text-gray-400 text-center">Loading...</p>}
      {!loading && filteredRumah.length === 0 && <p className="text-gray-400 text-center">Rumah tidak ditemukan di {filterLokasi} dengan range {filterHarga.label}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredRumah.map((r, i) => {
          const images = [r.foto_url_1, r.foto_url_2, r.foto_url_3, r.foto_url_4, r.foto_url_5].filter(Boolean);
          return (
            <div key={r.id} style={{ animationDelay: `${i * 100}ms` }} className={`bg-[#1A1A1F] rounded-xl overflow-hidden border border-gray-800 hover:border-yellow-400 hover:shadow-2xl hover:shadow-yellow-500/20 hover:-translate-y-2 hover:scale-[1.02] transition-all duration-500 group animate-fade-in-up`}>
              <ImageSlider images={images} />
              <div className="p-4">
                <h3 className="font-bold text-lg text-white">{r.nama_rumah}</h3>
                <p className="text-gray-400 text-sm">{r.alamat}</p>
                <p className="text-yellow-400 font-bold text-xl mt-2">Rp {r.harga?.toLocaleString('id-ID')}</p>
                <p className="text-gray-400 text-sm mt-1">{r.luas_bangunan}m² | {r.tipe} | Tanah: {r.luas_tanah}m²</p>
                {r.badge_bonus && <span className="inline-block mt-2 text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">{r.badge_bonus}</span>}
                <button onClick={() => pesanWA(r)} className="w-full mt-4 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition">Hubungi Penjual via WA</button>
              </div>
            </div>
          )
        })}
      </div>

      <style jsx global>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
    .animate-fade-in-up { opacity: 0; animation: fadeInUp 0.6s ease-out forwards; }
    .animate-fade-in-down { animation: fadeInDown 0.8s ease-out forwards; }
    .animate-gradient-text { background: linear-gradient(90deg, #FACC15, #FFFFFF, #FACC15); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: gradient 3s linear infinite; text-shadow: 0 0 20px rgba(250, 204, 21, 0.3); }
      `}</style>
    </main>
  )
}
