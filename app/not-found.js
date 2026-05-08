export default function NotFound() {
  return (
    <div className="row">
      {/* TRIK AJAIB: Sembunyikan Navbar & Footer bawaan layout khusus di halaman ini */}
      <style dangerouslySetInnerHTML={{ __html: `
        nav.navbar, footer { display: none !important; }
        body { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
      `}} />

      <div className="col-md-12 text-center" style={{ padding: '20px' }}>
        
        {/* SVG ILLUSTRATION: Broken Link / 404 */}
        <div style={{ marginBottom: '25px' }}>
          <svg 
            width="160" 
            height="160" 
            viewBox="0 0 24 24" 
            fill="none" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.05))' }}
          >
            {/* Lingkaran Background Tipis */}
            <circle cx="12" cy="12" r="10" stroke="#e7e7e7" strokeWidth="1"></circle>
            
            {/* Rantai Kanan (Merah) */}
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="#d9534f" strokeWidth="2"></path>
            
            {/* Rantai Kiri (Biru) */}
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="#337ab7" strokeWidth="2"></path>
            
            {/* Garis Putus-putus di tengah */}
            <line x1="8" y1="12" x2="16" y2="12" stroke="#777" strokeDasharray="3 3"></line>
          </svg>
        </div>

        {/* TYPOGRAPHY 404 */}
        <h1 style={{ fontSize: '72px', fontWeight: 'bold', color: '#2c3e50', margin: '0 0 10px 0', letterSpacing: '2px' }}>
          404
        </h1>
        
        <h3 style={{ color: '#337ab7', marginTop: '0', marginBottom: '20px', fontWeight: '600' }}>
          Oops! Page Not Found
        </h3>
        
        <p className="text-muted" style={{ fontSize: '16px', maxWidth: '450px', margin: '0 auto 35px auto', lineHeight: '1.7' }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* TOMBOL KEMBALI PAKAI TAG <a> BIASA BIAR REFRESH TOTAL */}
        <a href="/" className="btn btn-primary btn-lg" style={{ padding: '12px 30px', borderRadius: '40px', fontWeight: '600', letterSpacing: '0.5px' }}>
          <span className="glyphicon glyphicon-home" style={{ marginRight: '8px' }}></span> 
          Back to Homepage
        </a>
        
      </div>
    </div>
  );
}
