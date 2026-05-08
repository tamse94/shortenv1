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
    setMsg({ text: `Link /${id} tersalin!`, type: "success" });
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
      setMsg({ text: `URL /${editModal.id} diperbarui!`, type: "success" });
      setEditModal({ show: false, id: "", target_url: "" });
      fetchData();
    }
    setTimeout(() => setMsg({ text: "", type: "" }), 3000);
  };

  const confirmDelete = async () => {
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
    <div>
      <div className="row">
        <div className="col-md-12">
          <h3 className="page-header" style={{ marginTop: 0, color: '#337ab7' }}>
            <span className="glyphicon glyphicon-th-list"></span> Manajemen URL
          </h3>
        </div>
      </div>

      {/* KOTAK STATISTIK - RAPI DAN AMAN */}
      <div className="row">
        <div className="col-md-4 col-sm-4 col-xs-12">
          <div className="panel panel-info">
            <div className="panel-heading"><h3 className="panel-title text-center"><span className="glyphicon glyphicon-link"></span> Total Tautan</h3></div>
            <div className="panel-body text-center"><h2 style={{ margin: 0, fontWeight: 'bold' }}>{stats.totalLinks}</h2></div>
          </div>
        </div>
        <div className="col-md-4 col-sm-4 col-xs-12">
          <div className="panel panel-success">
            <div className="panel-heading"><h3 className="panel-title text-center"><span className="glyphicon glyphicon-hand-up"></span> Total Pengunjung</h3></div>
            <div className="panel-body text-center"><h2 style={{ margin: 0, fontWeight: 'bold' }}>{stats.totalClicks}</h2></div>
          </div>
        </div>
        <div className="col-md-4 col-sm-4 col-xs-12">
          <div className="panel panel-warning">
            <div className="panel-heading"><h3 className="panel-title text-center"><span className="glyphicon glyphicon-picture"></span> Total Gambar</h3></div>
            <div className="panel-body text-center"><h2 style={{ margin: 0, fontWeight: 'bold' }}>{stats.totalImages}</h2></div>
          </div>
        </div>
      </div>

      {msg.text && (
        <div className="row">
          <div className="col-md-12">
            <div className={`alert alert-${msg.type}`}><strong>Info:</strong> {msg.text}</div>
          </div>
        </div>
      )}

      {/* AREA LIST KARTU (PENGGANTI TABEL) */}
      <div className="row">
        <div className="col-md-12">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">Daftar Link Aktif</h3>
            </div>
            
            {/* Pakai List Group, bukan Tabel */}
            <ul className="list-group">
              {loading ? (
                <li className="list-group-item text-center" style={{ padding: '30px' }}>Loading data...</li>
              ) : urls.length === 0 ? (
                <li className="list-group-item text-center" style={{ padding: '30px' }}>Belum ada data tautan.</li>
              ) : (
                urls.map((u) => {
                  const decodedUrl = decodeUrlSafe(u.target_url);
                  return (
                    <li className="list-group-item" key={u.id}>
                      <div className="row">
                        
                        {/* Bagian Kiri: Info Teks */}
                        <div className="col-sm-8 col-xs-12">
                          <h4 style={{ marginTop: 0, marginBottom: '10px' }}>
                            <a href={`/${u.id}`} target="_blank" style={{ fontWeight: 'bold', color: '#337ab7' }}>/{u.id}</a>
                            <span style={{ marginLeft: '10px' }} className={`label ${u.mode === 'v1' ? 'label-primary' : 'label-success'}`}>
                              {u.mode.toUpperCase()}
                            </span>
                          </h4>
                          
                          <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#333' }}>
                            <strong>Meta:</strong> <span style={{ color: '#555' }}>{u.title || "Tanpa Judul Meta"}</span>
                          </p>
                          
                          {/* wordBreak: break-all bikin link panjang otomatis turun ke bawah, ga bocor */}
                          <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#333', wordBreak: 'break-all' }}>
                            <strong>Tujuan:</strong> <a href={decodedUrl} target="_blank" className="text-muted">{decodedUrl}</a>
                          </p>
                          
                          <div style={{ color: '#888', fontSize: '12px' }}>
                            <span className="glyphicon glyphicon-time" style={{ marginRight: '5px' }}></span>
                            {new Date(u.created_at).toLocaleDateString('id-ID')}
                            <span style={{ margin: '0 10px' }}>|</span>
                            <span className="glyphicon glyphicon-eye-open" style={{ marginRight: '5px' }}></span>
                            <strong>{u.hit_count}</strong> Kali Diklik
                          </div>
                        </div>

                        {/* Bagian Kanan: Tombol Aksi */}
                        <div className="col-sm-4 col-xs-12" style={{ marginTop: '15px' }}>
                          <div className="btn-group" role="group" aria-label="Aksi Link">
                            <button className="btn btn-default btn-sm" onClick={() => handleCopy(u.id)} title="Copy Link">
                              <span className="glyphicon glyphicon-copy"></span> Copy
                            </button>
                            
                            {u.mode === 'v1' && (
                              <button className="btn btn-info btn-sm" onClick={() => setEditModal({ show: true, id: u.id, target_url: decodedUrl })} title="Edit Link">
                                <span className="glyphicon glyphicon-edit"></span> Edit
                              </button>
                            )}
                            
                            <button className="btn btn-danger btn-sm" onClick={() => setDeleteModal({ show: true, id: u.id })} title="Hapus Permanen">
                              <span className="glyphicon glyphicon-trash"></span> Hapus
                            </button>
                          </div>
                        </div>

                      </div>
                    </li>
                  );
                })
              )}
            </ul>

            {/* PAGINATION */}
            <div className="panel-footer text-center">
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
        </div>
      </div>

      {/* MODAL EDIT (Tetap Sama, Sudah Rapi) */}
      {editModal.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
          <div className="panel panel-info" style={{ width: '100%', maxWidth: '500px', boxShadow: '0 5px 15px rgba(0,0,0,0.5)' }}>
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

      {/* MODAL HAPUS (Tetap Sama, Sudah Rapi) */}
      {deleteModal.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
          <div className="panel panel-danger" style={{ width: '100%', maxWidth: '400px', boxShadow: '0 5px 15px rgba(0,0,0,0.5)' }}>
            <div className="panel-heading"><h3 className="panel-title">Konfirmasi Hapus</h3></div>
            <div className="panel-body text-center">
              <p style={{ fontSize: '16px' }}>Hapus permanen <strong>/{deleteModal.id}</strong>?</p>
              <div style={{ marginTop: '20px' }}>
                <button className="btn btn-default" onClick={() => setDeleteModal({ show: false, id: "" })} style={{ marginRight: '10px' }}>Batal</button>
                <button className="btn btn-danger" onClick={confirmDelete}>Ya, Hapus</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
