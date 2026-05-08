"use client";
import { useState, useEffect, useCallback } from "react";

export default function ListURL() {
  const [urls, setUrls] = useState([]);
  const [stats, setStats] = useState({ totalLinks: 0, totalClicks: 0, totalImages: 0 });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  
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

  const handleCopy = (id) => {
    const link = `${window.location.origin}/${id}`;
    navigator.clipboard.writeText(link);
    setMsg({ text: `Link /${id} berhasil disalin!`, type: "success" });
    setTimeout(() => setMsg({ text: "", type: "" }), 3000);
  };

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

  const confirmDelete = async () => {
    setMsg({ text: "Menghapus data dan membersihkan file...", type: "warning" });
    const res = await fetch("/api/urls", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deleteModal.id })
    });
    if (res.ok) {
      setMsg({ text: `Link /${deleteModal.id} berhasil dihapus permanen!`, type: "success" });
      setDeleteModal({ show: false, id: "" });
      fetchData();
    } else {
      setMsg({ text: "Gagal menghapus data.", type: "danger" });
    }
    setTimeout(() => setMsg({ text: "", type: "" }), 3000);
  };

  // Fungsi aman untuk Decode URL (dari Base64 ke Teks biasa)
  const decodeUrlSafe = (encoded) => {
    try {
      return atob(encoded);
    } catch(e) {
      return encoded; // Fallback jika gagal decode
    }
  };

  return (
    <div className="row">
      <div className="col-md-12">
        
        <h3 style={{ marginTop: 0, marginBottom: '25px', color: '#337ab7', fontWeight: 'bold', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
          <span className="glyphicon glyphicon-th-list" style={{ marginRight: '8px' }}></span> Manajemen URL
        </h3>

        {/* AREA STATISTIK (Desain Panel Klasik yang Super Rapi) */}
        <div className="row">
          <div className="col-md-4 col-sm-4 col-xs-12">
            <div className="panel panel-info">
              <div className="panel-heading">
                <h3 className="panel-title"><span className="glyphicon glyphicon-link" style={{ marginRight: '5px' }}></span> Total Tautan</h3>
              </div>
              <div className="panel-body text-center">
                <h2 style={{ margin: '10px 0', fontWeight: 'bold', color: '#31708f' }}>{stats.totalLinks}</h2>
              </div>
            </div>
          </div>
          
          <div className="col-md-4 col-sm-4 col-xs-12">
            <div className="panel panel-success">
              <div className="panel-heading">
                <h3 className="panel-title"><span className="glyphicon glyphicon-hand-up" style={{ marginRight: '5px' }}></span> Total Pengunjung</h3>
              </div>
              <div className="panel-body text-center">
                <h2 style={{ margin: '10px 0', fontWeight: 'bold', color: '#3c763d' }}>{stats.totalClicks}</h2>
              </div>
            </div>
          </div>
          
          <div className="col-md-4 col-sm-4 col-xs-12">
            <div className="panel panel-warning">
              <div className="panel-heading">
                <h3 className="panel-title"><span className="glyphicon glyphicon-picture" style={{ marginRight: '5px' }}></span> Total Gambar</h3>
              </div>
              <div className="panel-body text-center">
                <h2 style={{ margin: '10px 0', fontWeight: 'bold', color: '#8a6d3b' }}>{stats.totalImages}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* NOTIFIKASI */}
        {msg.text && (
          <div className={`alert alert-${msg.type}`} style={{ padding: '10px', marginTop: '10px' }}>
            <strong>Info:</strong> {msg.text}
          </div>
        )}

        {/* TABEL BENAR-BENAR BISA DIGESER */}
        <div className="panel panel-default" style={{ marginTop: '15px' }}>
          <div className="panel-heading"><h3 className="panel-title">Daftar Link Aktif</h3></div>
          <div className="panel-body" style={{ padding: 0 }}>
            
            {/* Kunci Scroll: overflowX auto & WebkitOverflowScrolling */}
            <div className="table-responsive" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', border: 'none' }}>
              
              {/* Kunci Anti Numpuk: minWidth 1000px memastikan tabel gak bakal menyusut di HP */}
              <table className="table table-striped table-hover table-bordered" style={{ minWidth: '1000px', margin: 0 }}>
                <thead>
                  <tr className="bg-info">
                    <th style={{ width: '10%' }}>ID URL</th>
                    <th style={{ width: '20%' }}>Judul Meta</th>
                    <th style={{ width: '25%' }}>URL Tujuan</th>
                    <th style={{ width: '8%' }}>Mode</th>
                    <th style={{ width: '8%', textAlign: 'center' }}>Klik</th>
                    <th style={{ width: '12%' }}>Tgl Dibuat</th>
                    <th style={{ width: '17%', textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="7" className="text-center" style={{ padding: '40px' }}><div className="spinner" style={{ margin:'auto' }}></div></td></tr>
                  ) : urls.length === 0 ? (
                    <tr><td colSpan="7" className="text-center" style={{ padding: '30px', color: '#777' }}>Belum ada data tautan.</td></tr>
                  ) : (
                    urls.map((u) => {
                      const decodedUrl = decodeUrlSafe(u.target_url);
                      return (
                        <tr key={u.id}>
                          <td style={{ verticalAlign: 'middle' }}>
                            <a href={`/${u.id}`} target="_blank" style={{ fontWeight: 'bold', color: '#337ab7' }}>/{u.id}</a>
                          </td>
                          
                          {/* Truncate Judul Meta */}
                          <td style={{ verticalAlign: 'middle' }}>
                            <div style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={u.title || "Tanpa Judul"}>
                              {u.title || "-"}
                            </div>
                          </td>

                          {/* Truncate URL Tujuan */}
                          <td style={{ verticalAlign: 'middle' }}>
                            <div style={{ maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={decodedUrl}>
                              <a href={decodedUrl} target="_blank" style={{ color: '#555' }}>{decodedUrl}</a>
                            </div>
                          </td>
                          
                          <td style={{ verticalAlign: 'middle' }}>
                            <span className={`label ${u.mode === 'v1' ? 'label-primary' : 'label-success'}`}>
                              {u.mode.toUpperCase()}
                            </span>
                          </td>
                          
                          <td className="text-center" style={{ verticalAlign: 'middle' }}>
                            <span className="badge" style={{ backgroundColor: '#777' }}>{u.hit_count}</span>
                          </td>
                          
                          <td style={{ verticalAlign: 'middle', color: '#666' }}>
                            <small>{new Date(u.created_at).toLocaleDateString('id-ID')}</small>
                          </td>
                          
                          <td className="text-center" style={{ verticalAlign: 'middle' }}>
                            <button className="btn btn-default btn-sm" onClick={() => handleCopy(u.id)} title="Copy Link" style={{ marginRight: '5px' }}>
                              <span className="glyphicon glyphicon-copy"></span>
                            </button>
                            
                            {/* TOMBOL EDIT HANYA UNTUK V1 */}
                            {u.mode === 'v1' && (
                              <button className="btn btn-info btn-sm" onClick={() => setEditModal({ show: true, id: u.id, target_url: decodedUrl })} title="Edit Target URL" style={{ marginRight: '5px' }}>
                                <span className="glyphicon glyphicon-edit"></span>
                              </button>
                            )}
                            
                            {/* TOMBOL HAPUS */}
                            <button className="btn btn-danger btn-sm" onClick={() => setDeleteModal({ show: true, id: u.id })} title="Hapus Permanen">
                              <span className="glyphicon glyphicon-trash"></span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* PAGINATION */}
          <div className="panel-footer text-center" style={{ backgroundColor: '#f9f9f9', padding: '15px' }}>
            <button className="btn btn-default btn-sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
              <span className="glyphicon glyphicon-chevron-left"></span> Prev
            </button>
            <span style={{ margin: '0 20px', fontWeight: 'bold', color: '#555' }}>
              Halaman {page} / {totalPages}
            </span>
            <button className="btn btn-default btn-sm" disabled={page === totalPages || totalPages === 0} onClick={() => setPage(page + 1)}>
              Next <span className="glyphicon glyphicon-chevron-right"></span>
            </button>
          </div>
        </div>

        {/* MODAL EDIT */}
        {editModal.show && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
            <div className="panel panel-info" style={{ width: '100%', maxWidth: '500px', boxShadow: '0 5px 25px rgba(0,0,0,0.5)' }}>
              <div className="panel-heading"><h3 className="panel-title">Edit Target URL (/{editModal.id})</h3></div>
              <div className="panel-body">
                <form onSubmit={saveEdit}>
                  <div className="form-group">
                    <label>URL Tujuan Baru</label>
                    <input type="url" className="form-control" value={editModal.target_url} onChange={(e) => setEditModal({ ...editModal, target_url: e.target.value })} required />
                  </div>
                  <div className="text-right" style={{ marginTop: '20px' }}>
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
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
            <div className="panel panel-danger" style={{ width: '100%', maxWidth: '400px', boxShadow: '0 5px 25px rgba(0,0,0,0.5)' }}>
              <div className="panel-heading"><h3 className="panel-title">Konfirmasi Hapus</h3></div>
              <div className="panel-body text-center" style={{ padding: '25px' }}>
                <span className="glyphicon glyphicon-warning-sign" style={{ fontSize: '40px', color: '#d9534f', marginBottom: '15px' }}></span>
                <p>Yakin ingin menghapus tautan <strong>/{deleteModal.id}</strong>?</p>
                <p className="text-danger"><small>File gambar di Cloudinary juga akan dihapus.</small></p>
                <div style={{ marginTop: '25px' }}>
                  <button className="btn btn-default" onClick={() => setDeleteModal({ show: false, id: "" })} style={{ marginRight: '10px' }}>Batal</button>
                  <button className="btn btn-danger" onClick={confirmDelete}>Ya, Hapus</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
