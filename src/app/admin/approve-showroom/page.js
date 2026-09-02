'use client'
import { useEffect, useState } from "react";

export default function ApproveShowroomPage() {
  const [showrooms, setShowrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [tab, setTab] = useState("pending"); // tab: pending | all

  const API = "https://otopadang-api.vercel.app";

  useEffect(() => {
    const t = localStorage.getItem("token");
    if(t) setToken(t);
  }, []);

  const fetchShowrooms = async () => {
    if(!token) return;
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
      alert("Gagal ambil data showroom. Cek token atau login ulang");
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
      alert("Berhasil di approve! User juga otomatis aktif");
      fetchShowrooms();
    } else {
      alert("Gagal approve");
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'approved'? 'pending' : 'approved';
    if(!confirm(`Yakin mau ubah status jadi ${newStatus}?`)) return;
    const res = await fetch(`${API}/admin/showroom/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    });
    if(res.ok){
      alert(`Status diubah jadi ${newStatus}`);
      fetchShowrooms();
    } else {
      alert("Gagal ubah status");
    }
  };

  // FUNGSI UPGRADE/DOWNGRADE PAKET
  const updatePaket = async (id, paketBaru) => {
    const text = paketBaru === 'Premium' ? 'upgrade ke Premium' : 'turunkan ke Gratis';
    if(!confirm(`Yakin mau ${text} showroom ini?`)) return;
    const res = await fetch(`${API}/admin/showroom/${id}/paket`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ paket: paketBaru })
    });
    if(res.ok){
      alert(`Berhasil diubah ke ${paketBaru}!`);
      fetchShowrooms();
    } else {
      alert("Gagal ubah paket. Cek endpoint backend");
    }
  };

  const hapus = async (id, nama) => {
    if(!confirm(`Yakin mau hapus showroom ${nama}? Data user + mobil ikut kehapus`)) return;
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
    if(token) fetchShowrooms();
  }, [token]);

  const list = tab === 'pending'
   ? showrooms.filter(s => s.status === 'pending')
    : showrooms;

  const pendingCount = showrooms.filter(s => s.status === 'pending').length;

  return (
    <div className="p-6 bg-[#0B0B0F] min-h-screen text-white">
      <h1 className="text-2xl font-bold text-yellow-400 mb-4">Kelola Showroom</h1>

      <div className="flex gap-2 mb-6 border-b border-zinc-800">
        <button
          onClick={() => setTab('pending')}
          className={`px-4 py-2 font-semibold ${tab==='pending'? 'border-b-2 border-yellow-400 text-yellow-400' : 'text-gray-400'}`}
        >
          Menunggu Approval {pendingCount > 0 && `(${pendingCount})`}
        </button>
        <button
          onClick={() => setTab('all')}
          className={`px-4 py-2 font-semibold ${tab==='all'? 'border-b-2 border-yellow-400 text-yellow-400' : 'text-gray-400'}`}
        >
          Semua Showroom
        </button>
      </div>

      {!token && <p className="text-red-400">Silakan login admin dulu</p>}
      {loading && token && <p className="text-gray-400">Loading...</p>}
      {!loading && list.length === 0 && token && (
        <p className="text-gray-400">Data kosong</p>
      )}

      <div className="grid gap-4">
        {list.map(s => (
          <div key={s.id} className="bg-zinc-900 border-zinc-800 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-white font-bold text-lg">{s.nama_showroom}</h3>
                <p className="text-gray-400 text-sm">ID: {s.id}</p>
                <p className="text-gray-400 text-sm">URL: {s.subdomain}.otopadang.com</p>
                <p className="text-gray-400 text-sm">WA: {s.wa_number}</p>
                <p className="text-gray-400 text-sm">Alamat: {s.alamat || "-"}</p>

                <div className="flex gap-2 mt-2">
                  <span className={`text-xs px-2 py-1 rounded font-semibold ${s.status === 'approved'? 'bg-green-600' : 'bg-yellow-600'}`}>
                    {s.status}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded font-semibold ${s.paket === 'Premium'? 'bg-purple-600' : 'bg-gray-600'}`}>
                    {s.paket}
                  </span>
                </div>
              </div>
              {s.logo?
                <img src={s.logo} className="w-16 h-16 rounded object-cover border-zinc-700"/> :
                <div className="w-16 h-16 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs text-gray-500">No Img</div>
              }
            </div>

            <div className="flex gap-2 mt-4 flex-wrap">
              {s.status === 'pending' && (
                <button
                  onClick={() => approve(s.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg"
                >
                  Approve
                </button>
              )}

              {s.status === 'approved' && (
                <button
                  onClick={() => toggleStatus(s.id, s.status)}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 rounded-lg"
                >
                  Nonaktifkan
                </button>
              )}

              {s.status === 'pending' && s.status !== 'approved' && (
                <button
                  onClick={() => toggleStatus(s.id, s.status)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg"
                >
                  Aktifkan
                </button>
              )}

              {/* TOMBOL PAKET */}
              {s.paket === 'Gratis' && s.status === 'approved' && (
                <button
                  onClick={() => updatePaket(s.id, 'Premium')}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg"
                >
                  Upgrade Premium
                </button>
              )}
              {s.paket === 'Premium' && (
                <button
                  onClick={() => updatePaket(s.id, 'Gratis')}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 rounded-lg"
                >
                  Turunkan ke Gratis
                </button>
              )}

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
