"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar({ siteName }) {
  const pathname = usePathname();

  // Fungsi untuk cek menu mana yang lagi aktif
  const isActive = (path) => pathname === path ? "active" : "";

  return (
    // Pake navbar-fixed-top biar beneran ngunci di atas
    <nav className="navbar navbar-default navbar-fixed-top" style={{ 
      borderBottom: '1px solid #e7e7e7', 
      backgroundColor: '#ffffff',
      padding: '10px 0', // INI YANG BIKIN NAVBAR LEBIH BESAR
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)' // Tambah shadow tipis
    }}>
      <div className="container">
        <div className="navbar-header">
          {/* Tombol Menu buat tampilan HP */}
          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#main-nav" style={{ marginTop: '12px' }}>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          
          <Link href="/" className="navbar-brand" style={{ fontWeight: 'bold', color: '#337ab7', fontSize: '22px', paddingTop: '18px' }}>
            <span className="glyphicon glyphicon-link" style={{ marginRight: '8px' }}></span>
            {siteName || "ShortenURL"}
          </Link>
        </div>

        <div className="collapse navbar-collapse" id="main-nav">
          <ul className="nav navbar-nav navbar-right">
            <li className={isActive("/dasbord")}>
              <Link href="/dasbord" style={{ paddingTop: '18px', paddingBottom: '18px', fontSize: '15px', fontWeight: '500' }}>
                <span className="glyphicon glyphicon-dashboard" style={{ marginRight: '5px' }}></span> Dashboard
              </Link>
            </li>
            <li className={isActive("/list")}>
              <Link href="/list" style={{ paddingTop: '18px', paddingBottom: '18px', fontSize: '15px', fontWeight: '500' }}>
                <span className="glyphicon glyphicon-list-alt" style={{ marginRight: '5px' }}></span> List URL
              </Link>
            </li>
            <li className={isActive("/seting")}>
              <Link href="/seting" style={{ paddingTop: '18px', paddingBottom: '18px', fontSize: '15px', fontWeight: '500' }}>
                <span className="glyphicon glyphicon-cog" style={{ marginRight: '5px' }}></span> Settings
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
