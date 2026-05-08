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

  // Fungsi untuk handle upload gambar ke Cloudinary lewat API kita
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
        return data.url; // Ini URL secure_url dari Cloudinary
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
    
    // Jika Mode V2, upload gambarnya dulu
    if (mode === "v2") {
      const fileInput = form.image_file.files[0];
      if (fileInput) {
        finalImageUrl = await handleFileUpload(fileInput);
        if (!finalImageUrl) {
          setLoading(false);
          return; // Stop kalau upload gagal
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
        <div className="panel panel-default" style={{ marginTop: '20px' }}>
          <div className="panel-heading">
            <h3 className="panel-title">Buat Short URL</h3>
          </div>
          <div className="panel-body">
            
            <ul className="nav nav-pills" style={{ marginBottom: '20px' }}>
              <li className={mode === "v1" ? "active" : ""}><a href="#" onClick={(e) => { e.preventDefault(); setMode("v1"); setShortUrl(""); }}>V1 (Langsung)</a></li>
              <li className={mode === "v2" ? "active" : ""}><a href="#" onClick={(e) => { e.preventDefault(); setMode("v2"); setShortUrl(""); }}>V2 (Meta Image)</a></li>
            </ul>

            {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>URL Tujuan</label>
                <input type="url" name="target_url" className="form-control" placeholder="https://..." required />
              </div>

              {mode === "v2" && (
                <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '5px', border: '1px solid #ddd', marginBottom: '15px' }}>
                  <div className="form-group">
                    <label>Judul Meta</label>
                    <input type="text" name="title" className="form-control" placeholder="Judul share..." required />
                  </div>
                  <div className="form-group">
                    <label>Deskripsi Meta</label>
                    <textarea name="description" className="form-control" rows="2" placeholder="Deskripsi..." required></textarea>
                  </div>
                  <div className="form-group">
                    <label>Upload Gambar (Thumbnail)</label>
                    <input type="file" name="image_file" className="form-control" accept="image/*" required onChange={(e) => {
                      if (e.target.files[0]) setPreview(URL.createObjectURL(e.target.files[0]));
                    }} />
                    {preview && <img src={preview} style={{ width: '100px', marginTop: '10px', borderRadius: '4px' }} />}
                    {uploading && <p className="text-info"><small>Sedang mengunggah ke Cloudinary...</small></p>}
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-block" disabled={loading || uploading}>
                {loading ? "Memproses..." : uploading ? "Sedang Upload Gambar..." : "Buat Link"}
              </button>
            </form>

            {shortUrl && (
              <div style={{ marginTop: '25px', padding: '15px', backgroundColor: '#eefbfa', border: '1px dashed #008080' }}>
                <label>Hasil URL:</label>
                <div className="input-group">
                  <input type="text" className="form-control" value={shortUrl} readOnly />
                  <span className="input-group-btn">
                    <button className="btn btn-success" type="button" onClick={() => {
                      navigator.clipboard.writeText(shortUrl);
                      setCopyStatus("Tersalin!");
                      setTimeout(() => setCopyStatus("Copy Link"), 2000);
                    }}>{copyStatus}</button>
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
