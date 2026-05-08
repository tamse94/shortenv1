export default function NotFound() {
  return (
    <div className="container text-center" style={{ marginTop: '100px' }}>
      <h1 style={{ fontSize: '72px' }}>404</h1>
      <h3>Waduh! Halaman Tidak Ditemukan</h3>
      <p>URL yang Anda cari tidak terdaftar di sistem kami.</p>
      <a href="/" className="btn btn-primary">Kembali ke Beranda</a>
    </div>
  );
}
