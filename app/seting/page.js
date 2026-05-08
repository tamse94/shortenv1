"use client";
import { useState } from "react";

export default function Settings() {
  const [msg, setMsg] = useState("");

  const save = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    const res = await fetch("/api/settings", {
      method: "POST",
      body: JSON.stringify(data)
    });
    if (res.ok) setMsg("Berhasil disimpan!");
  };

  return (
    <div className="card">
      <h4>Konfigurasi Web</h4>
      {msg && <div className="alert alert-success">{msg}</div>}
      <form onSubmit={save}>
        <div className="form-group"><label>Site Name</label><input name="site_name" className="form-control" /></div>
        <div className="form-group"><label>Base URL (domain.com)</label><input name="domain" className="form-control" /></div>
        <hr/>
        <h5>Cloudinary API</h5>
        <div className="form-group"><label>Cloud Name</label><input name="cloud_name" className="form-control" /></div>
        <div className="form-group"><label>API Key</label><input name="api_key" className="form-control" /></div>
        <div className="form-group"><label>API Secret</label><input name="api_secret" type="password" className="form-control" /></div>
        <button className="btn btn-primary btn-block">Simpan Pengaturan</button>
      </form>
    </div>
  );
}
