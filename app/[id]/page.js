import { turso } from "@/lib/turso";
import { decodeId } from "@/lib/encoder";
import { redirect } from "next/navigation";

// Perintah agar Vercel tidak mengecek database saat proses build (penting!)
export const dynamic = 'force-dynamic';

export default async function RedirectPage({ params }) {
  const { id } = params;

  try {
    // 1. Dekode ID dari URL (Misal: 'abc' jadi 1)
    const originalId = decodeId(id);

    // 2. Ambil data URL target dari Turso
    const res = await turso.execute({
      sql: "SELECT target_url, mode FROM urls WHERE id = ?",
      args: [originalId],
    });

    const data = res.rows[0];

    // 3. Jika ID tidak ditemukan di database, lempar ke halaman 404 atau Home
    if (!data) {
      redirect("/");
    }

    // 4. Update jumlah klik (Hit Count) secara background
    // Kita tidak pakai 'await' di sini supaya user langsung pindah tanpa nunggu update selesai
    turso.execute({
      sql: "UPDATE urls SET hit_count = hit_count + 1 WHERE id = ?",
      args: [originalId],
    });

    // 5. Eksekusi Redirect berdasarkan mode (v1 atau v2)
    // Untuk saat ini kita buat redirect langsung dulu
    if (data.target_url) {
      redirect(data.target_url);
    }

  } catch (error) {
    console.error("Redirect Error:", error);
    redirect("/");
  }

  // Fallback jika terjadi sesuatu yang tidak diinginkan
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Redirecting...</p>
    </div>
  );
}
