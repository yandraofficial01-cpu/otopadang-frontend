export default function SlugPage({ params }) {
  const { slug } = params

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">Halaman: {slug}</h1>
      <p className="mt-4 text-gray-600">
        Ini halaman dinamis buat: <b>/{slug}</b>
      </p>
      <p className="mt-2 text-sm text-gray-500">
        Nanti kita pake ini buat halaman detail rumah: /rumah-rumah-minimalis-padanga
      </p>
      <a href="/" className="text-blue-500 mt-6 inline-block">← Kembali ke Home</a>
    </div>
  )
}
