import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // 1. Pakai @ biar aman + huruf besar

const geistSans = Geist({ 
  variable: "--font-geist-sans", 
  subsets: ["latin"] 
});

const geistMono = Geist_Mono({ 
  variable: "--font-geist-mono", 
  subsets: ["latin"] 
});

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  weight: "700", 
  variable: "--font-playfair" 
});

export const metadata = {
  title: "Otopadang.com - The Finest Cars & Homes",
  description: "Jual Beli Mobil & Rumah Mewah di Padang",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0B0B0F] text-gray-200"> {/* 2. Tambah 'flex' */}
        <Navbar />
        <main className="flex-grow">{children}</main> {/* Ini biar footer ke bawah */}
        <footer className="bg-black border-t border-gray-900 py-8 text-center text-gray-500 text-sm">
          © 2026 Otopadang.com - Elegance in Every Deal
        </footer>
      </body>
    </html>
  );
}
