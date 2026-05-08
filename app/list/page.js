"use client";
import { useState, useEffect, useCallback } from "react";

export default function ListURL() {
  const [urls, setUrls] = useState([]);
  const [stats, setStats] = useState({ totalLinks: 0, totalClicks: 0, totalImages: 0 });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // State untuk Notifikasi & Modal
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [editModal, setEditModal] = useState({ show: false, id: "", target_url: "" });
  const [deleteModal, setDeleteModal] = useState({ show: false, id: "" });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/urls?page=${page}`);
      const result = await res.json();
      if (result.success) {
        setUrls(result.data);
        setStats(result.stats);
        setTotalPages(result.totalPages);
      }
    } catch (err) {
      setMsg({ text: "Gagal memuat data.", type: "danger" });
    }
    setLoading(false);
  }, [page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Fungsi Copy
  const handleCopy = (id) => {
    const link = `${window.location.origin}/${id}`;
    navigator.clipboard.writeText(link);
    setMsg({ text: `Link /${id} berhasil disalin!`, type: "success" });
    setTimeout(() => setMsg({ text: "", type: "" }), 3000);
  };

  // Fungsi Edit Target
  const saveEdit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/urls", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editModal.id, target_url: editModal.target_url })
    });
    if (res.ok) {
      setMsg({ text: `Target URL untuk /${editModal.id} diperbarui!`, type: "success" });
      setEditModal({ show: false, id: "", target_url: "" });
      fetchData();
    }
    setTimeout(() => setMsg({ text: "", type: "" }), 3000);
  };

  // Fungsi Hapus
  const confirmDelete = async () => {
    const res = await fetch("/api/urls", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deleteModal.id })
    });
    if (res.ok) {
      setMsg({ text: `Link /${deleteModal.id} berhasil dihapus!`, type: "warning" });
      setDeleteModal({ show: false, id: "" });
      fetchData();
    }
    setTimeout(() => setMsg({ text: "", type: "" }), 3000);
  };

  // Trik CSS untuk memotong teks kepanjangan di tabel
  const truncateStyle = { maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };

  return (
    <div className="row">
      <div className="col-md-12">
        
        <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#337ab7', fontWeight: 'bold' }}>
          <span className="glyphicon glyphicon-list-alt"></span> Manajemen URL
        </h3>

        {/* AREA STATISTIK */}
        <div className="row">
          <div className="col-md-4 col-xs-12">
            <div className="panel panel-info text-center" style={{ padding: '15px' }}>
              <h2 style={{ margin: '0', color: '#31708f' }}>{stats.totalLinks}</h2>
              <p className="text-muted" style={{ margin: 0 }}>Total Tautan</p>
            </div>
          </div>
          <div className="col-md-4 col-xs-12">
            <div className="panel panel-success text-center" style={{ padding: '15px' }}>
              <h2 style={{ margin: '0', color: '#3c763d' }}>{stats.totalClicks}</h2>
              <p className="text-muted" style={{ margin: 0 }}>Total Pengunjung (Klik)</p>
            </div>
          </div>
          <div className="col-md-4 col-xs-12">
            <div className="panel panel-warning text-center" style={{ padding: '15px' }}>
              <h2 style={{ margin: '0', color: '#8a6d3b' }}>{stats.totalImages}</h2>
              <p className="text-muted" style={{ margin: 0 }}>Total Gambar Thumbnail</p>
            </div>
          </div>
        </div>

        {/* NOTIFIKASI TANPA ALERT() */}
        {msg.text && (
          <div className={`alert alert-${msg.type} alert-dismissible`} role="alert">
            <strong>Info:</strong> {msg.text}
          </div>
        )}

        {/* TABEL DATA RESPONSIVE */}
        <div className="panel panel-default">
          <div className="panel-heading"><h3 className="panel-title">Daftar Link Aktif</h3></div>
          <div className="panel-body" style={{ padding: 0 }}>
            <div className="table-responsive">
              <table className="table table-striped table-hover" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th>ID URL</th>
                    <th>Judul Meta</th>
                    <th>Mode</th>
                    <th>Klik</th>
                    <th>Dibuat Pada</th>
                    <th className="text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="6" className="text-center" style={{ padding: '30px' }}><div className="spinner" style={{ margin:'auto' }}></div></td></tr>
                  ) : urls.length === 0 ? (
                    <tr><td colSpan="6" className="text-center" style={{ padding: '20px' }}>Belum ada data.</td></tr>
                  ) : (
                    urls.map((u) => (
                      <tr key={u.id}>
                        <td><a href={`/${u.id}`} target="_blank" style={{ fontWeight: 'bold' }}>/{u.id}</a></td>
                        {/* Judul terpotong otomatis biar tabel gak hancur */}
                        <td style={truncateStyle} title={u.title || "Tanpa Judul"}>{u.title || "-"}</td>
                        <td>
                          <span className={`label ${u.mode === 'v1' ? 'label-primary' : 'label-success'}`}>
                            {u.mode.toUpperCase()}
                          </span>
                        </td>
                        <td><span className="badge">{u.hit_count}</span></td>
                        <td><small>{new Date(u.created_at).toLocaleDateString('id-ID')}</small></td>
                        <td className="text-right" style={{ minWidth: '180px' }}>
                          
                          {/* Tombol Copy Khusus V1 (tapi V2 juga dikasih biar user gampang) */}
                          <button className="btn btn-default btn-sm" onClick={() => handleCopy(u.id)} title="Copy Link">
                            <span className="glyphicon glyphicon-copy"></span>
                          </button>
                          &nbsp;
                          {/* Tombol Edit */}
                          <button className="btn btn-info btn-sm" onClick={() => {
                            // Decode base64 dulu biar pas diedit keliatan link aslinya
                            const decoded = Buffer.from(u.target_url, 'base64').toString('utf-8');
                            setEditModal({ show: true, id: u.id, target_url: decoded });
                          }} title="Edit Target URL">
                            <span className="glyphicon glyphicon-edit"></span>
                          </button>
                          &nbsp;
                          {/* Tombol Hapus */}
                          <button className="btn btn-danger btn-sm" onClick={() => setDeleteModal({ show: true, id: u.id })} title="Hapus">
                            <span className="glyphicon glyphicon-trash"></span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* PAGINATION: Prev 1/10 Next */}
          <div className="panel-footer text-center" style={{ backgroundColor: '#fff' }}>
            <button className="btn btn-default btn-sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
              <span className="glyphicon glyphicon-chevron-left"></span> Prev
            </button>
            <span style={{ margin: '0 15px', fontWeight: 'bold', color: '#555' }}>
              Halaman {page} / {totalPages}
            </span>
            <button className="btn btn-default btn-sm" disabled={page === totalPages || totalPages === 0} onClick={() => setPage(page + 1)}>
              Next <span className="glyphicon glyphicon-chevron-right"></span>
            </button>
          </div>
        </div>

        {/* MODAL EDIT (Pure React, no jQuery required) */}
        {editModal.show && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
            <div className="panel panel-default" style={{ width: '100%', maxWidth: '500px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }}>
              <div className="panel-heading">
                <h3 className="panel-title">Edit Target URL (/{editModal.id})</h3>
              </div>
              <div className="panel-body">
                <form onSubmit={saveEdit}>
                  <div className="form-group">
                    <label>URL Tujuan Baru</label>
                    <input type="url" className="form-control" value={editModal.target_url} onChange={(e) => setEditModal({ ...editModal, target_url: e.target.value })} required />
                  </div>
                  <div className="text-right">
                    <button type="button" className="btn btn-default" onClick={() => setEditModal({ show: false, id: "", target_url: "" })} style={{ marginRight: '10px' }}>Batal</button>
                    <button type="submit" className="btn btn-info">Simpan Perubahan</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* MODAL HAPUS */}
        {deleteModal.show && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
            <div className="panel panel-danger" style={{ width: '100%', maxWidth: '400px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }}>
              <div className="panel-heading"><h3 className="panel-title">Konfirmasi Hapus</h3></div>
              <div className="panel-body text-center">
                <p>Apakah Anda yakin ingin menghapus tautan <strong>/{deleteModal.id}</strong>?</p>
                <p className="text-muted"><small>Data dan statistik tautan ini akan hilang permanen.</small></p>
                <div style={{ marginTop: '20px' }}>
                  <button className="btn btn-default" onClick={() => setDeleteModal({ show: false, id: "" })} style={{ marginRight: '10px' }}>Batal</button>
                  <button className="btn btn-danger" onClick={confirmDelete}>Ya, Hapus Tautan</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
