import "./globals.css";
import { getSetting } from "@/lib/turso";
import Navbar from "@/components/Navbar";

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
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Bootstrap 3 CSS */}
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
        <link rel="icon" href={favicon} />
        <title>{siteName}</title>
      </head>
      <body style={{ backgroundColor: '#f5f5f5' }}>
        {/* Memanggil komponen Navbar dengan data Site Name dari Database */}
        <Navbar siteName={siteName} />
        
        <div className="container">
          <main>
            {children}
          </main>
        </div>

        {/* Script JQuery & Bootstrap JS biar menu HP bisa diklik */}
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
      </body>
    </html>
  );
}
