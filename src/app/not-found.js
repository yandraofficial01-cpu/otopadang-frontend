export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Poppins'
    }}>
      <h1 style={{fontSize: '48px', fontFamily: 'Playfair Display', color: '#fbbf24'}}>404</h1>
      <p style={{margin: '16px 0'}}>Halaman yang kamu cari tidak ditemukan</p>
      <a href="/" style={{
        backgroundImage: 'linear-gradient(to right, #ca8a04, #fbbf24)',
        color: 'black',
        fontWeight: '700',
        padding: '12px 24px',
        borderRadius: '8px',
        textDecoration: 'none'
      }}>
        Kembali ke Home
      </a>
    </div>
  )
}
