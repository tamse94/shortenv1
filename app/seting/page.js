"use client";
import { useState, useEffect } from "react";

export default function Settings() {
  const [msg, setMsg] = useState("");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
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
      setTimeout(() => setMsg(""), 3000);
    } else {
      setMsg("Gagal menyimpan data.");
    }
  };

  if (loading) {
    return <div className="card text-center" style={{ marginTop: '50px' }}><h4>Memuat Pengaturan...</h4></div>;
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="panel panel-default" style={{ marginTop: '20px' }}>
          <div className="panel-heading"><h3 className="panel-title">Konfigurasi Sistem</h3></div>
          <div className="panel-body">
            
            {msg && <div className={`alert ${msg === "Berhasil disimpan!" ? "alert-success" : "alert-info"}`}>{msg}</div>}

            <form onSubmit={save}>
              {/* PENGATURAN UMUM */}
              <h4>Pengaturan Umum</h4>
              <hr style={{marginTop: '5px'}}/>
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Site Name</label>
                    <input name="site_name" className="form-control" defaultValue={data.site_name || ""} required />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Base URL</label>
                    <input name="domain" className="form-control" placeholder="domain.com" defaultValue={data.domain || ""} required />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label style={{color: 'red'}}>Paksa Buka di Browser Standar (V1 & V2)</label>
                    <select name="force_external" className="form-control" defaultValue={data.force_external || "off"}>
                      <option value="off">OFF - Bebas buka di dalam Sosmed</option>
                      <option value="on">ON - Paksa buka di Chrome/Safari</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* CLOUDINARY */}
              <h4 style={{marginTop: '20px'}}>Cloudinary API</h4>
              <hr style={{marginTop: '5px'}}/>
              <div className="row">
                <div className="col-md-3"><div className="form-group"><label>Cloud Name</label><input name="cloud_name" className="form-control" defaultValue={data.cloud_name || ""} /></div></div>
                <div className="col-md-3"><div className="form-group"><label>API Key</label><input name="api_key" className="form-control" defaultValue={data.api_key || ""} /></div></div>
                <div className="col-md-3"><div className="form-group"><label>API Secret</label><input name="api_secret" type="password" className="form-control" defaultValue={data.api_secret || ""} /></div></div>
                <div className="col-md-3"><div className="form-group"><label>Upload Folder</label><input name="cloudinary_folder" className="form-control" defaultValue={data.cloudinary_folder || ""} /></div></div>
              </div>

              {/* SLOT IKLAN */}
              <h4 style={{marginTop: '20px', color: '#007bff'}}>Manajemen Slot Iklan (Khusus V2)</h4>
              <p className="text-muted"><small><i>Support semua script iklan JS (Monetag, Adsterra, Adsense, dll). Kosongkan jika tidak dipakai.</i></small></p>
              <hr style={{marginTop: '5px'}}/>
              
              <div className="form-group">
                <label>Link Offer / Popunder</label>
                <input name="link_offer" className="form-control" placeholder="https://iklan-offer.com/..." defaultValue={data.link_offer || ""} />
              </div>

              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Area Head (Di dalam &lt;head&gt;)</label>
                    <textarea name="ads_head" className="form-control" rows="4" placeholder="<script>...</script>" defaultValue={data.ads_head || ""}></textarea>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Area Body (Di Atas Konten)</label>
                    <textarea name="ads_body" className="form-control" rows="4" placeholder="<script>...</script>" defaultValue={data.ads_body || ""}></textarea>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Area Footer (Di Bawah Konten)</label>
                    <textarea name="ads_footer" className="form-control" rows="4" placeholder="<script>...</script>" defaultValue={data.ads_footer || ""}></textarea>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Iklan Khusus Ukuran HP (Mobile Only)</label>
                    <textarea name="ads_mobile" className="form-control" rows="4" placeholder="Banner 300x250..." defaultValue={data.ads_mobile || ""}></textarea>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Iklan Khusus PC (Desktop Only)</label>
                    <textarea name="ads_desktop" className="form-control" rows="4" placeholder="Banner 728x90..." defaultValue={data.ads_desktop || ""}></textarea>
                  </div>
                </div>
              </div>
              
              <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: '20px' }}>Simpan Semua Pengaturan</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
