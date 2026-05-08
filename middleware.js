import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  // 1. Ambil token dari cookie
  const token = request.cookies.get('admin_token')?.value;

  // 2. Daftar halaman yang wajib LOGIN
  const protectedPaths = ["/dasbord", "/list", "/seting"];
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtected) {
    // Jika mencoba masuk ke area proteksi tapi TIDAK punya token yang benar
    if (token !== 'super-secret-token') {
      // Tendang paksa ke halaman login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Izinkan lewat jika bukan halaman proteksi atau sudah punya token
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);
  
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

// Penting: Matcher ini buat mastiin middleware jalan di semua halaman kecuali file statis
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
