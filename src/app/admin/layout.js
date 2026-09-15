"use client"; // WAJIB biar bisa pake useEffect + fetch

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const metadata = {
  title: "Admin Panel - Otopadang",
  description: "Dashboard Admin Otopadang",
};

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cek login ke BE pas pertama kali masuk /admin
    fetch('/api/auth/me', { credentials: 'include' })
     .then(res => {
        if (!res.ok) {
          // Kalau 401, lempar ke login
          router.push('/login-admin');
        } else {
          setLoading(false);
        }
      })
     .catch(() => router.push('/login-admin'));
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    router.push('/login-admin');
    router.refresh(); // paksa refresh biar cookie kehapus
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="bg-[#0B0B0F] min-h-screen text-[#E5E5E5]">
      {/* NAVBAR ADMIN + TOMBOL LOGOUT */}
      <nav className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h1 className="text-xl font-bold">Otopadang Admin</h1>
        <button 
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm"
        >
          Logout
        </button>
      </nav>
      
      <div>{children}</div>
    </div>
  );
}
