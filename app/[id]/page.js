import { turso } from "@/lib/turso";
import { decodeUrl } from "@/lib/encoder";
import { notFound, redirect } from "next/navigation";

// Fungsi untuk Meta Tag Dinamis (Sangat Penting untuk Share Link)
export async function generateMetadata({ params }) {
  const res = await turso.execute({
    sql: "SELECT * FROM urls WHERE id = ?",
    args: [params.id]
  });

  const data = res.rows[0];
  if (!data) return { title: "Not Found" };

  return {
    title: data.title || "Redirecting...",
    description: data.description || "Silahkan tunggu, Anda akan dialihkan.",
    openGraph: {
      title: data.title,
      description: data.description,
      images: [data.image_url],
    },
  };
}

export default async function RedirectPage({ params }) {
  const res = await turso.execute({
    sql: "SELECT * FROM urls WHERE id = ?",
    args: [params.id]
  });

  const data = res.rows[0];
  if (!data) notFound();

  // Update Hit Count
  await turso.execute({
    sql: "UPDATE urls SET hit_count = hit_count + 1 WHERE id = ?",
    args: [params.id]
  });

  const target = decodeUrl(data.target_url);

  return (
    <div className="text-center" style={{ marginTop: '100px' }}>
      <h3>Redirecting to: {data.title || "Link"}</h3>
      <p>Mohon tunggu sebentar...</p>
      <script dangerouslySetInnerHTML={{
        __html: `setTimeout(() => { window.location.href = "${target}"; }, 2000);`
      }} />
    </div>
  );
}
