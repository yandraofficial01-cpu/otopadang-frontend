import { cookies } from 'next/headers' // WAJIB
import { redirect } from 'next/navigation' // WAJIB
import dynamic from 'next/dynamic' // WAJIB BUAT AUTO LOGOUT

const AutoLogout = dynamic(() => import('../component/autologout'), { ssr: false })

export const metadata = {
  title: "Admin Panel - Otopadang",
  description: "Dashboard Admin Otopadang",
};

export default function AdminLayout({ children }) {
  const cookieStore = cookies()
  const adminToken = cookieStore.get('admin_token')

  // KALAU GAK ADA TOKEN ADMIN, TENDANG KE LOGIN ADMIN
  if (!adminToken) {
    redirect('/login-admin')
  }

  return (
    <div className="bg-[#0B0B0F] min-h-screen text-[#E5E5E5]">
      <AutoLogout />
      {children}
    </div>
  );
}
