"use client";
import { useState } from "react";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState("");
  const [copyStatus, setCopyStatus] = useState("Copy Link");
  const [msg, setMsg] = useState({ text: "", type: "" });
  
  // State untuk misahin tampilan V1 dan V2
  const [mode, setMode] = useState("v1");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", type: "" });
    setShortUrl("");

    const form = e.target;
    const target_url = form.target_url.value;

    // Generate ID acak 6 karakter otomatis (tanpa input user)
    const id = Math.random().toString(36).substring(2, 8);

    // Ambil data meta kalau form-nya ada (Mode V2)
    const title = form.title ? form.title.value : "";
    const description = form.description ? form.description.value : "";
    const image_url = form.image_url ? form.image_url.value : "";

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          target_url,
          mode,
          title,
          description,
          image_url
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Gabungin domain web lo sama ID acaknya
        const finalUrl = `${window.location.origin}/${id}`;
        setShortUrl(finalUrl);
        setMsg({ text: "URL berhasil dibuat otomatis!", type: "success" });
        form.reset();
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
    // Balikin teks tombol setelah 2 detik
    setTimeout(() => setCopyStatus("Copy Link"), 2000);
  };

  return (
    <div className="row">
      <div className="col-md-8 col-md-offset-2">
        <div className="panel panel-default" style={{ marginTop: '20px' }}>
          <div className="panel-heading">
            <h3 className="panel-title">Buat Short URL Baru</h3>
          </div>
          <div className="panel-body">
            
            {/* Tombol Pemisah V1 dan V2 */}
            <ul className="nav nav-pills" style={{ marginBottom: '20px' }}>
              <li className={mode === "v1" ? "active" : ""}>
                <a href="#" onClick={(e) => { e.preventDefault(); setMode("v1"); setShortUrl(""); setMsg({text:"", type:""}); }}>
                  V1 (Direct / Langsung)
                </a>
              </li>
              <li className={mode === "v2" ? "active" : ""}>
                <a href="#" onClick={(e) => { e.preventDefault(); setMode("v2"); setShortUrl(""); setMsg({text:"", type:""}); }}>
                  V2 (Meta / Safelink)
                </a>
              </li>
            </ul>

            {/* Notifikasi Sukses/Gagal */}
            {msg.text && (
              <div className={`alert alert-${msg.type}`} style={{ padding: '10px', marginBottom: '15px' }}>
                {msg.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>URL Tujuan (Target Asli)</label>
                <input type="url" name="target_url" className="form-control" placeholder="https://link-panjang.com/..." required />
              </div>

              {/* Tampilkan form Meta HANYA kalau tombol V2 ditekan */}
              {mode === "v2" && (
                <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '5px', border: '1px solid #ddd', marginBottom: '15px' }}>
                  <p className="text-muted"><small><i>Pengaturan tampilan untuk Share di Facebook/WA</i></small></p>
                  <div className="form-group">
                    <label>Judul Meta</label>
                    <input type="text" name="title" className="form-control" placeholder="Judul untuk tampil di sosmed" required />
                  </div>
                  <div className="form-group">
                    <label>Deskripsi Meta</label>
                    <textarea name="description" className="form-control" rows="2" placeholder="Deskripsi singkat..." required></textarea>
                  </div>
                  <div className="form-group">
                    <label>URL Gambar (Thumbnail)</label>
                    <input type="url" name="image_url" className="form-control" placeholder="https://..." required />
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? "Memproses..." : `Buat Link (${mode.toUpperCase()})`}
              </button>
            </form>

            {/* AREA RESULT & COPY BUTTON */}
            {shortUrl && (
              <div style={{ marginTop: '25px', padding: '15px', backgroundColor: '#eefbfa', border: '1px dashed #008080', borderRadius: '4px' }}>
                <label>Hasil URL (ID Acak Otomatis):</label>
                <div className="input-group">
                  <input type="text" className="form-control" value={shortUrl} readOnly style={{ backgroundColor: '#fff' }} />
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
