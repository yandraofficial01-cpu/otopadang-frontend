import Autologoutwrapper from '../../component/autologoutwrapper'

export const metadata = {
  title: "Admin Panel - Otopadang",
  description: "Dashboard Admin Otopadang",
};

export default function AdminLayout({ children }) {
  // HAPUS SEMUA CEK COOKIE DI SINI
  // Biarkan page.js yang handle redirect via /api/auth/me

  return (
    <div className="bg-[#0B0B0F] min-h-screen text-[#E5E5E5]">
      <Autologoutwrapper />
      {children}
    </div>
  );
}
