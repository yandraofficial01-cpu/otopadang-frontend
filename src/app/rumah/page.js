"use client"
import { useEffect, useState, useMemo } from "react";
import { X, MapPin, Home, Phone, Maximize } from "lucide-react";

const API_URL = "https://otopadang-api.vercel.app";

const DAERAH_SUMBAR = ["Semua Lokasi","Kota Padang", "Kota Bukittinggi", "Kota Payakumbuh", "Kota Pariaman", "Kota Padang Panjang", "Kota Solok", "Kota Sawahlunto","Kab. Padang Pariaman", "Kab. Pesisir Selatan", "Kab. Agam", "Kab. Tanah Datar", "Kab. Lima Puluh Kota","Kab. Pasaman", "Kab. Pasaman Barat", "Kab. Solok", "Kab. Solok Selatan", "Kab. Sijunjung", "Kab. Dharmasraya", "Kab. Kepulauan Mentawai"];

const RANGE_HARGA = [
  { label: "Semua Harga", min: 0, max: Infinity },
  { label: "100 Juta - 200 Juta", min: 100000000, max: 200000000 },
  { label: "200 Juta - 300 Juta", min: 200000000, max: 300000000 }, // UDAH DIBENERIN
  { label: "300 Juta - 400 Juta", min: 300000000, max: 400000 },
  { label: "400 Juta - 500 Juta", min: 400000000, max: 500000000 },
  { label: "500 Juta - 600 Juta", min: 500000000, max: 600000000 }, // UDAH DIBENERIN
  { label: "600 Juta - 700 Juta", min: 600000000, max: 700000000 },
  { label: "700 Juta - 800 Juta", min: 700000000, max: 800000000 },
  { label: "800 Juta - 900 Juta", min: 800000000, max: 900000000 },
  { label: "900 Juta - 1 Miliar", min: 900000000, max: 1000000000 },
  { label: "Di atas 1 Miliar", min: 1000000000, max: Infinity },
];

