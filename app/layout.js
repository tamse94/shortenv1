import "./globals.css"; // Opsional jika butuh tambahan CSS
import { getSetting } from "@/lib/settings";

export default async function RootLayout({ children }) {
  // Ambil data dari database untuk Meta Global
  const siteName = await getSetting("site_name");
  const favicon = await getSetting("meta_icon");

  return (
    <html lang="id">
      <head>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
        <link rel="icon" href={favicon || "/favicon.ico"} />
      </head>
      <body style={{ backgroundColor: '#f5f5f5', padding: '20px' }}>
        <nav className="navbar navbar-default">
          <div className="container">
            <div className="navbar-header">
              <a className="navbar-brand" href="/">{siteName || "ShortenURL"}</a>
            </div>
            <ul className="nav navbar-nav navbar-right">
              <li><a href="/dasbord">Dashboard</a></li>
              <li><a href="/seting">Settings</a></li>
            </ul>
          </div>
        </nav>
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}
