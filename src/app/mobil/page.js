// JANGAN LUPA GANTI NOMOR WA INI
const NOMOR_WA_SHOWROOM = "6281234567890"; 

// Data dummy dulu
const dataMobilDummy = [
  { id: 1, judul: "Toyota Avanza 2020 Manual", harga: "Rp 185.000.000", lokasi: "Padang, Koto Tangah", img: "https://placehold.co/400x300/3B82F6/FFFFFF?text=Avanza" },
  { id: 2, judul: "Honda Brio RS 2022", harga: "Rp 165.000.000", lokasi: "Padang, Lubeg", img: "https://placehold.co/400x300/EF4444/FFFFFF?text=Brio" },
  { id: 3, judul: "Innova Zenix 2023", harga: "Rp 450.000.000", lokasi: "Padang, Padsel", img: "https://placehold.co/400x300/10B981/FFFFFF?text=Zenix" },
  { id: 4, judul: "Xpander 2021", harga: "Rp 220.000.000", lokasi: "Padang, Pauh", img: "https://placehold.co/400x300/F59E0B/FFFFFF?text=Xpander" },
];

export default function MobilPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Mobil Dijual di Padang</h1>
      
      {/* INI SEARCH FILTER KAYAK OLX */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <input type="text" placeholder="Cari merek, model..." className="border rounded-lg px-3 py-2" />
          <select className="border rounded-lg px-3 py-2"><option>Semua Harga</option></select>
          <select className="border rounded-lg px-3 py-2"><option>Semua Tahun</option></select>
          <button className="bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">Cari</button>
        </div>
      </div>

      {/* INI GRID CARD + TOMBOL WA */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {dataMobilDummy.map((mobil) => (
          <div key={mobil.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col">
            <img src={mobil.img} alt={mobil.judul} className="w-full h-40 object-cover" />
            <div className="p-3 flex-grow">
              <p className="font-bold text-lg">{mobil.harga}</p>
              <p className="text-sm mt-1 h-10 overflow-hidden">{mobil.judul}</p>
              <p className="text-xs text-gray-500 mt-2">{mobil.lokasi}</p>
            </div>

            {/* TOMBOL CHAT WA */}
            <div className="p-3 pt-0">
              <a 
                href={`https://wa.me/${NOMOR_WA_SHOWROOM}?text=Halo,%20saya%20tertarik%20dengan%20${encodeURIComponent(mobil.judul)}%20di%20Otopadang.com`} 
                target="_blank"
                className="w-full bg-green-500 hover:bg-green-600 text-white text-center py-2 rounded-lg font-semibold block"
              >
                Chat via WhatsApp
              </a>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}