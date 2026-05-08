import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    // Mengambil input dari form login
    const { email, password } = await request.json();

    // Mengambil kredensial dari Environment Variables Vercel
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASS = process.env.ADMIN_PASSWORD;

    // Validasi kecocokan data
    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      
      // Memberikan cookie 'admin_token' sebagai tiket akses
      // Token ini harus sama dengan yang diperiksa di middleware.js
      cookies().set("admin_token", "super-secret-token", {
        httpOnly: true, // Tidak bisa dibaca oleh script browser (aman)
        secure: process.env.NODE_ENV === "production", // Wajib HTTPS di Vercel
        maxAge: 60 * 60 * 24, // Berlaku selama 24 jam
        path: "/",
      });

      return NextResponse.json({ success: true });
    }

    // Jika tidak cocok, kirim pesan error
    return NextResponse.json(
      { success: false, message: "Invalid email or password!" }, 
      { status: 401 }
    );

  } catch (error) {
    // Menangani error jika JSON tidak valid atau masalah server
    return NextResponse.json(
      { success: false, message: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}
