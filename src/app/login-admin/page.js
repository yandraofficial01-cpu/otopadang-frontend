'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, LogIn, AlertCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginAdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!API_URL) {
      setError("Error: NEXT_PUBLIC_API_URL belum di set di Vercel");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/admin/auth/login`, { // <-- INI UDAH DITAMBAH /admin
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if(!res.ok) throw new Error(data.detail || 'Login gagal');

      if(!data.user || data.user.role.toLowerCase() !== 'admin'){
        throw new Error(`Akun ini bukan admin. Role: ${data.user?.role}`);
      }
        
      router.push('/admin');

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0B0B0F]">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-[#1a1a20] p-8 rounded-2xl border-gray-800">
        <h1 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
          <LogIn/> Login Admin Otopadang
        </h1>
        <p className="text-xs text-gray-500 mb-2 text-center">API: {API_URL}</p>
        {error && <p className="text-red-500 bg-red-900/30 p-3 rounded-lg text-sm mb-4 flex items-center gap-2"><AlertCircle size={16}/> {error}</p>}
        <input type="email" placeholder="Email Admin" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 mb-4 bg-gray-900 border-gray-700 rounded-lg text-white focus:border-yellow-500 outline-none" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 mb-4 bg-gray-900 border-gray-700 rounded-lg text-white focus:border-yellow-500 outline-none" required />
        <button type="submit" disabled={loading} className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-black font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition">
          {loading ? <Loader2 className="animate-spin"/> : 'Masuk Dashboard'}
        </button>
      </form>
    </div>
  )
}
