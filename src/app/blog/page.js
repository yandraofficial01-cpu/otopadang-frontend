export default function BlogPage() {
  // Nanti ini diganti data dari database
  const articles = [
    {
      id: 1,
      title: "Tips Beli Rumah Pertama di Padang",
      excerpt: "5 hal yang wajib kamu cek sebelum beli rumah pertama...",
      date: "25 Juli 2026"
    },
    {
      id: 2, 
      title: "Harga Mobil Bekas Naik? Ini Penyebabnya",
      excerpt: "Kenapa harga mobil second di 2026 pada naik semua...",
      date: "20 Juli 2026"
    }
  ]

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Blog OTO PADANG</h1>
      <p className="mb-8 text-gray-600">Tips, berita, dan panduan jual beli rumah & mobil</p>
      
      <div className="space-y-6">
        {articles.map((article) => (
          <div key={article.id} className="border rounded-lg p-6 hover:shadow-lg">
            <p className="text-sm text-gray-500">{article.date}</p>
            <h2 className="text-xl font-bold mt-2">{article.title}</h2>
            <p className="text-gray-700 mt-2">{article.excerpt}</p>
            <a href={`/blog/${article.id}`} className="text-blue-500 mt-3 inline-block">
              Baca Selengkapnya →
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
