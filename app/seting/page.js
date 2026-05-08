"use client";
import { useState } from "react";

export default function Settings() {
  const [status, setStatus] = useState({ type: "", message: "" });
  
  // Fungsi lokal untuk simpan form
  const _handleSave = async (e) => {
    e.preventDefault();
    setStatus({ type: "info", message: "Menyimpan pengaturan..." });
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      
      if (res.ok) {
        setStatus({ type: "success", message: "Pengaturan berhasil disimpan!" });
      } else {
        setStatus({ type: "danger", message: "Gagal menyimpan pengaturan." });
      }
    } catch (err) {
      setStatus({ type: "danger", message: "Terjadi kesalahan sistem." });
    }
  };

  return (
    <div className="panel panel-default" style={{ marginTop: '20px' }}>
      <div className="panel-heading">
        <h4 className="panel-title">Pengaturan Sistem</h4>
      </div>
      <div className="panel-body">
        {status.message && (
          <div className={`alert alert-${status.type}`}>
            {status.message}
          </div>
        )}
        
        <form onSubmit={_handleSave}>
          <div className="form-group">
            <label>Site Name</label>
            <input type="text" name="site_name" className="form-control" placeholder="Nama Situs" required />
          </div>
          
          <div className="form-group">
            <label>Domain Configuration</label>
            <input type="text" name="domain" className="form-control" placeholder="domain.com" required />
            <p className="help-block" style={{ fontSize: '12px' }}>
              Masukkan hanya nama domain (contoh: domain.com) tanpa menggunakan awalan https:// ataupun www.
            </p>
          </div>
          
          <div className="form-group">
            <label>Meta Description</label>
            <textarea name="meta_desc" className="form-control" rows="3"></textarea>
          </div>

          <hr />
          <h5><strong>Konfigurasi Cloudinary</strong></h5>
          
          <div className="form-group">
            <label>Cloud Name</label>
            <input type="text" name="cloud_name" className="form-control" />
          </div>
          
          <div className="form-group">
            <label>API Key</label>
            <input type="text" name="api_key" className="form-control" />
          </div>
          
          <div className="form-group">
            <label>API Secret</label>
            <input type="password" name="api_secret" className="form-control" />
          </div>

          <button type="submit" className="btn btn-primary btn-block">SIMPAN PENGATURAN</button>
        </form>
      </div>
    </div>
  );
}
