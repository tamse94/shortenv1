import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    
    // Looping data untuk dimasukkan ke tabel settings
    for (const [key, value] of Object.entries(body)) {
      if (value) {
        await turso.execute({
          // Menggunakan UPSERT (Jika key sudah ada, update value-nya)
          sql: `INSERT INTO settings (key, value) VALUES (?, ?) 
                ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
          args: [key, value]
        });
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
