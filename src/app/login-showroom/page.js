'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Building } from 'lucide-react';

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
      // 1. GANTI KE /api/login. HAPUS API_URL
      const res = await fetch(`/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 2. HAPUS credentials: 'include'
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if(!res.ok) throw new Error(data.detail || 'Login gagal');

      // 3. CEK ROLE DARI RESPONSE
      if(data.user.role.toLowerCase() !== 'showroom'){
        throw new Error(`Akun ini bukan showroom. Role: ${data.user.role}`);
      }
        
      // 4. LANGSUNG PUSH. COOKIE UDAH DISET SAMA PROXY
      router.push('/dashboard/mobil');

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0B0B0F]">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-[#1a1a20] p-8 rounded-2xl border-gray-800">
        <h1 className="text-3xl font-serif gold-text mb-6 text-center flex items-center justify-center gap-2"> // UDAH PAKE FONT LU
          <Building/> Login Showroom
        </h1>
        <p className="text-xs text-gray-500 mb-2 text-center">API Proxy Aktif</p>
        {error && <p className="text-red-500 bg-red-900/30 p-3 rounded-lg text-sm mb-4">{error}</p>}
        <input type="email" placeholder="Email Showroom" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 mb-4 bg-gray-900 border-gray-700 rounded-lg text-white focus:border-gold outline-none" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 mb-4 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-gold outline-none" required />
        <button type="submit" disabled={loading} className="w-full btn-gold disabled:opacity-50 flex items-center justify-center gap-2"> // UDAH PAKE BTN LU
          {loading ? <Loader2 className="animate-spin"/> : 'Masuk & Input Mobil'}
        </button>
      </form>
    </div>
  )
}
