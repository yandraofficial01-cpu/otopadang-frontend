'use client'
import { useEffect, useState } from "react";

export default function ApproveShowroomPage() {
  const [showrooms, setShowrooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = "https://otopadang-api.vercel.app";
  const token = localStorage.getItem("token"); 

  const fetchShowrooms = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/showroom/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if(!res.ok) throw new Error("Gagal fetch");
      const data = await res.json();
      setShowrooms(data);
    } catch (e) {
      console.log(e);
      alert("Gagal ambil data showroom. Cek token/CORS");
    }
    setLoading(false);
  };

  const approve = async (id) => {
    if(!confirm("Yakin mau approve showroom ini?")) return;
    const res = await fetch(`${API}/admin/showroom/${id}/approve`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` }
    });
    if(res.ok){
      alert("Berhasil di approve!");
      fetchShowrooms();
    } else {
      alert("Gagal approve");
    }
  };

  const hapus = async (id, nama) => {
    if(!confirm(`Yakin mau hapus showroom ${nama}?`)) return;
    const res = await fetch(`${API}/admin/showroom/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if(res.ok){
      alert("Berhasil dihapus!");
      fetchShowrooms();
    } else {
      alert("Gagal hapus");
    }
  };

  useEffect(() => { 
    fetchShowrooms() 
  }, []);

  // INI KUNCINYA: FILTER CUMA YANG PENDING
  const pendingList = showrooms.filter(s => s.status === 'pending');

  return (
    <div className="p-6 bg-[#0B0B0F] min-h-screen text-white">
      <h1 className="text-2xl font-bold text-yellow-400 mb-2">Approve Showroom</h1>
      <p className="text-gray-400 mb-6">List showroom yg nunggu di approve akan muncul disini</p>

      {loading && <p className="text-gray-400">Loading...</p>}

      {!loading && pendingList.length === 0 && (
        <p className="text-gray-400">Belum ada showroom pending</p>
      )}

      <div className="grid gap-4">
        {pendingList.map(s => (
          <div key={s.id} className="bg-zinc-900 border-zinc-800 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-white font-bold text-lg">{s.nama_showroom}</h3>
                <p className="text-gray-400 text-sm">ID: {s.id}</p>
                <p className="text-gray-400 text-sm">URL: {s.subdomain}.otopadang.com</p>
                <p className="text-gray-400 text-sm">WA: {s.wa_number}</p>
                <p className="text-gray-400 text-sm">Alamat: {s.alamat || "-"}</p>
                
                <div className="flex gap-2 mt-2">
                  <span className="text-xs px-2 py-1 rounded bg-yellow-600">
                    {s.status}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${s.paket === 'Premium' ? 'bg-purple-600' : 'bg-gray-600'}`}>
                    {s.paket}
                  </span>
                </div>
              </div>
              {s.logo && <img src={s.logo} className="w-16 h-16 rounded object-cover border-zinc-700"/>}
            </div>

            <div className="flex gap-2 mt-4">
              <button 
                onClick={() => approve(s.id)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg"
              >
                Approve
              </button>
              
              <button 
                onClick={() => hapus(s.id, s.nama_showroom)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
