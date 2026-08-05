export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0B0B0F]">
      {/* HERO SECTION */}
      <section className="container mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold">
          <span className="text-yellow-400">Elegance</span> in Every Deal
        </h1>
        <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
          Portal #1 Jual Beli Mobil & Rumah di Padang. Terpercaya, Cepat, Aman.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link href="/mobil" className="px-8 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition">
            Cari Mobil
          </Link>
          <Link href="/rumah" className="px-8 py-3 border border-yellow-400 text-yellow-400 font-bold rounded-lg hover:bg-yellow-400 hover:text-black transition">
            Cari Rumah
          </Link>
        </div>
      </section>

      {/* LIST MOBIL TERBARU */}
      <section className="container mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-white">Mobil Terbaru di Padang</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          {/* CARD 1 */}
          <div className="bg-[#1A1A1F] rounded-xl overflow-hidden border-gray-800 hover:border-yellow-400 transition group">
            <img src="https://placehold.co/600x400/1A1A1F/FFD700?text=Alphard" alt="Alphard" className="w-full h-48 object-cover group-hover:scale-105 transition"/>
            <div className="p-4">
              <h3 className="font-bold text-lg text-white">Toyota Alphard 2022</h3>
              <p className="text-gray-400 text-sm">Padang, Sumatera Barat</p>
              <p className="text-yellow-400 font-bold text-xl mt-2">Rp 850.000.000</p>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="bg-[#1A1A1F] rounded-xl overflow-hidden border-gray-800 hover:border-yellow-400 transition group">
            <img src="https://placehold.co/600x400/1A1A1F/FFD700?text=Brio" alt="Brio" className="w-full h-48 object-cover group-hover:scale-105 transition"/>
            <div className="p-4">
              <h3 className="font-bold text-lg text-white">Honda Brio RS 2021</h3>
              <p className="text-gray-400 text-sm">Padang, Sumatera Barat</p>
              <p className="text-yellow-400 font-bold text-xl mt-2">Rp 180.000.000</p>
            </div>
          </div>

          {/* CARD 3 */}
          <div className="bg-[#1A1A1F] rounded-xl overflow-hidden border-gray-800 hover:border-yellow-400 transition group">
            <img src="https://placehold.co/600x400/1A1A1F/FFD700?text=Fortuner" alt="Fortuner" className="w-full h-48 object-cover group-hover:scale-105 transition"/>
            <div className="p-4">
              <h3 className="font-bold text-lg text-white">Toyota Fortuner 2020</h3>
              <p className="text-gray-400 text-sm">Padang, Sumatera Barat</p>
              <p className="text-yellow-400 font-bold text-xl mt-2">Rp 450.000.000</p>
            </div>
          </div>

        </div>
      </section>
    </main>
  )
}

import Link from "next/link"; // JANGAN LUPA INI
