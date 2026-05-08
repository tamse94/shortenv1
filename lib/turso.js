import { createClient } from '@libsql/client';

export const turso = createClient({
  url: process.env.TURSO_URL || "libsql://placeholder.turso.io",
  authToken: process.env.TURSO_AUTH_TOKEN || "placeholder",
});

export async function getSetting(key) {
  try {
    if (!process.env.TURSO_URL) return "";
    const res = await turso.execute({
      sql: "SELECT value FROM settings WHERE key = ?",
      args: [key]
    });
    return res.rows[0]?.value || "";
  } catch (error) {
    return "";
  }
}
