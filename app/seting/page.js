"use client";
import { useState, useEffect } from "react";

export default function Settings() {
  const [msg, setMsg] = useState("");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  // Mengambil data dari database saat halaman pertama kali dibuka
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false); // Selesai loading, tampilkan form
      })
      .catch(() => setLoading(false));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setMsg("Menyimpan...");
    const formData = Object.fromEntries(new FormData(e.target));
    
    const res = await fetch("/api/settings", {
      method: "POST",
      body: JSON.stringify(formData)
    });
    
    if (res.ok) {
      setMsg("Berhasil disimpan!");
      // Hilangkan notif hijau setelah 3 detik
      setTimeout(() => setMsg(""), 3000);
    } else {
      setMsg("Gagal menyimpan data.");
    }
  };

  // Tampilan saat data sedang ditarik dari database
  if (loading) {
    return (
      <div className="card text-center" style={{ marginTop: '50px' }}>
        <h4>Memuat Pengaturan...</h4>
      </div>
    );
  }

  return (
    <div className="card" style={{ marginTop: '20px' }}>
      <h4>Konfigurasi Web</h4>
      
      {msg && (
        <div className={`alert ${msg === "Berhasil disimpan!" ? "alert-success" : "alert-info"}`}>
          {msg}
        </div>
      )}

      <form onSubmit={save}>
        <div className="form-group">
          <label>Site Name</label>
          {/* defaultValue otomatis ngisi kotak dengan data dari database */}
          <input name="site_name" className="form-control" defaultValue={data.site_name || ""} required />
        </div>
        
        <div className="form-group">
          <label>Base URL</label>
          <input name="domain" className="form-control" placeholder="domain.com" defaultValue={data.domain || ""} required />
        </div>
        
        <hr/>
        <h5>Cloudinary API</h5>
        
        <div className="form-group">
          <label>Cloud Name</label>
          <input name="cloud_name" className="form-control" defaultValue={data.cloud_name || ""} required />
        </div>
        
        <div className="form-group">
          <label>API Key</label>
          <input name="api_key" className="form-control" defaultValue={data.api_key || ""} required />
        </div>
        
        <div className="form-group">
          <label>API Secret</label>
          <input name="api_secret" type="password" className="form-control" defaultValue={data.api_secret || ""} required />
        </div>
        
        <div className="form-group">
          <label>Folder / Upload Preset</label>
          <input name="cloudinary_folder" className="form-control" placeholder="Misal: shorten_images" defaultValue={data.cloudinary_folder || ""} />
        </div>
        
        <button className="btn btn-primary btn-block" style={{ marginTop: '20px' }}>Simpan Pengaturan</button>
      </form>
    </div>
  );
}
