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
      setMsg({ text: `Target URL /${editModal.id} diperbarui!`, type: "success" });
      setEditModal({ show: false, id: "", target_url: "" });
      fetchData();
    }
    setTimeout(() => setMsg({ text: "", type: "" }), 3000);
  };

  const confirmDelete = async () => {
    setMsg({ text: "Menghapus data...", type: "warning" });
    const res = await fetch("/api/urls", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deleteModal.id })
    });
    if (res.ok) {
      setMsg({ text: `Link /${deleteModal.id} dihapus permanen!`, type: "success" });
      setDeleteModal({ show: false, id: "" });
      fetchData();
    }
    setTimeout(() => setMsg({ text: "", type: "" }), 3000);
  };

  const decodeUrlSafe = (encoded) => {
    try { return atob(encoded); } catch(e) { return encoded; }
  };

  return (
    <div className="row">
      <div className="col-md-12">
        
        <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#337ab7', fontWeight: 'bold' }}>
          <span className="glyphicon glyphicon-th-list"></span> Manajemen URL
        </h3>

        {/* AREA STATISTIK - BOOTSTRAP MURNI TENGAH */}
        <div className="row">
          <div className="col-md-4 col-sm-4 col-xs-12">
            <div className="panel panel-info text-center">
              <div className="panel-body" style={{ padding: '20px' }}>
                <span className="glyphicon glyphicon-link" style={{ fontSize: '30px', color: '#31708f' }}></span>
                <h2 style={{ margin: '10px 0', fontWeight: 'bold', color: '#31708f' }}>{stats.totalLinks}</h2>
                <p className="text-muted" style={{ margin: 0, fontWeight: 'bold' }}>TOTAL TAUTAN</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-4 col-sm-4 col-xs-12">
            <div className="panel panel-success text-center">
              <div className="panel-body" style={{ padding: '20px' }}>
                <span className="glyphicon glyphicon-hand-up" style={{ fontSize: '30px', color: '#3c763d' }}></span>
                <h2 style={{ margin: '10px 0', fontWeight: 'bold', color: '#3c763d' }}>{stats.totalClicks}</h2>
                <p className="text-muted" style={{ margin: 0, fontWeight: 'bold' }}>TOTAL PENGUNJUNG</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-4 col-sm-4 col-xs-12">
            <div className="panel panel-warning text-center">
              <div className="panel-body" style={{ padding: '20px' }}>
                <span className="glyphicon glyphicon-picture" style={{ fontSize: '30px', color: '#8a6d3b' }}></span>
                <h2 style={{ margin: '10px 0', fontWeight: 'bold', color: '#8a6d3b' }}>{stats.totalImages}</h2>
                <p className="text-muted" style={{ margin: 0, fontWeight: 'bold' }}>TOTAL GAMBAR</p>
              </div>
            </div>
          </div>
        </div>

        {/* NOTIFIKASI */}
        {msg.text && (
          <div className={`alert alert-${msg.type}`} style={{ padding: '10px' }}>
            <strong>Info:</strong> {msg.text}
          </div>
        )}

        {/* TABEL RESPONSIVE MURNI BOOTSTRAP 3 */}
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">Daftar Link Aktif</h3>
          </div>
          
          {/* Class table-responsive ini HANYA membungkus tabel, diletakkan DI LUAR panel-body */}
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered" style={{ margin: 0, whiteSpace: 'nowrap' }}>
              <thead>
                <tr className="active">
                  <th>ID URL</th>
                  <th>Judul Meta</th>
                  <th>URL Tujuan</th>
                  <th className="text-center">Mode</th>
                  <th className="text-center">Klik</th>
                  <th>Tgl Dibuat</th>
                  <th className="text-center">Aksi</th>
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
                          <a href={`/${u.id}`} target="_blank" style={{ fontWeight: 'bold' }}>/{u.id}</a>
                        </td>
                        
                        <td style={{ verticalAlign: 'middle' }}>
                          <div style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }} title={u.title || "Tanpa Judul"}>
                            {u.title || "-"}
                          </div>
                        </td>

                        <td style={{ verticalAlign: 'middle' }}>
                          <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }} title={decodedUrl}>
                            <a href={decodedUrl} target="_blank" className="text-muted">{decodedUrl}</a>
                          </div>
                        </td>
                        
                        <td className="text-center" style={{ verticalAlign: 'middle' }}>
                          <span className={`label ${u.mode === 'v1' ? 'label-primary' : 'label-success'}`}>
                            {u.mode.toUpperCase()}
                          </span>
                        </td>
                        
                        <td className="text-center" style={{ verticalAlign: 'middle' }}>
                          <span className="badge">{u.hit_count}</span>
                        </td>
                        
                        <td style={{ verticalAlign: 'middle' }}>
                          <small>{new Date(u.created_at).toLocaleDateString('id-ID')}</small>
                        </td>
                        
                        <td className="text-center" style={{ verticalAlign: 'middle' }}>
                          <button className="btn btn-default btn-sm" onClick={() => handleCopy(u.id)} title="Copy Link" style={{ marginRight: '5px' }}>
                            <span className="glyphicon glyphicon-copy"></span>
                          </button>
                          
                          {/* TOMBOL EDIT KHUSUS V1 */}
                          {u.mode === 'v1' && (
                            <button className="btn btn-info btn-sm" onClick={() => setEditModal({ show: true, id: u.id, target_url: decodedUrl })} title="Edit" style={{ marginRight: '5px' }}>
                              <span className="glyphicon glyphicon-edit"></span>
                            </button>
                          )}
                          
                          <button className="btn btn-danger btn-sm" onClick={() => setDeleteModal({ show: true, id: u.id })} title="Hapus">
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
          
          {/* PAGINATION */}
          <div className="panel-footer text-center">
            <button className="btn btn-default btn-sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
              <span className="glyphicon glyphicon-chevron-left"></span> Prev
            </button>
            <span style={{ margin: '0 20px', fontWeight: 'bold' }}>
              Halaman {page} / {totalPages}
            </span>
            <button className="btn btn-default btn-sm" disabled={page === totalPages || totalPages === 0} onClick={() => setPage(page + 1)}>
              Next <span className="glyphicon glyphicon-chevron-right"></span>
            </button>
          </div>
        </div>

        {/* MODAL EDIT TARGET URL */}
        {editModal.show && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
            <div className="panel panel-info" style={{ width: '100%', maxWidth: '500px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }}>
              <div className="panel-heading"><h3 className="panel-title">Edit Target URL (/{editModal.id})</h3></div>
              <div className="panel-body">
                <form onSubmit={saveEdit}>
                  <div className="form-group">
                    <label>URL Tujuan Baru</label>
                    <input type="url" className="form-control" value={editModal.target_url} onChange={(e) => setEditModal({ ...editModal, target_url: e.target.value })} required />
                  </div>
                  <div className="text-right" style={{ marginTop: '20px' }}>
                    <button type="button" className="btn btn-default" onClick={() => setEditModal({ show: false, id: "", target_url: "" })} style={{ marginRight: '10px' }}>Batal</button>
                    <button type="submit" className="btn btn-info">Simpan</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DELETE */}
        {deleteModal.show && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
            <div className="panel panel-danger" style={{ width: '100%', maxWidth: '400px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }}>
              <div className="panel-heading"><h3 className="panel-title">Konfirmasi Hapus</h3></div>
              <div className="panel-body text-center" style={{ padding: '20px' }}>
                <p>Yakin ingin menghapus tautan <strong>/{deleteModal.id}</strong>?</p>
                <div style={{ marginTop: '20px' }}>
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
