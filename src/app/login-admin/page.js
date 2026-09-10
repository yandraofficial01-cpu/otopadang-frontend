'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, LogIn, AlertCircle, ServerCrash } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginAdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // UDAH DIHAPUS 1 =
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if(!API_URL) {
      setError("ERROR: NEXT_PUBLIC_API_URL belum diset di Vercel. Masuk ke Settings > Environment Variables")
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`${API_URL}/auth/login`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if(!res.ok) throw new Error(data.detail || 'Login gagal');

      if(data.user?.role?.toLowerCase() !== 'admin'){
        throw new Error(`Akun ini bukan admin. Role: ${data.user?.role}`);
      }
        
      router.push('/admin'); 

    } catch (error) {
      setError(error.message);
      console.error("Login Error:", error)
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0B0B0F]">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-[#1a1a20] p-8 rounded-2xl border-gray-800">
        <h1 className="text-3xl font-bold text-white mb-2 text-center flex items-center justify-center gap-2">
          <LogIn/> Login Admin Otopadang
        </h1>
        
        <p className="text-xs text-gray-500 text-center mb-4">
          API: {API_URL || <span className="text-red-500">KOSONG</span>}
        </p>

        {error && (
          <div className="text-red-400 bg-red-900/30 p-3 rounded-lg text-sm mb-4 flex items-start gap-2">
            {error.includes("API_URL") ? <ServerCrash size={16} className="mt-0.5"/> : <AlertCircle size={16} className="mt-0.5"/>}
            <span>{error}</span>
          </div>
        )}

        <input 
          type="email" 
          placeholder="Email Admin" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full p-3 mb-4 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-yellow-500 outline-none" 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full p-3 mb-4 bg-gray-900 border-gray-700 rounded-lg text-white focus:border-yellow-500 outline-none" 
          required 
        />
        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-black font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition"
        >
          {loading ? <Loader2 className="animate-spin"/> : 'Masuk Dashboard'}
        </button>
      </form>
    </div>
  )
}
