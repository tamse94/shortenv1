"use client";
import { useState } from "react";

export default function Dashboard() {
  const [mode, setMode] = useState("v1");

  return (
    <div className="panel panel-default">
      <div className="panel-heading"><h4>Buat Shorten URL</h4></div>
      <div className="panel-body">
        <div className="form-group">
          <label>Pilih Mode:</label>
          <select className="form-control" onChange={(e) => setMode(e.target.value)}>
            <option value="v1">Mode V1 (Hanya Link)</option>
            <option value="v2">Mode V2 (Lengkap + Image)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Custom ID:</label>
          <input type="text" className="form-control" placeholder="id123" />
        </div>

        <div className="form-group">
          <label>URL Tujuan:</label>
          <input type="text" className="form-control" placeholder="https://google.com" />
        </div>

        {mode === "v2" && (
          <>
            <div className="form-group">
              <label>Title:</label>
              <input type="text" className="form-control" />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea className="form-control"></textarea>
            </div>
            <div className="form-group">
              <label>Upload Image (Cloudinary):</label>
              <input type="file" className="form-control" />
            </div>
          </>
        )}
        <button className="btn btn-success btn-block">SIMPAN URL</button>
      </div>
    </div>
  );
}
