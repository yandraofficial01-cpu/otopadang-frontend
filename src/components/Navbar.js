import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0B0F]/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="font-serif text-xl tracking-widest text-white">
          OTOPADANG<span className="text-zinc-500">.COM</span>
        </Link>
        <div className="flex items-center gap-6 text-sm text-zinc-400">
          <Link href="/mobil" className="hover:text-white">Mobil</Link>
          <Link href="/showroom" className="hover:text-white">Showroom</Link>
          <Link href="/login" className="rounded-full border border-white/20 px-4 py-1.5 text-white hover:bg-white hover:text-black">
            Masuk
          </Link>
        </div>
      </div>
    </nav>
  );
}
