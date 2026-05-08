import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
  const { email, password } = await request.json();

  // GANTI INI SAMA EMAIL DAN PASSWORD LOGIN LO NANTI
  const ADMIN_EMAIL = "admin@domain.com";
  const ADMIN_PASS = "admin123";

  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    // Set cookie 'admin_token' sebagai tanda udah login (Aktif 1 hari)
    cookies().set("admin_token", "super-secret-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 jam
      path: "/",
    });
    return NextResponse.json({ success: true });
  }

  // Kalau salah, tolak!
  return NextResponse.json(
    { success: false, message: "Email atau password salah boss!" }, 
    { status: 401 }
  );
}
