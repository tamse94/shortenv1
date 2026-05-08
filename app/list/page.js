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
      setMsg({ text: `Link /${deleteModal.id} beserta filenya berhasil dihapus permanen!`, type: "success" });
      setDeleteModal({ show: false, id: "" });
      fetchData();
    } else {
      setMsg({ text: "Gagal menghapus data.", type: "danger" });
    }
    setTimeout(() => setMsg({ text: "", type: "" }), 3000);
  };

  return (
    <div className="row">
      <div className="col-md-12">
        
        <h3 style={{ marginTop: 0, marginBottom: '25px', color: '#337ab7', fontWeight: 'bold', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
          <span className="glyphicon glyphicon-list-alt"></span> Manajemen URL
        </h3>

        {/* AREA STATISTIK DENGAN IKON */}
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-sm-4 col-xs-12" style={{ marginBottom: '15px' }}>
            <div className="panel panel-default" style={{ borderLeft: '4px solid #337ab7', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
              <div className="panel-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p className="text-muted" style={{ margin: 0, fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>Total Tautan</p>
                  <h3 style={{ margin: '5px 0 0 0', fontWeight: 'bold', color: '#333' }}>{stats.totalLinks}</h3>
                </div>
                <span className="glyphicon glyphicon-link" style={{ fontSize: '30px', color: '#337ab7', opacity: 0.3 }}></span>
              </div>
            </div>
          </div>
          
          <div className="col-sm-4 col-xs-12" style={{ marginBottom: '15px' }}>
            <div className="panel panel-default" style={{ borderLeft: '4px solid #5cb85c', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
              <div className="panel-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p className="text-muted" style={{ margin: 0, fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>Total Klik</p>
                  <h3 style={{ margin: '5px 0 0 0', fontWeight: 'bold', color: '#333' }}>{stats.totalClicks}</h3>
                </div>
                <span className="glyphicon glyphicon-hand-up" style={{ fontSize: '30px', color: '#5cb85c', opacity: 0.3 }}></span>
              </div>
            </div>
          </div>
          
          <div className="col-sm-4 col-xs-12" style={{ marginBottom: '15px' }}>
            <div className="panel panel-default" style={{ borderLeft: '4px solid #f0ad4e', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
              <div className="panel-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p className="text-muted" style={{ margin: 0, fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>Total Gambar</p>
                  <h3 style={{ margin: '5px 0 0 0', fontWeight: 'bold', color: '#333' }}>{stats.totalImages}</h3>
                </div>
                <span className="glyphicon glyphicon-picture" style={{ fontSize: '30px', color: '#f0ad4e', opacity: 0.3 }}></span>
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

        {/* TABEL BISA DIGESER (SCROLLABLE) */}
        <div className="panel panel-default" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <div className="panel-heading"><h3 className="panel-title">Daftar Link Aktif</h3></div>
          <div className="panel-body" style={{ padding: 0 }}>
            {/* Class table-responsive ini yang bikin tabel bisa digeser di HP */}
            <div className="table-responsive" style={{ border: 'none' }}>
              {/* Tambahan whiteSpace: nowrap biar teks gak dipaksa turun ke bawah baris */}
              <table className="table table-striped table-hover" style={{ margin: 0, whiteSpace: 'nowrap' }}>
                <thead>
                  <tr>
                    <th>ID URL</th>
                    <th>Judul Meta</th>
                    <th>Mode</th>
                    <th>Klik</th>
                    <th>Tgl Dibuat</th>
                    <th className="text-center">Aksi</th>
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
                        <td style={{ verticalAlign: 'middle' }}><a href={`/${u.id}`} target="_blank" style={{ fontWeight: 'bold' }}>/{u.id}</a></td>
                        
                        <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', verticalAlign: 'middle' }} title={u.title || "Tanpa Judul"}>
                          {u.title || "-"}
                        </td>
                        
                        <td style={{ verticalAlign: 'middle' }}>
                          <span className={`label ${u.mode === 'v1' ? 'label-primary' : 'label-success'}`}>
                            {u.mode.toUpperCase()}
                          </span>
                        </td>
                        
                        <td style={{ verticalAlign: 'middle' }}><span className="badge" style={{ backgroundColor: '#777' }}>{u.hit_count}</span></td>
                        <td style={{ verticalAlign: 'middle' }}><small>{new Date(u.created_at).toLocaleDateString('id-ID')}</small></td>
                        
                        <td className="text-center" style={{ verticalAlign: 'middle' }}>
                          <button className="btn btn-default btn-sm" onClick={() => handleCopy(u.id)} title="Copy Link" style={{ marginRight: '5px' }}>
                            <span className="glyphicon glyphicon-copy"></span>
                          </button>
                          
                          {/* TOMBOL EDIT KHUSUS V1 */}
                          {u.mode === 'v1' && (
                            <button className="btn btn-info btn-sm" onClick={() => {
                              const decoded = Buffer.from(u.target_url, 'base64').toString('utf-8');
                              setEditModal({ show: true, id: u.id, target_url: decoded });
                            }} title="Edit Target URL" style={{ marginRight: '5px' }}>
                              <span className="glyphicon glyphicon-edit"></span>
                            </button>
                          )}
                          
                          {/* TOMBOL HAPUS */}
                          <button className="btn btn-danger btn-sm" onClick={() => setDeleteModal({ show: true, id: u.id })} title="Hapus Permanen">
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
          
          <div className="panel-footer text-center" style={{ backgroundColor: '#fff', padding: '15px' }}>
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

        {/* MODAL EDIT (V1 Only) */}
        {editModal.show && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
            <div className="panel panel-default" style={{ width: '100%', maxWidth: '500px', boxShadow: '0 5px 25px rgba(0,0,0,0.5)' }}>
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
                <p>Apakah Anda yakin ingin menghapus tautan <strong>/{deleteModal.id}</strong>?</p>
                <p className="text-danger"><small><b>PENTING:</b> Data statistik dan gambar thumbnail di Cloudinary juga akan dihapus permanen untuk menghemat ruang.</small></p>
                <div style={{ marginTop: '25px' }}>
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
