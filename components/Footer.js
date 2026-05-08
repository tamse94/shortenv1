"use client";
import Link from "next/link";

export default function Footer({ siteName }) {
  const year = new Date().getFullYear();

  return (
    <footer style={{ 
      marginTop: '50px', 
      padding: '30px 0', 
      borderTop: '1px solid #e7e7e7', 
      backgroundColor: '#ffffff', // Bikin background putih biar nyatu sama Navbar
      color: '#777' 
    }}>
      <div className="container text-center">
        
        {/* AREA LINK HALAMAN LEGAL */}
        <ul className="list-inline" style={{ marginBottom: '15px', fontSize: '14px', fontWeight: '500' }}>
          <li>
            <Link href="/privacy" style={{ color: '#555', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#337ab7'} onMouseOut={(e) => e.target.style.color = '#555'}>
              Privacy Policy
            </Link>
          </li>
          <li><span style={{ color: '#ccc', margin: '0 5px' }}>|</span></li>
          <li>
            <Link href="/terms" style={{ color: '#555', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#337ab7'} onMouseOut={(e) => e.target.style.color = '#555'}>
              Terms of Use
            </Link>
          </li>
          <li><span style={{ color: '#ccc', margin: '0 5px' }}>|</span></li>
          <li>
            <Link href="/dmca" style={{ color: '#555', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#337ab7'} onMouseOut={(e) => e.target.style.color = '#555'}>
              DMCA
            </Link>
          </li>
        </ul>

        {/* AREA COPYRIGHT */}
        <p style={{ margin: 0, fontSize: '14px' }}>
          &copy; {year} <strong>{siteName || "ShortenURL"}</strong>. All Rights Reserved.
        </p>
        
      </div>
    </footer>
  );
}
