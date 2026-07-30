"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';

const fitur = [
  { icon: "🚗", title: "Mobil Bekas Berkualitas", desc: "Semua mobil sudah dicek 100+ titik oleh tim kami" },
  { icon: "🏠", title: "Rumah", desc: "Partner dengan developer terbaik di Padang" },
  { icon: "💎", title: "Proses Cepat & Aman", desc: "Transaksi mudah, legalitas terjamin" },
]

export default function HomePage() {
  return (
    <main className="bg-[#0B0B0F]">
      {/* NAVBAR */}
      <header className="bg-[#0B0B0F]/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-3xl font-bold gold-text">Otopadang</Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-300 hover:text-white font-medium hidden md:block">Login</Link>
            <Link href="/mobil/tambah" className="btn-gold!py-2!px-4 text-sm">+ Jual</Link>
          </div>
        </div>
      </header>

      {/* HERO BANNER */}
      <section className="relative h-[90vh] flex items-center justify-center text-center bg-black overflow-hidden">
        <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2070" className="absolute w-full h-full object-cover opacity-15" alt="Luxury Car"/>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] to-transparent"></div>

        <motion.div initial={{opacity: 0, y: 30}} animate={{opacity: 1, y: 0}} transition={{duration: 1, delay: 0.2}}>
          <h1 className="text-5xl md:text-8xl font-bold gold-text">Otopadang</h1>
          <p className="text-xl md:text-2xl mt-4 text-gray-300">Portal #1 Mobil & Rumah Mewah di Padang</p>
          <div className="mt-10 flex gap-4 justify-center">
            <a href="#fitur" className="btn-gold">Jelajahi</a>
            <Link href="/register-showroom" className="border border-yellow-500 text-yellow-400 font-bold py-3 px-6 rounded-lg hover:bg-yellow-500 hover:text-black transition">Daftar Showroom</Link>
          </div>
        </motion.div>
      </section>

      {/* FITUR SECTION */}
      <section id="fitur" className="container mx-auto max-w-7xl px-4 py-24">
        <motion.h2 initial={{opacity:0}} whileInView={{opacity:1}} className="text-4xl font-bold text-center mb-16 gold-text">Kenapa Pilih Kami</motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {fitur.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-[#1A1A1F] border border-gray-800 p-8 rounded-2xl text-center hover:border-yellow-500 transition-all duration-300"
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-gradient-to-r from-yellow-600 to-amber-400 text-black py-20 text-center">
        <h2 className="text-4xl font-bold mb-4">Punya Showroom?</h2>
        <p className="text-lg mb-6">Jangkau ribuan pembeli di Padang sekarang juga</p>
        <Link href="/register-showroom" className="bg-black text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-800 transition">Daftar Gratis</Link>
      </section>

      {/* FOOTER */}
      <footer className="bg-black border-t border-gray-900 py-10 text-center text-gray-500 text-sm">
        <p className="text-2xl font-bold gold-text mb-2">Otopadang</p>
        <p>© 2026 Otopadang.com - Elegance in Every Deal</p>
      </footer>
    </main>
  );
}
