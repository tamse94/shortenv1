import { turso } from "@/lib/turso";
import { encodeUrl } from "@/lib/encoder";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const { id, target_url, mode, title, description, image_url } = body;

  const encodedUrl = encodeUrl(target_url);

  try {
    await turso.execute({
      sql: "INSERT INTO urls (id, target_url, mode, title, description, image_url) VALUES (?, ?, ?, ?, ?, ?)",
      args: [id, encodedUrl, mode, title || null, description || null, image_url || null]
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
