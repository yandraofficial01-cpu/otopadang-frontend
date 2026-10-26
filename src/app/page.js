// SSR - JANGAN pakai "use client"
import Link from "next/link";
import ImageSliderClient from "@/components/ImageSliderClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getData() {
  try {
    const [resMobil, resRumah] = await Promise.all([
      fetch(`${API_URL}/cars/all-public`, { next: { revalidate: 60 } }),
      fetch(`${API_URL}/rumah/all-public`, { next: { revalidate: 60 } }),
    ]);
    
    const rawMobil = await resMobil.json();
    const rawRumah = await resRumah.json();
    
    return {
      mobil: (rawMobil.data || rawMobil || []).slice(0, 8),
      rumah: (rawRumah.data || rawRumah || []).slice(0, 8),
    };
  } catch (e) {
    return { mobil: [], rumah: [] };
  }
}

export default async function HomePage() {
  const { mobil, rumah } = await getData();

  return (
    <main className="min-h-screen bg-[#0B0B0F] text-white">
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0B0B0F]/80 border-b border-gray-800">
        <div className="container mx-auto max-w-7xl px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-yellow-400">Otopadang</Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/mobil" className="hover:text-yellow-400">Mobil</Link>
            <Link href="/rumah" className="hover:text-yellow-400">Rumah</Link>
            <Link href="/blog" className="hover:text-yellow-400">Blog</Link>
          </nav>
          <div className="flex gap-2">
            <Link href="/login-admin" className="px-3 py-2 text-xs border border-yellow-400 text-yellow-400 rounded-lg">Login Admin</Link>
          </div>
        </div>
      </header>

      <section className="container mx-auto max-w-7xl px-4 pt-28 pb-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Portal no 1 <span className="text-yellow-400">Urang Padang</span>
        </h1>
        <h2 className="text-2xl md:text-4xl font-semibold mb-6">Temukan Mobil & Rumah Impian Anda</h2>
        <div className="mt-8 flex gap-4 justify-center">
          <Link href="/mobil" className="px-8 py-3 bg-yellow-500 text-black font-bold rounded-lg">Cari Mobil</Link>
          <Link href="/rumah" className="px-8 py-3 border-2 border-yellow-400 text-yellow-400 font-bold rounded-lg">Cari Rumah</Link>
        </div>
      </section>

      {mobil.length > 0 && (
        <section className="container mx-auto max-w-7xl px-4 py-12">
          <h2 className="text-3xl font-bold mb-8">Mobil Terbaru (SSR)</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {mobil.map(item => (
              <div key={item.id} className="rounded-2xl border border-gray-800 bg-[#1A1A1F] overflow-hidden">
                <ImageSliderClient item={item} tipe="mobil" />
                <div className="p-5">
                  <h3 className="text-xl font-bold">{item.merek} {item.nama_mobil}</h3>
                  <p className="text-2xl font-bold text-yellow-400 my-2">Rp {item.harga?.toLocaleString('id-ID')}</p>
                  <p className="text-gray-400 text-sm">{item.tahun} • {item.kilometer?.toLocaleString()} KM</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {rumah.length > 0 && (
        <section className="container mx-auto max-w-7xl px-4 py-12">
          <h2 className="text-3xl font-bold mb-8">Rumah Terbaru (SSR)</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {rumah.map(item => (
              <div key={item.id} className="rounded-2xl border border-gray-800 bg-[#1A1A1F] overflow-hidden">
                <ImageSliderClient item={item} tipe="rumah" />
                <div className="p-5">
                  <h3 className="text-xl font-bold">{item.nama_rumah}</h3>
                  <p className="text-2xl font-bold text-yellow-400 my-2">Rp {item.harga?.toLocaleString('id-ID')}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
        }
