import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AutoLogout from "../../component/autologout";

export default function MobilLayout({ children }) {
  const cookieStore = cookies()
  const adminToken = cookieStore.get('admin_token')
  const showroomToken = cookieStore.get('showroom_token')

  // KALAU DUA2NYA GAK ADA, TENDANG KE LOGIN SHOWROOM
  if (!adminToken && !showroomToken) {
    redirect('/login-showroom') // ganti sesuai path login lu
  }

  return (
    <div className="min-h-screen bg-white">
      <AutoLogout />
      {children}
    </div>
  );
}
