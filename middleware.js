import { NextResponse } from 'next/server';

export function middleware(request) {
  const requestHeaders = new Headers(request.headers);
  // Simpan alamat halaman saat ini ke dalam header 'x-pathname'
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  // Jalankan middleware di semua halaman
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
