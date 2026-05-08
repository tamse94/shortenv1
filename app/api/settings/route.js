import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";

// Fungsi untuk MENGAMBIL data saat halaman seting dibuka
export async function GET() {
  try {
    const res = await turso.execute("SELECT key, value FROM settings");
    const settings = {};
    res.rows.forEach(row => {
      settings[row.key] = row.value;
    });
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({});
  }
}

// Fungsi untuk MENYIMPAN data saat tombol diklik
export async function POST(req) {
  try {
    const data = await req.json();
    
    // Looping untuk nyimpen semua data ke tabel settings
    for (const [key, value] of Object.entries(data)) {
      await turso.execute({
        sql: "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
        args: [key, value]
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
