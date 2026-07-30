import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // kita panggil navbar baru

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Otopadang.com",
  description: "Jual Beli Mobil & Rumah Padang",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50">
        <Navbar /> {/* Pake navbar yg bisa login/logout */}

        <main className="flex-grow">{children}</main>

        <footer className="bg-white border-t mt-10 py-4 text-center text-gray-500 text-sm">
          © 2026 Otopadang.com - Padang
        </footer>
      </body>
    </html>
  );
}
