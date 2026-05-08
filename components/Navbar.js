"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar({ siteName }) {
  const pathname = usePathname();

  // Fungsi untuk cek menu mana yang lagi aktif
  const isActive = (path) => pathname === path ? "active" : "";

  return (
    <nav className="navbar navbar-default" style={{ 
      position: 'sticky', // Ini yang bikin navbar mengapung/mengikuti scroll
      top: 0,             // Nempel tepat di atas layar
      zIndex: 1030,       // Biar posisinya selalu di paling depan (gak ketimpa konten lain)
      borderBottom: '2px solid #e7e7e7', 
      marginBottom: '30px', 
      backgroundColor: '#ffffff' 
    }}>
      <div className="container">
        <div className="navbar-header">
          {/* Tombol Menu buat tampilan HP */}
          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#main-nav">
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <Link href="/" className="navbar-brand" style={{ fontWeight: 'bold', color: '#337ab7' }}>
            <span className="glyphicon glyphicon-link" style={{ marginRight: '8px' }}></span>
            {siteName || "ShortenURL"}
          </Link>
        </div>

        <div className="collapse navbar-collapse" id="main-nav">
          <ul className="nav navbar-nav navbar-right">
            <li className={isActive("/dasbord")}>
              <Link href="/dasbord">
                <span className="glyphicon glyphicon-dashboard" style={{ marginRight: '5px' }}></span>
                Dashboard
              </Link>
            </li>
            <li className={isActive("/list")}>
              <Link href="/list">
                <span className="glyphicon glyphicon-list-alt" style={{ marginRight: '5px' }}></span>
                List URL
              </Link>
            </li>
            <li className={isActive("/seting")}>
              <Link href="/seting">
                <span className="glyphicon glyphicon-cog" style={{ marginRight: '5px' }}></span>
                Settings
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
