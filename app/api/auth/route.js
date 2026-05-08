import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
  const { email, password } = await request.json();

  // Sekarang kita ambil dari Environment Variables Vercel
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASS = process.env.ADMIN_PASSWORD;

  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    // Set cookie 'admin_token'
    cookies().set("admin_token", "super-secret-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, 
      path: "/",
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json(
    { success: false, message: "Invalid email or password!" }, 
    { status: 401 }
  );
}
