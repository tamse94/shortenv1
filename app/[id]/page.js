import { turso } from "@/lib/turso";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function RedirectPage({ params }) {
  const res = await turso.execute({
    sql: "SELECT target_url, mode, title, image_url FROM urls WHERE id = ?",
    args: [params.id]
  });
  
  const data = res.rows[0];
  
  // Jika link mati/ID ngawur, kembalikan ke beranda
  if (!data) redirect("/");

  // Nambah hitungan klik di database
  turso.execute({
    sql: "UPDATE urls SET hit_count = hit_count + 1 WHERE id = ?",
    args: [params.id]
  });

  // V1: Langsung redirect tanpa ampun
  if (data.mode === "v1") {
    redirect(data.target_url);
  }

  // V2: Tampilkan kotak khusus (Gambar + Judul)
  return (
    <div className="redirect-container">
      <div className="redirect-card">
        
        {data.image_url && (
          <img src={data.image_url} alt={data.title} className="redirect-image" />
        )}
        
        <h1 className="redirect-title">{data.title}</h1>
        
        <div className="spinner"></div>
        <p className="text-muted" style={{ fontSize: '14px', marginTop: '10px' }}>
          Mengarahkan Anda ke tujuan...
        </p>

        {/* Script redirect otomatis 3 detik untuk V2 */}
        <script dangerouslySetInnerHTML={{
          __html: `setTimeout(() => { window.location.replace("${data.target_url}"); }, 3000);`
        }} />
      </div>
    </div>
  );
}
