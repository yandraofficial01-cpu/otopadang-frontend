export default function ShowroomPage({ params }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Showroom: {params.slug}</h1>
      <p className="mt-2">Ini halaman detail untuk showroom {params.slug}</p>
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Daftar Mobil & Rumah</h2>
        <p>Belum ada data</p>
      </div>
    </div>
  )
}
