import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AutoLogout from "../../../component/autologout"; // FIX: naik 3x folder

export default function MobilLayout({ children }) {
  const cookieStore = cookies()
  const adminToken = cookieStore.get('admin_token')
  const showroomToken = cookieStore.get('showroom_token')

  // 1. KALAU GAK LOGIN SAMA SEKALI
  if (!adminToken && !showroomToken) {
    redirect('/login-showroom') 
  }

  // 2. KALAU YANG LOGIN ADMIN, JANGAN KASIH MASUK DASHBOARD SHOWROOM
  if (adminToken && !showroomToken) {
    redirect('/admin/rumah') 
  }

  // 3. KALAU YANG LOGIN SHOWROOM, BOLEH MASUK
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#E5E5E5]"> {/* UDAH PAKE TEMA GOLD LU */}
      <AutoLogout />
      {children}
    </div>
  );
}
