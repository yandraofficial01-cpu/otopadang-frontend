export default function RumahPage() {
  // Nanti ini ambil dari database
  const rumahList = []

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Daftar Rumah di Padang</h1>
        <a href="/rumah/input" className="bg-blue-500 text-white px-4 py-2 rounded">
          + Jual Rumah
        </a>
      </div>

      {rumahList.length === 0 ? (
        <div className="border rounded-lg p-12 text-center">
          <p className="text-gray-500 text-lg">Belum ada data rumah</p>
          <p className="text-sm text-gray-400 mt-2">Jadilah yang pertama jual rumah di sini</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Nanti di loop dari database */}
        </div>
      )}
    </div>
  )
}
