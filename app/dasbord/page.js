"use client";
import { useState } from "react";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [shortUrl, setShortUrl] = useState("");
  const [copyStatus, setCopyStatus] = useState("Copy Link");
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [mode, setMode] = useState("v1");
  const [preview, setPreview] = useState(null);

  const handleFileUpload = async (file) => {
    if (!file) return null;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setUploading(false);
        return data.url; 
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setUploading(false);
      setMsg({ text: "Gagal upload gambar: " + err.message, type: "danger" });
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", type: "" });
    setShortUrl("");

    const form = e.target;
    const target_url = form.target_url.value;
    const id = Math.random().toString(36).substring(2, 8);

    let finalImageUrl = "";
    
    if (mode === "v2") {
      const fileInput = form.image_file.files[0];
      if (fileInput) {
        finalImageUrl = await handleFileUpload(fileInput);
        if (!finalImageUrl) {
          setLoading(false);
          return;
        }
      }
    }

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          target_url,
          mode,
          title: form.title ? form.title.value : "",
          description: form.description ? form.description.value : "",
          image_url: finalImageUrl
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShortUrl(`${window.location.origin}/${id}`);
        setMsg({ text: "Link berhasil dibuat!", type: "success" });
        form.reset();
        setPreview(null);
      } else {
        setMsg({ text: "Gagal: " + data.error, type: "danger" });
      }
    } catch (error) {
      setMsg({ text: "Kesalahan sistem.", type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row">
      <div className="col-md-8 col-md-offset-2">
        
        {/* PANEL UTAMA: Form Generator */}
        <div className="panel panel-default" style={{ marginTop: '10px' }}>
          <div className="panel-heading">
            <h3 className="panel-title"><span className="glyphicon glyphicon-link" style={{ marginRight: '8px' }}></span>Buat Short URL</h3>
          </div>
          <div className="panel-body">
            
            <ul className="nav nav-pills" style={{ marginBottom: '20px' }}>
              <li className={mode === "v1" ? "active" : ""}><a href="#" onClick={(e) => { e.preventDefault(); setMode("v1"); setShortUrl(""); }}>V1 (Langsung)</a></li>
              <li className={mode === "v2" ? "active" : ""}><a href="#" onClick={(e) => { e.preventDefault(); setMode("v2"); setShortUrl(""); }}>V2 (Meta Image & Ads)</a></li>
            </ul>

            {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>URL Tujuan</label>
                <input type="url" name="target_url" className="form-control input-lg" placeholder="https://link-panjang.com/..." required />
              </div>

              {mode === "v2" && (
                <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '5px', border: '1px solid #ddd', marginBottom: '15px' }}>
                  <div className="form-group">
                    <label>Judul Meta (Title)</label>
                    <input type="text" name="title" className="form-control" placeholder="Tulis judul menarik untuk sosmed..." required />
                  </div>
                  <div className="form-group">
                    <label>Deskripsi Meta</label>
                    <textarea name="description" className="form-control" rows="2" placeholder="Tulis deskripsi singkat..." required></textarea>
                  </div>
                  <div className="form-group">
                    <label>Upload Thumbnail</label>
                    <input type="file" name="image_file" className="form-control" accept="image/*" required onChange={(e) => {
                      if (e.target.files[0]) setPreview(URL.createObjectURL(e.target.files[0]));
                    }} />
                    {preview && <img src={preview} style={{ width: '120px', marginTop: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />}
                    {uploading && <p className="text-info" style={{ marginTop: '5px' }}><small><span className="glyphicon glyphicon-refresh" style={{ animation: 'spin 2s linear infinite' }}></span> Sedang mengunggah ke server...</small></p>}
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading || uploading}>
                {loading ? "Memproses..." : uploading ? "Menyimpan Gambar..." : "Buat Tautan Sekarang"}
              </button>
            </form>

            {shortUrl && (
              <div style={{ marginTop: '25px', padding: '15px', backgroundColor: '#eefbfa', border: '1px dashed #008080', borderRadius: '4px' }}>
                <label>Hasil URL Anda:</label>
                <div className="input-group">
                  <input type="text" className="form-control input-lg" value={shortUrl} readOnly style={{ backgroundColor: '#fff' }} />
                  <span className="input-group-btn">
                    <button className="btn btn-success btn-lg" type="button" onClick={() => {
                      navigator.clipboard.writeText(shortUrl);
                      setCopyStatus("Tersalin!");
                      setTimeout(() => setCopyStatus("Copy Link"), 2000);
                    }}>
                      <span className="glyphicon glyphicon-copy" style={{ marginRight: '5px' }}></span>
                      {copyStatus}
                    </button>
                  </span>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* AREA ARTIKEL PENJELASAN */}
        <div className="info-box">
          <div className="row">
            <div className="col-md-6">
              <h4 className="info-title">
                <span className="glyphicon glyphicon-flash" style={{ color: '#f39c12', marginRight: '8px' }}></span>
                Mode V1 (Direct Redirect)
              </h4>
              <p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                Mode ini berfungsi untuk mengalihkan pengunjung secara instan ke link tujuan tanpa jeda atau halaman perantara. Sangat cocok untuk memendekkan URL biasa dengan proses yang sangat cepat dan tanpa hambatan.
              </p>
            </div>
            <div className="col-md-6">
              <h4 className="info-title">
                <span className="glyphicon glyphicon-picture" style={{ color: '#00c0ef', marginRight: '8px' }}></span>
                Mode V2 (Meta & Ads)
              </h4>
              <p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                Mode ini menampilkan kartu perantara (Safelink) yang dilengkapi dengan gambar thumbnail, judul kustom, dan dukungan script iklan. Sangat optimal untuk dibagikan di sosial media (Facebook, WhatsApp) guna meningkatkan pendapatan iklan.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
