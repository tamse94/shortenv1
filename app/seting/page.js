"use client";
import { useState, useEffect } from "react";

export default function Settings() {
  const [msg, setMsg] = useState("");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [iconPreview, setIconPreview] = useState(null);
  const [ogPreview, setOgPreview] = useState(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Fungsi upload gambar via API Cloudinary kita
  const handleFileUpload = async (file) => {
    if (!file) return null;
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const result = await res.json();
      if (result.success) return result.url;
      throw new Error(result.error);
    } catch (err) {
      alert("Gagal upload gambar: " + err.message);
      return null;
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setMsg("Menyimpan Pengaturan...");
    setUploading(true);
    
    const form = e.target;
    let finalIcon = data.meta_icon || "";
    let finalOg = data.og_image || "";

    // Cek apakah ada file Icon/Favicon baru yang dipilih
    const iconFile = form.icon_file.files[0];
    if (iconFile) {
      const uploadedIcon = await handleFileUpload(iconFile);
      if (uploadedIcon) finalIcon = uploadedIcon;
    }

    // Cek apakah ada file OG Image baru yang dipilih
    const ogFile = form.og_file.files[0];
    if (ogFile) {
      const uploadedOg = await handleFileUpload(ogFile);
      if (uploadedOg) finalOg = uploadedOg;
    }

    // Susun data yang mau dikirim ke database
    const formData = Object.fromEntries(new FormData(form));
    
    // Hapus object file dari form data biar gak error pas disimpen ke database teks
    delete formData.icon_file;
    delete formData.og_file;

    // Tambahkan URL gambar yang udah diupload
    formData.meta_icon = finalIcon;
    formData.og_image = finalOg;

    const res = await fetch("/api/settings", {
      method: "POST",
      body: JSON.stringify(formData)
    });
    
    setUploading(false);
    if (res.ok) {
      setMsg("Berhasil disimpan!");
      setTimeout(() => setMsg(""), 3000);
      
      // Update data di state biar gambar langsung berubah tanpa refresh
      setData({ ...data, ...formData });
    } else {
      setMsg("Gagal menyimpan data.");
    }
  };

  if (loading) {
    return <div className="text-center" style={{ marginTop: '100px' }}><div className="spinner" style={{margin: 'auto'}}></div><h4>Memuat Pengaturan...</h4></div>;
  }

  return (
    <div className="row">
      <div className="col-md-10 col-md-offset-1">
        
        {msg && (
          <div className={`alert ${msg === "Berhasil disimpan!" ? "alert-success" : "alert-info"} text-center`} style={{ fontSize: '16px', fontWeight: 'bold' }}>
            {msg}
          </div>
        )}

        <form onSubmit={save}>
          
          {/* BAGIAN 1: INFORMASI WEB UTAMA */}
          <div className="panel panel-default">
            <div className="panel-heading"><h3 className="panel-title"><span className="glyphicon glyphicon-globe"></span> Informasi & SEO Website</h3></div>
            <div className="panel-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Nama Website (Site Name)</label>
                    <input name="site_name" className="form-control" defaultValue={data.site_name || ""} required />
                  </div>
                  <div className="form-group">
                    <label>Base URL Domain</label>
                    <input name="domain" className="form-control" placeholder="domain.com" defaultValue={data.domain || ""} required />
                  </div>
                  <div className="form-group">
                    <label>Deskripsi Website</label>
                    <textarea name="site_description" className="form-control" rows="4" placeholder="Deskripsi untuk SEO halaman utama..." defaultValue={data.site_description || ""} style={{ resize: 'vertical' }}></textarea>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Icon / Favicon</label>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      {/* Tampilkan icon yang ada di database atau preview */}
                      {(iconPreview || data.meta_icon) && <img src={iconPreview || data.meta_icon} style={{ width: '40px', height: '40px', borderRadius: '4px', border: '1px solid #ccc' }} />}
                      <input type="file" name="icon_file" className="form-control" accept="image/*" onChange={(e) => {
                        if (e.target.files[0]) setIconPreview(URL.createObjectURL(e.target.files[0]));
                      }} />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginTop: '20px' }}>
                    <label>Thumbnail Web Utama (OG Image)</label>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', flexDirection: 'column' }}>
                      {(ogPreview || data.og_image) && <img src={ogPreview || data.og_image} style={{ width: '100px', borderRadius: '4px', border: '1px solid #ccc' }} />}
                      <input type="file" name="og_file" className="form-control" accept="image/*" onChange={(e) => {
                        if (e.target.files[0]) setOgPreview(URL.createObjectURL(e.target.files[0]));
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BAGIAN 2: CLOUDINARY API */}
          <div className="panel panel-default">
            <div className="panel-heading"><h3 className="panel-title"><span className="glyphicon glyphicon-cloud-upload"></span> Cloudinary Storage</h3></div>
            <div className="panel-body">
              <p className="text-muted"><small><i>*Wajib diisi sebelum Anda bisa mengunggah gambar Icon/Thumbnail di atas.</i></small></p>
              <div className="row">
                <div className="col-md-3"><div className="form-group"><label>Cloud Name</label><input name="cloud_name" className="form-control" defaultValue={data.cloud_name || ""} /></div></div>
                <div className="col-md-3"><div className="form-group"><label>API Key</label><input name="api_key" className="form-control" defaultValue={data.api_key || ""} /></div></div>
                {/* Trik autoComplete="new-password" buat hilangin popup save password browser */}
                <div className="col-md-3"><div className="form-group"><label>API Secret</label><input name="api_secret" type="password" autoComplete="new-password" className="form-control" defaultValue={data.api_secret || ""} /></div></div>
                <div className="col-md-3"><div className="form-group"><label>Folder Target</label><input name="cloudinary_folder" className="form-control" defaultValue={data.cloudinary_folder || ""} /></div></div>
              </div>
            </div>
          </div>

          {/* BAGIAN 3: MANAJEMEN ADS & FITUR */}
          <div className="panel panel-default">
            <div className="panel-heading"><h3 className="panel-title"><span className="glyphicon glyphicon-usd"></span> Manajemen Iklan & Redirect</h3></div>
            <div className="panel-body">
              <div className="form-group">
                <label style={{color: 'red'}}>Paksa Buka di Chrome/Safari Eksternal (V1 & V2)</label>
                <select name="force_external" className="form-control" defaultValue={data.force_external || "off"}>
                  <option value="off">OFF - Bebas buka di dalam browser sosial media</option>
                  <option value="on">ON - Maksimalkan pendapatan (Paksa buka eksternal)</option>
                </select>
              </div>
              
              <hr />

              <div className="form-group">
                <label>Link Offer Utama / Popunder</label>
                <input name="link_offer" className="form-control" placeholder="https://..." defaultValue={data.link_offer || ""} />
              </div>

              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Area Head</label>
                    <textarea name="ads_head" className="form-control" rows="4" style={{ resize: 'vertical' }} defaultValue={data.ads_head || ""}></textarea>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Area Body (Atas)</label>
                    <textarea name="ads_body" className="form-control" rows="4" style={{ resize: 'vertical' }} defaultValue={data.ads_body || ""}></textarea>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Area Footer (Bawah)</label>
                    <textarea name="ads_footer" className="form-control" rows="4" style={{ resize: 'vertical' }} defaultValue={data.ads_footer || ""}></textarea>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Ads Mobile Only (Tampil di HP)</label>
                    <textarea name="ads_mobile" className="form-control" rows="4" style={{ resize: 'vertical' }} defaultValue={data.ads_mobile || ""}></textarea>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Ads Desktop Only (Tampil di PC)</label>
                    <textarea name="ads_desktop" className="form-control" rows="4" style={{ resize: 'vertical' }} defaultValue={data.ads_desktop || ""}></textarea>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <button className="btn btn-primary btn-block btn-lg" style={{ marginBottom: '40px' }} disabled={uploading}>
            {uploading ? "Menyimpan Data.." : "Simpan Semua Pengaturan"}
          </button>
        </form>
      </div>
    </div>
  );
}
