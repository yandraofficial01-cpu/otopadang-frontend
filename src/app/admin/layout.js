import AutoLogout from "@/component/autologout";

export const metadata = {
  title: "Admin Panel - Otopadang",
};

export default function AdminLayout({ children }) {
  return (
    <div className="bg-[#0B0B0F] min-h-screen">
      <AutoLogout />
      {children}
    </div>
  )
}
