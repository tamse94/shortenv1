// Fungsi encode ke Base64 (untuk target_url)
export function encodeUrl(url) {
  return Buffer.from(url).toString('base64');
}

// Fungsi decode dari Base64 (untuk redirect)
export function decodeUrl(encoded) {
  return Buffer.from(encoded, 'base64').toString('utf-8');
}

// Fungsi dummy untuk ID (karena lo mau id123, id456)
export function decodeId(id) {
  return id; // Langsung return string ID-nya saja
}
