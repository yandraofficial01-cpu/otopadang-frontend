import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
// import AutoLogout from "../../../component/autologout"; // KOMEN DULU

export default function MobilLayout({ children }) {
  const cookieStore = cookies()
  const adminToken = cookieStore.get('admin_token')
  const showroomToken = cookieStore.get('showroom_token')

  if (!adminToken && !showroomToken) {
    redirect('/login-showroom') 
  }
  
  if (adminToken && !showroomToken) {
    redirect('/admin/rumah') 
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#E5E5E5]">
      {/* <AutoLogout /> */}  {/* KOMEN DULU */}
      {children}
    </div>
  );
}
