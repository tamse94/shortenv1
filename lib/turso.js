import { createClient } from '@libsql/client';

// Proteksi agar build tidak error jika variabel belum ada di Vercel
const url = process.env.TURSO_URL || "libsql://placeholder.turso.io";
const authToken = process.env.TURSO_AUTH_TOKEN || "placeholder";

export const turso = createClient({
  url: url,
  authToken: authToken,
});

export async function getSetting(key) {
  try {
    if (!process.env.TURSO_URL) return ""; // Jangan eksekusi kalau belum ada URL
    const res = await turso.execute({
      sql: "SELECT value FROM settings WHERE key = ?",
      args: [key]
    });
    return res.rows[0]?.value || "";
  } catch (error) {
    return "";
  }
}
