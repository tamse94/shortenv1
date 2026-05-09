import { headers } from "next/headers";

export default function robots() {
  // Ambil host dinamis
  const headerList = headers();
  const host = headerList.get('host') || 'domain.com';
  const plainDomain = host.replace(/^https?:\/\//, '').replace(/^www\./, '');

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Blokir akses bot ke area admin dan login
      disallow: ['/dasbord', '/list', '/seting', '/login'], 
    },
    sitemap: [
      `https://${plainDomain}/sitemap.xml`,
      `https://${plainDomain}/sitemap-shorten.xml`
    ],
  }
}
