import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";
import { encodeUrl } from "@/lib/encoder";

// AMBIL DATA & STATISTIK (GET)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = 10; // 10 data per halaman
    const offset = (page - 1) * limit;

    // Hitung Statistik
    const statRes = await turso.execute(`
      SELECT 
        COUNT(*) as total_links, 
        SUM(hit_count) as total_clicks,
        SUM(CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 ELSE 0 END) as total_images
      FROM urls
    `);
    const stats = statRes.rows[0];

    // Ambil Data Pagination
    const dataRes = await turso.execute({
      sql: "SELECT * FROM urls ORDER BY created_at DESC LIMIT ? OFFSET ?",
      args: [limit, offset]
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalLinks: stats.total_links || 0,
        totalClicks: stats.total_clicks || 0,
        totalImages: stats.total_images || 0,
      },
      data: dataRes.rows,
      totalPages: Math.ceil((stats.total_links || 0) / limit) || 1
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

// EDIT TARGET URL (PUT)
export async function PUT(req) {
  try {
    const { id, target_url } = await req.json();
    const encoded = encodeUrl(target_url);
    await turso.execute({
      sql: "UPDATE urls SET target_url = ? WHERE id = ?",
      args: [encoded, id]
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

// HAPUS URL (DELETE)
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    await turso.execute({
      sql: "DELETE FROM urls WHERE id = ?",
      args: [id]
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
