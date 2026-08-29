import AutoLogout from "../../component/autologout";

export default function MobilLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <AutoLogout />
      {children}
    </div>
  );
}
