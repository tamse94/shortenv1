import { turso } from "@/lib/turso";
import { headers } from "next/headers";

export const dynamic = 'force-dynamic';

export async function GET() {
  const headerList = headers();
  const host = headerList.get('host') || 'domain.com';
  const plainDomain = host.replace(/^https?:\/\//, '').replace(/^www\./, '');
  const baseUrl = `https://${plainDomain}`;

  try {
    // Tarik maksimal 10.000 link V2 terbaru dari database agar server tidak berat
    const res = await turso.execute("SELECT id, created_at FROM urls WHERE mode = 'v2' ORDER BY created_at DESC LIMIT 10000");
    const urls = res.rows;

    // Generate XML secara manual
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls.map((url) => {
        // Antisipasi jika created_at kosong
        const date = url.created_at ? new Date(url.created_at) : new Date();
        return `
          <url>
            <loc>${baseUrl}/${url.id}</loc>
            <lastmod>${date.toISOString()}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.7</priority>
          </url>
        `;
      }).join('')}
    </urlset>`;

    return new Response(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
        // Cache sitemap selama 1 jam biar database lo gak jebol kalau di-crawl Googlebot
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    return new Response('Error generating sitemap', { status: 500 });
  }
}
