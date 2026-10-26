
import Link from "next/link";

export default function CardMobil({ mobil }) {
  return (
    <Link href={`/mobil/${mobil.id}`} className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 transition hover:border-white/20">
      <div className="h-48 w-full bg-zinc-800 group-hover:bg-zinc-700 transition" />
      <div className="p-4">
        <h3 className="font-medium text-white">{mobil.merk} {mobil.model}</h3>
        <p className="mt-1 text-sm text-zinc-400">{mobil.tahun} • {mobil.lokasi}</p>
        <p className="mt-3 font-serif text-lg text-white">Rp {mobil.harga?.toLocaleString('id-ID')}</p>
      </div>
    </Link>
  );
}
