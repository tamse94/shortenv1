import "./globals.css";
import { getSetting } from "@/lib/turso";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script"; // Wajib buat SEO (Optimasi Script)

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const siteName = await getSetting("site_name") || "ShortenURL";
  const description = await getSetting("site_description") || "Layanan pemendek URL cepat dan aman.";
  const ogImage = await getSetting("og_image") || "";

  return {
    metadataBase: new URL('https://shortenv1.vercel.app'), // Ganti sama domain asli lo nanti
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: description,
    alternates: {
      canonical: '/', // Mencegah Google nganggap ada duplicate content
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: (await getSetting("meta_icon")) || "/favicon.ico",
    },
    openGraph: {
      title: siteName,
      description: description,
      url: '/',
      siteName: siteName,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: siteName }] : [],
      locale: 'en_EN',
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
    <html lang="id">
      <head>
        {/* Next.js otomatis handle meta charset & viewport. Jangan ditulis manual. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@100..900&display=swap" rel="stylesheet" />
        <meta name="monetag" content="040fc680c5a16e17f2d1616e679831de" />
        {/* CSS ditaruh di head aman karena gak nge-block render sebanyak JS */}
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
<script 
          src="https://quge5.com/88/tag.min.js" 
          data-zone="237527" 
          async 
          data-cfasync="false"
        ></script>
      </head>
      <body style={{ backgroundColor: '#f5f5f5', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        <Navbar siteName={siteName} />
        
        <div className="container" style={{ flex: '1', marginTop: '100px' }}>
          <main>
            {children}
          </main>
        </div>

        <Footer siteName={siteName} />

        {/* SEO HACK: Pakai next/script dengan strategy="lazyOnload".
          Ini bikin jQuery & Bootstrap dimuat BELAKANGAN setelah konten utama muncul.
          Web lo bakal kebuka instan tanpa nunggu script berat ini kelar di-download. 
        */}
        <Script 
          src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js" 
          strategy="lazyOnload" 
        />
        <Script 
          src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" 
          strategy="lazyOnload" 
        />
      </body>
    </html>
  );
}
