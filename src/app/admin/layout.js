import AutoLogout from "../component/autologout";

export const metadata = {
  title: "Admin Panel - Otopadang",
  description: "Dashboard Admin Otopadang",
};

export default function AdminLayout({ children }) {
  return (
    <div>
      <AutoLogout />
      {children}
    </div>
  );
}
