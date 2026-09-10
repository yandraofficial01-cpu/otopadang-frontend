'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Building } from 'lucide-react';

// URL BE LU LANGSUNG. JANGAN PAKE /api LAGI
const API_URL = 'https://otopadang-api.vercel.app';

export default function LoginShowroomPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // INI SATU2NYA YANG DIGANTI: /api/login -> BE langsung
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // WAJIB INI BIAR COOKIE MASUK
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if(!res.ok) throw new Error(data.detail || 'Login gagal');

      if(data.user.role.toLowerCase() !== 'showroom'){
        throw new Error(`Akun ini bukan showroom. Role: ${data.user.role}`);
      }
      
      localStorage.setItem('role', data.user.role) // simpen role buat cek di dashboard
      router.push('/dashboard/mobil'); // lempar ke dashboard showroom

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0B0B0F]">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-[#1a1a20] p-8 rounded-2xl border-gray-800">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-serif text-yellow-400 flex items-center justify-center gap-2">
            <Building/> Login Showroom
          </h1>
          <p className="text-xs text-green-400 mt-2">Mode: API Langsung</p>
        </div>

        {error && <p className="text-red-500 bg-red-900/30 p-3 rounded-lg text-sm mb-4 text-center">{error}</p>}
        
        <input 
          type="email" 
          placeholder="Email Showroom" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full p-3 mb-4 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-yellow-400 outline-none" 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full p-3 mb-6 bg-gray-900 border-gray-700 rounded-lg text-white focus:border-yellow-400 outline-none" 
          required 
        />
        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-yellow-400 text-black font-bold py-3 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-yellow-500 transition"
        >
          {loading ? <Loader2 className="animate-spin"/> : 'Masuk & Input Mobil'}
        </button>
      </form>
    </div>
  )
}
