export default function DetailPage({ params }) {
  const { detail } = params // nama harus sama dengan nama folder

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Detail: {detail}</h1>
      <p>Ini halaman detail untuk: {detail}</p>
      <a href="/" className="text-blue-500">← Kembali</a>
    </div>
  )
}
