import Link from "next/link";

export default function CardShowroom({ showroom }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
      <h3 className="text-white">{showroom?.nama || "Showroom Padang"}</h3>
      <p className="mt-1 text-sm text-zinc-400">{showroom?.alamat || "Jl. By Pass Padang"}</p>
    </div>
  );
}
