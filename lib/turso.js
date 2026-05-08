import { createClient } from '@libsql/client';

/**
 * Inisialisasi Client Turso
 * Mengambil URL dan Token langsung dari Environment Variables Vercel
 */
export const turso = createClient({
  url: process.env.TURSO_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

/**
 * Helper untuk mengambil pengaturan website secara dinamis
 * Digunakan untuk site_name, meta_desc, cloudinary_api, dll.
 */
export async function getSetting(key) {
  try {
    const res = await turso.execute({
      sql: "SELECT value FROM settings WHERE key = ?",
      args: [key]
    });
    
    // Jika data ada, kembalikan value-nya. Jika tidak, kembalikan string kosong.
    return res.rows[0]?.value || "";
  } catch (error) {
    console.error("Gagal mengambil setting:", error);
    return "";
  }
}

/**
 * Helper untuk mengecek apakah ID Shorten sudah terpakai atau belum
 */
export async function isIdExists(id) {
  const res = await turso.execute({
    sql: "SELECT 1 FROM urls WHERE id = ?",
    args: [id]
  });
  return res.rows.length > 0;
}
