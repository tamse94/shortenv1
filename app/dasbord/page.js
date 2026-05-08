"use client";
import { useState } from "react";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState("");
  const [copyStatus, setCopyStatus] = useState("Copy Link");
  const [msg, setMsg] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", type: "" });
    setShortUrl("");

    const form = e.target;
    let target_url = form.target_url.value;
    let id = form.id.value;
    const mode = form.mode.value;

    // 1. Generate ID Otomatis kalau dikosongin
    if (!id) {
      id = Math.random().toString(36).substring(2, 8);
    }

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          target_url,
          mode,
          title: form.title?.value || "",
          description: form.description?.value || "",
          image_url: form.image_url?.value || ""
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Bikin URL lengkap sesuai domain saat ini
        const finalUrl = `${window.location.origin}/${id}`;
        setShortUrl(finalUrl);
        setMsg({ text: "URL berhasil dibuat!", type: "success" });
        form.reset(); // Bersihkan form
      } else {
        setMsg({ text: "Gagal: " + data.error, type: "danger" });
      }
    } catch (error) {
      setMsg({ text: "Terjadi kesalahan sistem.", type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopyStatus("Tersalin!");
    // Kembalikan teks tombol setelah 2 detik
    setTimeout(() => {
      setCopyStatus("Copy Link");
    }, 2000);
  };

  return (
    <div className="row">
      <div className="col-md-8 col-md-offset-2">
        <div className="panel panel-default" style={{ marginTop: '20px' }}>
          <div className="panel-heading">
            <h3 className="panel-title">Buat Short URL Baru</h3>
          </div>
          <div className="panel-body">
            
            {/* Pesan Sukses / Error Tanpa Alert JS */}
            {msg.text && (
              <div className={`alert alert-${msg.type}`} style={{ padding: '10px', marginBottom: '15px' }}>
                {msg.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>URL Tujuan (Target)</label>
                <input type="url" name="target_url" className="form-control" placeholder="https://link-panjang.com/..." required />
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Custom ID (Opsional)</label>
                    <input type="text" name="id" className="form-control" placeholder="Kosongkan untuk acak otomatis" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Mode Redirect</label>
                    <select name="mode" className="form-control">
                      <option value="v1">V1 - Redirect Langsung</option>
                      <option value="v2">V2 - Mode Meta / Safelink</option>
                    </select>
                  </div>
                </div>
              </div>

              <hr />
              <p className="text-muted"><small><i>*Isi bagian bawah ini jika menggunakan Mode V2</i></small></p>

              <div className="form-group">
                <label>Judul Meta</label>
                <input type="text" name="title" className="form-control" placeholder="Judul untuk tampil di sosmed" />
              </div>
              <div className="form-group">
                <label>Deskripsi Meta</label>
                <textarea name="description" className="form-control" rows="2" placeholder="Deskripsi singkat..."></textarea>
              </div>
              <div className="form-group">
                <label>URL Gambar (Thumbnail)</label>
                <input type="url" name="image_url" className="form-control" placeholder="https://..." />
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? "Memproses..." : "Buat Short URL"}
              </button>
            </form>

            {/* AREA RESULT & COPY BUTTON */}
            {shortUrl && (
              <div style={{ marginTop: '25px', padding: '15px', backgroundColor: '#f9f9f9', border: '1px dashed #ccc', borderRadius: '4px' }}>
                <label>Hasil Short URL:</label>
                <div className="input-group">
                  <input type="text" className="form-control" value={shortUrl} readOnly />
                  <span className="input-group-btn">
                    <button className="btn btn-success" type="button" onClick={handleCopy}>
                      {copyStatus}
                    </button>
                  </span>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
