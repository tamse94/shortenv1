import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // Membatasi akses ke halaman dasbord dan seting
  if (path.startsWith('/dasbord') || path.startsWith('/seting')) {
    // Di sinilah nanti Anda bisa menambahkan logika pengecekan token/cookie keamanan
    // Jika tidak aman, lempar ke halaman utama/404:
    // return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  // Hanya jalankan middleware ini pada path berikut:
  matcher: ['/dasbord/:path*', '/seting/:path*'],
};
