import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
        
        {/* === INI NAVBAR BARU KITA === */}
        <header className="bg-white shadow-md sticky top-0 z-10">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="text-2xl font-bold text-blue-600">Otopadang</a>
            
            <nav className="hidden md:flex items-center gap-6">
              <a href="/mobil" className="text-gray-700 hover:text-blue-600 font-medium">Mobil</a>
              <a href="/rumah" className="text-gray-700 hover:text-blue-600 font-medium">Rumah</a>
              <a href="/blog" className="text-gray-700 hover:text-blue-600 font-medium">Blog</a>
            </nav>

            <div className="flex items-center gap-3">
              <a href="/login" className="text-gray-700 hover:text-blue-600 font-medium">Login</a>
              <a href="/mobil/tambah" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">+ Jual</a>
            </div>
          </div>
        </header>

        {/* === INI ISI HALAMAN === */}
        <main className="flex-grow">{children}</main>

        {/* === FOOTER SIMPLE === */}
        <footer className="bg-white border-t mt-10 py-4 text-center text-gray-500 text-sm">
          © 2026 Otopadang.com - Padang
        </footer>

      </body>
    </html>
  );
}