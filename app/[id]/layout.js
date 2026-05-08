import { turso } from "@/lib/turso";
import "./redirect.css";

// Meta Tag Komplit ditaruh di Layout
export async function generateMetadata({ params }) {
  const res = await turso.execute({
    sql: "SELECT title, description, image_url FROM urls WHERE id = ?",
    args: [params.id]
  });
  
  const data = res.rows[0];
  
  if (!data) return { title: "404 Not Found" };

  const title = data.title || "Menuju Tautan...";
  const description = data.description || "Silakan tunggu, Anda sedang dialihkan.";
  const image = data.image_url || "";

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      // Tambahan resolusi gambar biar full di sosmed
      images: image ? [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        }
      ] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: image ? [image] : [],
    }
  };
}

export default async function RedirectLayout({ children }) {
  // Tarik data ads_head dari database
  const setRes = await turso.execute("SELECT value FROM settings WHERE key = 'ads_head'");
  const adsHead = setRes.rows[0]?.value || "";

  return (
    <>
      {/* Script Monetag murni masuk ke head */}
      {adsHead && <head dangerouslySetInnerHTML={{ __html: adsHead }} />}

      {/* Kelas ini bakal diatur di redirect.css */}
      <section className="redirect-wrapper">
        {children}
      </section>
    </>
  );
}
