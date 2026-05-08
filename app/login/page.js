"use client";
import { useState } from "react";
import Link from "next/link";
import { config } from "@/lib/config";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Nembak ke API Auth untuk verifikasi
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        // Jika sukses, redirect ke dashboard
        window.location.href = "/dasbord";
      } else {
        // Jika gagal, tampilkan pesan error tanpa alert()
        setLoading(false);
        setMessage({ 
          type: "danger", 
          text: data.message || "Invalid email or password. Please try again." 
        });
      }
    } catch (error) {
      setLoading(false);
      setMessage({ 
        type: "danger", 
        text: "Server error. Please check your connection." 
      });
    }
  };

  return (
    <div className="row" style={{ marginTop: '40px' }}>
      <div className="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3">
        
        <div className="panel panel-default" style={{ 
          borderRadius: '12px', 
          boxShadow: '0 10px 25px rgba(0,0,0,0.05)', 
          border: '1px solid #e3e8ee',
          overflow: 'hidden'
        }}>
          <div className="panel-body" style={{ padding: '40px 30px' }}>
            
            {/* HEADER LOGO */}
            <div className="text-center" style={{ marginBottom: '30px' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                backgroundColor: '#f0f7ff', 
                borderRadius: '50%', 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '15px'
              }}>
                <span className="glyphicon glyphicon-lock" style={{ fontSize: '24px', color: '#337ab7' }}></span>
              </div>
              <h2 style={{ fontWeight: '800', margin: '0 0 10px 0', color: '#2c3e50' }}>Sign In</h2>
              <p className="text-muted">Access your dashboard and statistics.</p>
            </div>

            {/* ERROR/SUCCESS MESSAGE DISPLAY */}
            {message.text && (
              <div className={`alert alert-${message.type}`} style={{ borderRadius: '8px', fontSize: '14px', border: 'none' }}>
                <span className="glyphicon glyphicon-exclamation-sign" style={{ marginRight: '8px' }}></span>
                {message.text}
              </div>
            )}

            {/* LOGIN FORM */}
            <form onSubmit={handleLogin}>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: '600', color: '#546e7a', marginBottom: '8px' }}>Email Address</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="admin@domain.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  style={{ height: '45px', borderRadius: '8px', border: '1px solid #d1d9e2' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '25px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label style={{ fontWeight: '600', color: '#546e7a', marginBottom: '8px' }}>Password</label>
                  <a href="#" style={{ fontSize: '13px', color: '#337ab7', fontWeight: '500' }}>Forgot?</a>
                </div>
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  style={{ height: '45px', borderRadius: '8px', border: '1px solid #d1d9e2' }}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-block" 
                disabled={loading}
                style={{ 
                  height: '48px', 
                  borderRadius: '8px', 
                  fontWeight: '700', 
                  fontSize: '16px', 
                  backgroundColor: '#337ab7', 
                  border: 'none',
                  boxShadow: '0 4px 10px rgba(51, 122, 183, 0.2)',
                }}
              >
                {loading ? (
                  <span><i className="glyphicon glyphicon-refresh" style={{ animation: 'spin 2s linear infinite', marginRight: '8px' }}></i> Signing in...</span>
                ) : "Sign In"}
              </button>
            </form>

            <div style={{ margin: '30px 0', textAlign: 'center', position: 'relative' }}>
              <hr style={{ borderTop: '1px solid #eee' }} />
              <span style={{ 
                position: 'absolute', 
                top: '-10px', 
                left: '50%', 
                transform: 'translateX(-50%)', 
                backgroundColor: '#fff', 
                padding: '0 15px', 
                color: '#999', 
                fontSize: '12px' 
              }}>OR</span>
            </div>

            {/* CREATE ACCOUNT (REFERRAL LINK) */}
            <div className="text-center">
              <p className="text-muted" style={{ marginBottom: '12px', fontSize: '13px' }}>Don't have an account yet?</p>
              <a 
                href={config.referralLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-default btn-block"
                style={{ 
                  height: '45px', 
                  borderRadius: '8px', 
                  fontWeight: '600', 
                  color: '#2c3e50', 
                  border: '1px solid #d1d9e2' 
                }}
              >
                Create New Account
              </a>
            </div>

          </div>
        </div>
        
        <div className="text-center" style={{ marginTop: '20px' }}>
          <Link href="/" style={{ color: '#777', fontSize: '14px', textDecoration: 'none' }}>
            <span className="glyphicon glyphicon-arrow-left" style={{ marginRight: '5px', fontSize: '10px' }}></span>
            Back to Homepage
          </Link>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
