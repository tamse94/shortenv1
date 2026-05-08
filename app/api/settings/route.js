import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache"; // Perintah reset cache

export async function GET() {
  try {
    const res = await turso.execute("SELECT key, value FROM settings");
    const settings = {};
    res.rows.forEach(row => { settings[row.key] = row.value; });
    return NextResponse.json(settings);
  } catch (error) { return NextResponse.json({}); }
}

export async function POST(req) {
  try {
    const data = await req.json();
    
    for (const [key, value] of Object.entries(data)) {
      await turso.execute({
        sql: "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
        args: [key, value]
      });
    }
    
    // Paksa Next.js untuk memperbarui data di semua halaman secara instan
    revalidatePath("/", "layout");
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
