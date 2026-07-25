export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>
      
      {/* Statistik Cepat */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 border rounded-lg bg-blue-50">
          <p className="text-sm text-gray-600">Total Rumah</p>
          <h2 className="text-2xl font-bold">0</h2>
        </div>
        <div className="p-6 border rounded-lg bg-red-50">
          <p className="text-sm text-gray-600">Total Mobil</p>
          <h2 className="text-2xl font-bold">0</h2>
        </div>
        <div className="p-6 border rounded-lg bg-green-50">
          <p className="text-sm text-gray-600">Total Showroom</p>
          <h2 className="text-2xl font-bold">0</h2>
        </div>
      </div>

      {/* Menu Aksi Cepat */}
      <h2 className="text-xl font-bold mb-4">Aksi Cepat</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <a href="/rumah/input" className="p-4 border rounded hover:bg-gray-100 text-center">
          + Input Rumah
        </a>
        <a href="/dashboard/mobil/input" className="p-4 border rounded hover:bg-gray-100 text-center">
          + Input Mobil
        </a>
        <a href="/rumah" className="p-4 border rounded hover:bg-gray-100 text-center">
          Kelola Rumah
        </a>
        <a href="/mobil" className="p-4 border rounded hover:bg-gray-100 text-center">
          Kelola Mobil
        </a>
      </div>

      {/* Aktivitas Terbaru */}
      <h2 className="text-xl font-bold mt-8 mb-4">Aktivitas Terbaru</h2>
      <div className="border rounded-lg p-4">
        <p className="text-gray-500">Belum ada aktivitas</p>
      </div>
    </div>
  )
}
