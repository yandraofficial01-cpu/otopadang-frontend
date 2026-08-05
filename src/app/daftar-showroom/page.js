'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function DaftarShowroomPage() {
  const [form, setForm] = useState({
    namaShowroom: '',
    namaOwner: '',
    noWa: '',
    emailShowroom: '',
    alamat: '',
    jumlahUnit: ''
  })

  const NOMOR_ADMIN = '628979879518' // Nomor WA lu

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const pesan = `Halo Admin OtoPadang, saya mau daftar jadi Mitra Showroom.%0A%0A*Nama Showroom:* ${form.namaShowroom}%0A*Nama Owner:* ${form.namaOwner}%0A*No WA:* ${form.noWa}%0A*Email:* ${form.emailShowroom}%0A*Alamat:* ${form.alamat || '-'}%0A*Jumlah Unit:* ${form.jumlahUnit || '-'}%0A%0AMohon info jadwal survey verifikasi. Terima kasih.`
    
    const url = `https://wa.me/${NOMOR_ADMIN}?text=${pesan}`
    window.open(url, '_blank')
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: '#1a1a1a', background: '#fff' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        :root {
          --brand: #0066cc;
          --text: #1a1a1a;
          --muted: #666;
          --bg: #fff;
          --border: #eee;
          --header-bg: #000;
          --header-yellow: #FFC107;
          --success: #00A650;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .site-header {
          background: var(--header-bg);
          border-bottom: 3px solid var(--header-yellow);
          padding: 10px 16px;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .header-inner {
          max-width: 720px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .logo-img { width: 42px; height: 42px; object-fit: contain; flex-shrink: 0; }
        .logo-title { font-weight: 700; font-size: 20px; color: var(--header-yellow); line-height: 1; white-space: nowrap; }
        .nav { margin-left: auto; }
        .nav a { color: #fff; text-decoration: none; font-weight: 600; font-size: 15px; margin-left: 16px; }
        .nav a:hover { color: var(--header-yellow); }
        .container { max-width: 720px; margin: 0 auto; padding: 40px 16px; }
        h1 { font-size: 2rem; line-height: 1.2; margin-bottom: 16px; font-weight: 700; }
        .subtitle { font-size: 17px; color: var(--muted); margin-bottom: 40px; }
        .kuota { background: #FFF8E1; border-left: 4px solid var(--header-yellow); padding: 12px 16px; margin-bottom: 40px; font-weight: 600; font-size: 15px; }
        .benefits { background: #f8f9fa; border: 1px solid var(--border); border-radius: 12px; padding: 28px; margin: 40px 0; }
        .benefits h2 { font-size: 1.4rem; margin-bottom: 24px; }
        .benefit-item { display: flex; gap: 16px; margin-bottom: 20px; align-items: flex-start; }
        .check { background: var(--success); color: #fff; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-weight: 700; font-size: 14px; margin-top: 2px; }
        .form-box { border: 1px solid var(--border); border-radius: 12px; padding: 28px; margin-top: 40px; }
        .form-box h2 { font-size: 1.4rem; margin-bottom: 24px; }
        .form-group { margin-bottom: 20px; }
        label { display: block; font-weight: 600; margin-bottom: 8px; font-size: 15px; }
        input, textarea {
          width: 100%; padding: 12px 16px; border: 1px solid var(--border); border-radius: 8px;
          font-size: 16px; font-family: inherit; background: #fff;
        }
        input:focus, textarea:focus { outline: none; border-color: var(--brand); box-shadow: 0 0 0 3px rgba(0,102,204,0.1); }
        .btn-wa {
          background: #25D366; color: #fff; border: none; padding: 16px 32px; border-radius: 8px;
          font-weight: 700; font-size: 16px; cursor: pointer; width: 100%; display: flex;
          align-items: center; justify-content: center; gap: 8px;
        }
        .btn-wa:hover { background: #1da851; }
        .note { font-size: 13px; color: var(--muted); margin-top: 16px; text-align: center; }
        .site-footer { border-top: 1px solid var(--border); padding: 32px 16px; margin-top: 60px; background: #fafafa; }
        .footer-inner { max-width: 720px; margin: 0 auto; text-align: center; color: var(--muted); font-size: 14px; }
        @media (max-width: 640px) {
          .nav a { margin-left: 10px; font-size: 13px; }
          .form-box, .benefits { padding: 20px 16px; }
          .logo-title { font-size: 18px; }
          .logo-img { width: 36px; height: 36px; }
          h1 { font-size: 1.75rem; }
        }
      `}</style>

      {/* HEADER */}
      <header className="site-header">
        <div className="header-inner">
          <img src="/logo-oto-padang.png" alt="Logo OtoPadang" className="logo-img" />
          <div className="logo-title">OTO PADANG</div>
          <nav className="nav">
            <Link href="/blog">Blog</Link>
            <Link href="/daftar-showroom">Jadi Mitra</Link>
            <Link href="/">Home</Link>
          </nav>
        </div>
      </header>

      {/* KONTEN */}
      <main className="container">
        <h1>Undangan Mitra Showroom Terverifikasi OtoPadang</h1>
        <p className="subtitle">Gabung 10 showroom jujur pertama di Padang. Dapatkan pembeli serius dari Google + Website katalog gratis.</p>
        
        <div className="kuota">
          ⚡ Kuota angkatan pertama: Tersisa untuk 10 showroom. Pendaftaran ditutup 30 Juni 2026.
        </div>

        <div className="benefits">
          <h2>Keuntungan Menjadi Mitra OtoPadang:</h2>
          
          <div className="benefit-item">
            <div className="check">✓</div>
            <div><strong>Listing Gratis 3 Bulan Pertama</strong><br/>Upload stok mobil tanpa biaya admin, tanpa kontrak mengikat.</div>
          </div>
          <div className="benefit-item">
            <div className="check">✓</div>
            <div><strong>Traffic dari Google</strong><br/>Listing OtoPadang ada di halaman 1 Google untuk keyword "mobil bekas padang".</div>
          </div>
          <div className="benefit-item">
            <div className="check">✓</div>
            <div><strong>Label "Terverifikasi OtoPadang"</strong><br/>Tingkatkan trust calon pembeli hingga 3x lipat.</div>
          </div>
          <div className="benefit-item">
            <div className="check">✓</div>
            <div><strong>Web Katalog Gratis + Subdomain</strong><br/>Dapat website nama.otopadang.com. Upload 40 unit.</div>
          </div>
          <div className="benefit-item">
            <div className="check">✓</div>
            <div><strong>Leads Berkualitas Langsung ke WA</strong><br/>Tombol "Chat Sales" langsung ke nomor WA sales showroom Anda.</div>
          </div>
        </div>

        {/* FORM */}
        <div className="form-box">
          <h2>Daftar Sekarang, Gratis 3 Bulan</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nama Showroom *</label>
              <input type="text" placeholder="Contoh: Padang Auto Mobilindo" required
                value={form.namaShowroom} onChange={e => setForm({...form, namaShowroom: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Nama Anda *</label>
              <input type="text" placeholder="Contoh: Budi Santoso" required
                value={form.namaOwner} onChange={e => setForm({...form, namaOwner: e.target.value})} />
            </div>
            <div className="form-group">
              <label>No. WhatsApp Aktif *</label>
              <input type="tel" placeholder="Contoh: 08123456789" required
                value={form.noWa} onChange={e => setForm({...form, noWa: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Email Showroom *</label>
              <input type="email" placeholder="Contoh: admin@padangauto.com" required
                value={form.emailShowroom} onChange={e => setForm({...form, emailShowroom: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Alamat Showroom</label>
              <input type="text" placeholder="Contoh: Jl. Khatib Sulaiman No. 123, Padang"
                value={form.alamat} onChange={e => setForm({...form, alamat: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Jumlah Unit Tersedia</label>
              <input type="number" placeholder="Contoh: 15"
                value={form.jumlahUnit} onChange={e => setForm({...form, jumlahUnit: e.target.value})} />
            </div>
            <button type="submit" className="btn-wa">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16.75 13.96c.25.13.41.2.46.3.06.11.04.61-.21 1.18-.2.56-1.24 1.1-1.7 1.12-.46.03-.47.36-1.77-.39-.28-.16-1.65-.59-2.9-1.74-.78-.8-1.59-1.97-1.59-2.4 0-.43.45-.66.6-.75.13-.08.28-.2.38-.31.1-.1.12-.17.18-.28.06-.11.03-.2-.01-.28-.04-.08-.39-.93-.53-1.28-.13-.35-.27-.3-.37-.3h-.32c-.11 0-.27.04-.41.2-.14.16-.53.52-.53 1.28 0 .75.55 1.48.62 1.58.07.1 1.07 1.64 2.6 2.3 1.53.66 1.53.44 1.8.41.28-.03.9-.37 1.03-.73.13-.36.13-.66.09-.73-.04-.07-.15-.11-.4-.24z"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.52 0 10-4.48 10-10S17.52 2 12 2zm4.9 14.38c-.23.66-1.15 1.21-1.88 1.37-.51.11-1.17.2-3.4-.72-2.86-1.18-4.69-4.07-4.83-4.26-.14-.19-1.16-1.54-1.16-2.95 0-1.4.72-2.09.98-2.37.26-.28.57-.35.76-.35h.55c.17 0 .4-.06.61.46.23.58.78 2.01.85 2.16.07.15.11.32.02.51-.1.19-.15.31-.29.47-.14.17-.3.37-.43.5-.14.13-.28.27-.12.53.16.26.71 1.18 1.53 1.91 1.05.93 1.93 1.22 2.2 1.36.26.13.41.11.56-.07.15-.18.65-.76.82-1.02.17-.26.35-.21.58-.13.24.08 1.49.7 1.75.83.25.12.42.18.48.28.06.1.06.58-.17 1.24z"/></svg>
              Daftar via WhatsApp
            </button>
            <p className="note">Syarat: Showroom jujur, unit sesuai iklan, bersedia disurvey 1x ±15 menit.</p>
          </form>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-inner">
          <p>© 2026 <Link href="/">OtoPadang.com</Link> - Beli Mobil Bekas Padang Jadi Aman</p>
        </div>
      </footer>
    </div>
  )
}
