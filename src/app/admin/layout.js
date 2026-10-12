export const metadata = {
  title: "Admin Panel - Otopadang",
  description: "Dashboard Admin Otopadang",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white">
      {children}
    </div>
  );
}
