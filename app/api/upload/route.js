import { NextResponse } from "next/server";
import { configureCloudinary } from "@/lib/cloudinary";
import { getSetting } from "@/lib/turso";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Panggil 3 konfigurasi utama (Name, Key, Secret)
    const cloudinary = await configureCloudinary();
    
    // Panggil konfigurasi ke-4 (Folder) dari database Turso
    const folderName = await getSetting("cloudinary_folder") || "default_folder"; 

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: folderName }, // Masukkan file ke folder dari settingan lo
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
