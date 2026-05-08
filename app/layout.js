import "./globals.css";
import { getSetting } from "@/lib/turso";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const dynamic = 'force-dynamic';

// Fungsi generateMetadata buat SEO Global yang Sangat Komplit
export async function generateMetadata() {
  const siteName = await getSetting("site_name") || "ShortenURL";
  const description = await getSetting("site_description") || "Layanan pemendek URL cepat dan aman.";
  const ogImage = await getSetting("og_image") || "";

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: description,
    icons: {
      icon: (await getSetting("meta_icon")) || "/favicon.ico",
    },
    openGraph: {
      title: siteName,
      description: description,
      images: ogImage ? [ogImage] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description: description,
      images: ogImage ? [ogImage] : [],
    }
  };
}

export default async function RootLayout({ children }) {
  const siteName = await getSetting("site_name") || "ShortenURL";

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
      </head>
      <body style={{ backgroundColor: '#f5f5f5', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        <Navbar siteName={siteName} />
        
        <div className="container" style={{ flex: '1' }}>
          <main>
            {children}
          </main>
        </div>

        <Footer siteName={siteName} />

        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
      </body>
    </html>
  );
}
