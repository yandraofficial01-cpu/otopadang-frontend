export default function AdminPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Panel Admin OTO PADANG</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <a href="/dashboard" className="p-4 border rounded hover:bg-gray-100">
          <h2 className="font-bold">Dashboard</h2>
          <p className="text-sm">Lihat statistik</p>
        </a>

        <a href="/rumah/input" className="p-4 border rounded hover:bg-gray-100">
          <h2 className="font-bold">Input Rumah</h2>
          <p className="text-sm">Tambah data rumah</p>
        </a>

        <a href="/dashboard/mobil/input" className="p-4 border rounded hover:bg-gray-100">
          <h2 className="font-bold">Input Mobil</h2>
          <p className="text-sm">Tambah data mobil</p>
        </a>

        <a href="/rumah" className="p-4 border rounded hover:bg-gray-100">
          <h2 className="font-bold">Kelola Rumah</h2>
          <p className="text-sm">Edit / Hapus rumah</p>
        </a>

        <a href="/mobil" className="p-4 border rounded hover:bg-gray-100">
          <h2 className="font-bold">Kelola Mobil</h2>
          <p className="text-sm">Edit / Hapus mobil</p>
        </a>

        <a href="/blog" className="p-4 border rounded hover:bg-gray-100">
          <h2 className="font-bold">Kelola Blog</h2>
          <p className="text-sm">Tulis artikel</p>
        </a>
        
      </div>
    </div>
  )
}
