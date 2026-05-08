import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";
import { encodeUrl } from "@/lib/encoder";
import { configureCloudinary } from "@/lib/cloudinary";

// Fungsi untuk mengekstrak ID Gambar dari URL Cloudinary
function extractPublicId(url) {
  try {
    const parts = url.split('/upload/');
    if (parts.length > 1) {
      const pathWithVersion = parts[1];
      const pathWithoutVersion = pathWithVersion.replace(/^v\d+\//, ''); // Hapus versi (v123456/)
      return pathWithoutVersion.substring(0, pathWithoutVersion.lastIndexOf('.')); // Hapus ekstensi (.jpg)
    }
    return null;
  } catch (e) {
    return null;
  }
}

// AMBIL DATA & STATISTIK (GET)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const statRes = await turso.execute(`
      SELECT 
        COUNT(*) as total_links, 
        SUM(hit_count) as total_clicks,
        SUM(CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 ELSE 0 END) as total_images
      FROM urls
    `);
    const stats = statRes.rows[0];

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

// HAPUS URL DAN GAMBAR CLOUDINARY (DELETE)
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    // 1. Cek apakah link ini punya gambar
    const imgRes = await turso.execute({
      sql: "SELECT image_url FROM urls WHERE id = ?",
      args: [id]
    });
    
    const imageUrl = imgRes.rows[0]?.image_url;

    // 2. Jika ada gambar, hapus dari Cloudinary dulu
    if (imageUrl) {
      const publicId = extractPublicId(imageUrl);
      if (publicId) {
        const cloudinary = await configureCloudinary();
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // 3. Baru hapus data dari database
    await turso.execute({
      sql: "DELETE FROM urls WHERE id = ?",
      args: [id]
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
