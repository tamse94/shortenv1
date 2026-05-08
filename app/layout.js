import "./globals.css";
import { getSetting } from "@/lib/turso";

export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }) {
  let siteName = "ShortenURL";
  let favicon = "/favicon.ico";

  try {
    const dbSiteName = await getSetting("site_name");
    const dbFavicon = await getSetting("meta_icon");
    if (dbSiteName) siteName = dbSiteName;
    if (dbFavicon) favicon = dbFavicon;
  } catch (e) {}

  return (
    <html lang="id">
      <head>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
        <link rel="icon" href={favicon} />
        <title>{siteName}</title>
      </head>
      <body className="trim-box">
        <nav className="navbar navbar-default" style={{ marginTop: '10px' }}>
          <div className="container-fluid">
            <div className="navbar-header">
              <a className="navbar-brand" href="/">{siteName}</a>
            </div>
            <ul className="nav navbar-nav navbar-right">
              <li><a href="/dasbord">Dashboard</a></li>
              <li><a href="/seting">Settings</a></li>
            </ul>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
