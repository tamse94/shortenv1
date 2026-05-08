import { turso } from "@/lib/turso";
import { decodeUrl } from "@/lib/encoder";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function RedirectPage({ params }) {
  const { id } = params;

  // 1. Ambil data dari Turso
  const res = await turso.execute({
    sql: "SELECT target_url, mode, title, image_url, description FROM urls WHERE id = ?",
    args: [id]
  });
  
  const data = res.rows[0];
  
  // Jika ID tidak ditemukan, balik ke Home
  if (!data) {
    redirect("/");
  }

  // 2. Decode URL tujuan (karena di database disave pake Base64)
  const target = decodeUrl(data.target_url);

  // 3. Tambah hit count di background
  turso.execute({
    sql: "UPDATE urls SET hit_count = hit_count + 1 WHERE id = ?",
    args: [id]
  });

  // JIKA MODE V1: Langsung Redirect tanpa ampun
  if (data.mode === "v1") {
    redirect(target);
  }

  // JIKA MODE V2: Tampilkan Halaman Antara (Safelink)
  return (
    <div className="redirect-container">
      <div className="redirect-card">
        
        {/* Gambar Thumbnail */}
        {data.image_url && (
          <img src={data.image_url} alt={data.title} className="redirect-image" />
        )}
        
        {/* Judul & Deskripsi */}
        <h1 className="redirect-title">{data.title || "Tautan Anda Sudah Siap"}</h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          {data.description || "Klik tombol di bawah untuk melanjutkan ke halaman tujuan."}
        </p>
        
        {/* Tombol Get Link */}
        <div id="loader" className="spinner"></div>
        
        <a 
          href={target} 
          id="btn-getlink" 
          className="btn-getlink" 
          style={{ display: 'none' }}
        >
          Kunjungi Tautan (Get Link)
        </a>

        {/* Script untuk munculin tombol setelah 3 detik (biar keren ada loadingnya) */}
        <script dangerouslySetInnerHTML={{
          __html: `
            setTimeout(() => {
              document.getElementById('loader').style.display = 'none';
              document.getElementById('btn-getlink').style.display = 'inline-block';
            }, 3000);
          `
        }} />

      </div>
    </div>
  );
}
