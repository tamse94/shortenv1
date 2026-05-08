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
      setMsg({ text: `Link /${deleteModal.id} dihapus!`, type: "success" });
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
          <h3 className="page-header" style={{ marginTop: 0 }}>
            <span className="glyphicon glyphicon-th-list"></span> Manajemen URL
          </h3>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4 col-xs-12">
          <div className="panel panel-info text-center">
            <div className="panel-heading"><h3 className="panel-title">Total Tautan</h3></div>
            <div className="panel-body"><h2 style={{ margin: 0 }}>{stats.totalLinks}</h2></div>
          </div>
        </div>
        <div className="col-md-4 col-xs-12">
          <div className="panel panel-success text-center">
            <div className="panel-heading"><h3 className="panel-title">Total Pengunjung</h3></div>
            <div className="panel-body"><h2 style={{ margin: 0 }}>{stats.totalClicks}</h2></div>
          </div>
        </div>
        <div className="col-md-4 col-xs-12">
          <div className="panel panel-warning text-center">
            <div className="panel-heading"><h3 className="panel-title">Total Gambar</h3></div>
            <div className="panel-body"><h2 style={{ margin: 0 }}>{stats.totalImages}</h2></div>
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

      <div className="row">
        <div className="col-md-12">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">Daftar Link Aktif</h3>
            </div>
            
            {/* INI KUNCI UTAMA RESPONSIVE TABLE BOOTSTRAP */}
            <div className="table-responsive">
              <table className="table table-bordered table-striped table-hover" style={{ whiteSpace: 'nowrap', margin: 0 }}>
                <thead>
                  <tr className="active">
                    <th>ID URL</th>
                    <th>Judul Meta</th>
                    <th>URL Tujuan</th>
                    <th className="text-center">Mode</th>
                    <th className="text-center">Klik</th>
                    <th>Dibuat</th>
                    <th className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="7" className="text-center" style={{ padding: '20px' }}>Loading...</td></tr>
                  ) : urls.length === 0 ? (
                    <tr><td colSpan="7" className="text-center" style={{ padding: '20px' }}>Data kosong.</td></tr>
                  ) : (
                    urls.map((u) => {
                      const decodedUrl = decodeUrlSafe(u.target_url);
                      return (
                        <tr key={u.id}>
                          <td><a href={`/${u.id}`} target="_blank"><strong>/{u.id}</strong></a></td>
                          <td style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.title || "-"}</td>
                          <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}><a href={decodedUrl} target="_blank">{decodedUrl}</a></td>
                          <td className="text-center"><span className={`label ${u.mode === 'v1' ? 'label-primary' : 'label-success'}`}>{u.mode.toUpperCase()}</span></td>
                          <td className="text-center"><span className="badge">{u.hit_count}</span></td>
                          <td><small>{new Date(u.created_at).toLocaleDateString('id-ID')}</small></td>
                          <td className="text-center">
                            <button className="btn btn-default btn-sm" onClick={() => handleCopy(u.id)} style={{ marginRight: '5px' }}><span className="glyphicon glyphicon-copy"></span></button>
                            {u.mode === 'v1' && (
                              <button className="btn btn-info btn-sm" onClick={() => setEditModal({ show: true, id: u.id, target_url: decodedUrl })} style={{ marginRight: '5px' }}><span className="glyphicon glyphicon-edit"></span></button>
                            )}
                            <button className="btn btn-danger btn-sm" onClick={() => setDeleteModal({ show: true, id: u.id })}><span className="glyphicon glyphicon-trash"></span></button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="panel-footer text-center">
              <button className="btn btn-default btn-sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
              <span style={{ margin: '0 15px', fontWeight: 'bold' }}>Hal {page} / {totalPages}</span>
              <button className="btn btn-default btn-sm" disabled={page === totalPages || totalPages === 0} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          </div>
        </div>
      </div>

      {editModal.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
          <div className="panel panel-info" style={{ width: '100%', maxWidth: '400px' }}>
            <div className="panel-heading"><h3 className="panel-title">Edit /{editModal.id}</h3></div>
            <div className="panel-body">
              <form onSubmit={saveEdit}>
                <div className="form-group"><label>URL Tujuan Baru</label><input type="url" className="form-control" value={editModal.target_url} onChange={(e) => setEditModal({ ...editModal, target_url: e.target.value })} required /></div>
                <div className="text-right"><button type="button" className="btn btn-default" onClick={() => setEditModal({ show: false, id: "", target_url: "" })} style={{ marginRight: '10px' }}>Batal</button><button type="submit" className="btn btn-info">Simpan</button></div>
              </form>
            </div>
          </div>
        </div>
      )}

      {deleteModal.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
          <div className="panel panel-danger" style={{ width: '100%', maxWidth: '400px' }}>
            <div className="panel-heading"><h3 className="panel-title">Hapus Tautan</h3></div>
            <div className="panel-body text-center">
              <p>Hapus permanen <strong>/{deleteModal.id}</strong>?</p>
              <div style={{ marginTop: '20px' }}><button className="btn btn-default" onClick={() => setDeleteModal({ show: false, id: "" })} style={{ marginRight: '10px' }}>Batal</button><button className="btn btn-danger" onClick={confirmDelete}>Hapus</button></div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
