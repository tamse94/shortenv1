import { createClient } from '@libsql/client';

export const turso = createClient({
  url: process.env.TURSO_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Helper untuk ambil setting dinamis
export async function getSetting(key) {
  const res = await turso.execute({
    sql: "SELECT value FROM settings WHERE key = ?",
    args: [key]
  });
  return res.rows[0]?.value || "";
}
