import { turso } from "@/lib/turso";
import { decodeUrl } from "@/lib/encoder";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const res = await turso.execute({
    sql: "SELECT title, description, image_url FROM urls WHERE id = ?",
    args: [params.id]
  });
  const data = res.rows[0];
  if (!data) return { title: "404 Not Found" };
  return {
    title: data.title || "Redirecting...",
    description: data.description || "Silahkan tunggu sebentar.",
    openGraph: {
      title: data.title,
      description: data.description,
      images: [data.image_url],
    },
  };
}

export default async function RedirectPage({ params }) {
  const res = await turso.execute({
    sql: "SELECT target_url FROM urls WHERE id = ?",
    args: [params.id]
  });
  const data = res.rows[0];
  if (!data) redirect("/");

  await turso.execute({
    sql: "UPDATE urls SET hit_count = hit_count + 1 WHERE id = ?",
    args: [params.id]
  });

  const target = decodeUrl(data.target_url);
  return (
    <div className="text-center" style={{ marginTop: '100px' }}>
      <h3>Menuju Link Tujuan...</h3>
      <script dangerouslySetInnerHTML={{
        __html: `setTimeout(() => { window.location.href = "${target}"; }, 1500);`
      }} />
    </div>
  );
}