function DetailModal({ rumah, onClose }) {
  if(!rumah) return null;
  const images = [rumah.foto_url_1, rumah.foto_url_2, rumah.foto_url_3, rumah.foto_url_4, rumah.foto_url_5, rumah.foto_url_6, rumah.foto_url_7, rumah.foto_url_8].filter(Boolean);
  const pesanWA = () => {
    const noWa = rumah.wa_number || "628979879518";
    const text = `Halo Otopadang, saya tertarik dengan ${rumah.nama_rumah} seharga Rp ${rumah.harga?.toLocaleString('id-ID')}. Apakah masih tersedia?`;
    window.open(`https://wa.me/${noWa}?text=${encodeURIComponent(text)}`, '_blank');
  }
  return (
    <div className="fixed inset-0 bg-black/90 z-50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="max-w-4xl mx-auto bg-[#1A1A1F] rounded-2xl border border-yellow-400/20 my-8" onClick={e => e.stopPropagation()}>
        <div className="relative">
          <img src={images[0]} className="w-full h-80 object-cover rounded-t-2xl" alt=""/>
          <button onClick={onClose} className="absolute top-4 right-4 bg-black/60 p-2 rounded-full"><X/></button>
        </div>
        <div className="p-6">
          <h2 className="text-3xl font-bold text-yellow-400">{rumah.nama_rumah}</h2>
          <p className="text-gray-400 flex items-center gap-2 mt-1"><MapPin size={16}/> {rumah.alamat}</p>
          <p className="text-3xl font-black text-white mt-4">Rp {rumah.harga?.toLocaleString('id-ID')}</p>
          
          <div className="grid grid-cols-3 gap-4 my-6 text-center">
            <div className="bg-black/30 p-3 rounded-lg"><p className="text-xs text-gray-400">Luas Tanah</p><p className="font-bold">{rumah.luas_tanah} m²</p></div>
            <div className="bg-black/30 p-3 rounded-lg"><p className="text-xs text-gray-400">Luas Bangunan</p><p className="font-bold">{rumah.luas_bangunan} m²</p></div>
            <div className="bg-black/30 p-3 rounded-lg"><p className="text-xs text-gray-400">Type</p><p className="font-bold">{rumah.tipe}</p></div>
          </div>

          <h3 className="font-bold mb-2">Spesifikasi</h3>
          <p className="text-gray-300 bg-black/30 p-3 rounded-lg whitespace-pre-line">{rumah.spesifikasi || "-"}</p>

          <h3 className="font-bold mb-2 mt-4">Galeri Foto</h3>
          <div className="grid grid-cols-4 gap-2">
            {images.map(img => <img key={img} src={img} className="w-full h-24 object-cover rounded-lg" alt=""/>) }
          </div>

          {rumah.badge_bonus && <span className="inline-block mt-4 text-sm bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full">🎁 {rumah.badge_bonus}</span>}
          
          <button onClick={pesanWA} className="w-full mt-6 bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-4 rounded-lg flex items-center justify-center gap-2">
            <Phone size={20}/> Hubungi via WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}

export default function RumahPage() {
  const [rumahList, setRumahList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRumah, setSelectedRumah] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLokasi, setFilterLokasi] = useState("Semua Lokasi");
  const [filterHarga, setFilterHarga] = useState(RANGE_HARGA[0]);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/rumah`, { cache: 'no-store' }); // GANTI KE /rumah
        const data = await res.json();
        setRumahList(Array.isArray(data)? data : data.data || []);
      } catch (err) { console.error(err) } finally { setLoading(false); }
    };
    getData();
  }, []);

  const filteredRumah = useMemo(() => {
    return rumahList.filter(r => {
      const matchSearch = r.nama_rumah?.toLowerCase().includes(searchTerm.toLowerCase());
      const keywordLokasi = filterLokasi.replace("Kota ", "").replace("Kab. ", "").toLowerCase();
      const matchLokasi = filterLokasi === "Semua Lokasi" || r.alamat?.toLowerCase().includes(keywordLokasi);
      const matchHarga = (r.harga || 0) >= filterHarga.min && (r.harga || 0) < filterHarga.max;
      return matchSearch && matchLokasi && matchHarga;
    });
  }, [rumahList, searchTerm, filterLokasi, filterHarga]);

  return (
    <main className="min-h-screen bg-[#0B0B0F] container mx-auto max-w-7xl px-4 py-16">
      <DetailModal rumah={selectedRumah} onClose={() => setSelectedRumah(null)} />
      
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-yellow-400">Temukan Rumah Impianmu</h1>
      </div>

      <div className="bg-[#1A1A1F] p-4 rounded-xl border border-gray-800 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input type="text" placeholder="Cari nama rumah..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-[#0B0B0F] border border-gray-700 rounded-lg px-4 py-2" />
        <select value={filterLokasi} onChange={(e) => setFilterLokasi(e.target.value)} className="bg-[#0B0B0F] border border-gray-700 rounded-lg px-4 py-2">
          {DAERAH_SUMBAR.map(lok => <option key={lok} value={lok}>{lok}</option>)}
        </select>
        <select value={JSON.stringify(filterHarga)} onChange={(e) => setFilterHarga(JSON.parse(e.target.value))} className="bg-[#0B0B0F] border border-gray-700 rounded-lg px-4 py-2">
          {RANGE_HARGA.map(range => <option key={range.label} value={JSON.stringify(range)}>{range.label}</option>)}
        </select>
      </div>

      {loading? <p className="text-center">Loading...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredRumah.map((r) => (
            <div key={r.id} onClick={() => setSelectedRumah(r)} className="bg-[#1A1A1F] rounded-xl overflow-hidden border border-gray-800 hover:border-yellow-400 cursor-pointer">
              <img src={r.foto_url_1} alt="" className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-lg text-white">{r.nama_rumah}</h3>
                <p className="text-gray-400 text-sm flex items-center gap-1"><MapPin size={12}/> {r.alamat}</p>
                <p className="text-yellow-400 font-bold text-xl mt-2">Rp {r.harga?.toLocaleString('id-ID')}</p>
                <p className="text-gray-400 text-sm mt-1 flex items-center gap-1"><Home size={12}/> {r.luas_bangunan}m² | {r.tipe}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
