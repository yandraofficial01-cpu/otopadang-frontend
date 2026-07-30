import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"], weight: "700" });

export const metadata = {
  title: "Otopadang.com - The Finest Cars & Homes",
  description: "Jual Beli Mobil & Rumah Mewah di Padang",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0B0B0F] text-gray-200">
        
        <header className="bg-[#0B0B0F]/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
          <div className="container mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
            <Link href="/" className={`${playfair.className} text-3xl font-bold gold-text`}>Otopadang</Link>
            
            <nav className="hidden md:flex items-center gap-8 font-semibold">
              <Link href="/" onClick={() => window.scrollTo(0,0)} className="text-gray-300 hover:text-yellow-400 transition">Mobil</Link>
              <Link href="/" onClick={() => window.scrollTo(0,0)} className="text-gray-300 hover:text-yellow-400 transition">Rumah</Link>
              <Link href="/blog" className="text-gray-300 hover:text-yellow-400 transition">Blog</Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-300 hover:text-white font-medium hidden md:block">Login</Link>
              <Link href="/mobil/tambah" className="btn-gold">+ Jual</Link>
            </div>
          </div>
        </header>

        <main className="flex-grow">{children}</main>

        <footer className="bg-black border-t border-gray-900 mt-20 py-8 text-center text-gray-500 text-sm">
          © 2026 Otopadang.com - Elegance in Every Deal
        </footer>

      </body>
    </html>
  );
}
