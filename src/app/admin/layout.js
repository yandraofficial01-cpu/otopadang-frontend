export const metadata = {
  title: "Admin Panel - Otopadang",
  description: "Dashboard Admin Otopadang",
};

import AdminClientLayout from "./AdminClientLayout";

export default function AdminLayout({ children }) {
  return (
    <AdminClientLayout>
      {children}
    </AdminClientLayout>
  );
}
