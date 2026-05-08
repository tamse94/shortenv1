import { NextResponse } from "next/server";
import { configureCloudinary } from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    // Ubah file menjadi buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Ambil konfigurasi dinamis dari database
    const cloudinary = await configureCloudinary();

    // Upload menggunakan stream (karena di lingkungan Next.js / serverless)
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "shortener_meta" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({ success: true, url: uploadResult.secure_url });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
