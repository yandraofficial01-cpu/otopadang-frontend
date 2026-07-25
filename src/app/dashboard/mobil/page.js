export default function KelolaMobil() {
  // Nanti ini ambil dari database
  const mobilList = []

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kelola Data Mobil</h1>
        <a href="/dashboard/mobil/input" className="bg-red-500 text-white px-4 py-2 rounded">
          + Tambah Mobil
        </a>
      </div>

      {mobilList.length === 0 ? (
        <div className="border rounded-lg p-8 text-center">
          <p className="text-gray-500">Belum ada data mobil</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Nanti di loop dari database */}
        </div>
      )}
    </div>
  )
}
