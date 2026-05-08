"use client";
import { useState, useEffect } from "react";
import { config } from "@/lib/config";

export default function HomePage() {
  const [targetUrl, setTargetUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [siteName, setSiteName] = useState("ShortenURL"); // Fallback sementara sebelum DB ke-load
  const [copyStatus, setCopyStatus] = useState("Copy");

  // Ambil site name murni dari Database (Halaman Settings)
  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.site_name) setSiteName(data.site_name);
      });
  }, []);

  const handleShorten = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const id = Math.random().toString(36).substring(2, 8);
    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          target_url: targetUrl,
          mode: "v1", // Default V1 di halaman depan
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShortUrl(`${window.location.origin}/${id}`);
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const shareSocial = (platform) => {
    const text = `Cek link ini: ${shortUrl}`;
    const url = encodeURIComponent(shortUrl);
    const platforms = {
      wa: `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`,
      fb: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      x: `https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(text)}`
    };
    window.open(platforms[platform], "_blank");
  };

  return (
    <div className="row">
      <div className="col-md-12 text-center" style={{ padding: '40px 0' }}>
        
        {/* HEADER AREA: SITE NAME DARI DATABASE */}
        <h1 style={{ fontWeight: '800', fontSize: '38px', color: '#337ab7', marginBottom: '10px' }}>
          {siteName}
        </h1>
        <p className="text-muted" style={{ fontSize: '18px', marginBottom: '40px' }}>
          Fastest way to shorten your long URLs for easy sharing.
        </p>

        {/* BOX UTAMA (WIDE) */}
        <div className="panel panel-default" style={{ marginBottom: '40px' }}>
          <div className="panel-body" style={{ padding: '35px' }}>
            
            {!shortUrl ? (
              // TAMPILAN AWAL: INPUT
              <form onSubmit={handleShorten}>
                <div className="input-group input-group-lg" style={{ width: '100%' }}>
                  <input 
                    type="url" 
                    className="form-control" 
                    placeholder="Paste your long URL here..." 
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    required
                    style={{ borderRadius: '6px 0 0 6px', borderRight: 'none' }}
                  />
                  <span className="input-group-btn">
                    <button className="btn btn-primary" type="submit" disabled={loading} style={{ paddingLeft: '30px', paddingRight: '30px', borderRadius: '0 6px 6px 0' }}>
                      {loading ? (
                        <span><span className="glyphicon glyphicon-refresh" style={{ animation: 'spin 2s linear infinite' }}></span> Memproses...</span>
                      ) : "Shorten URL"}
                    </button>
                  </span>
                </div>
              </form>
            ) : (
              // TAMPILAN SETELAH JADI: RESULT & SHARE
              <div className="result-area animate-fade-in">
                <div className="input-group input-group-lg" style={{ width: '100%', marginBottom: '20px' }}>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={shortUrl} 
                    readOnly 
                    style={{ backgroundColor: '#fff', borderRadius: '6px 0 0 6px' }} 
                  />
                  <span className="input-group-btn">
                    <button className="btn btn-success" onClick={() => {
                      navigator.clipboard.writeText(shortUrl);
                      setCopyStatus("Tersalin!");
                      setTimeout(() => setCopyStatus("Copy"), 2000);
                    }}>
                      <span className="glyphicon glyphicon-copy"></span> {copyStatus}
                    </button>
                    <button className="btn btn-default" onClick={() => { setShortUrl(""); setTargetUrl(""); }}>
                      <span className="glyphicon glyphicon-repeat"></span>
                    </button>
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', alignItems: 'center' }}>
                  <span className="text-muted">Share to:</span>
                  
                  {/* WhatsApp */}
                  <button onClick={() => shareSocial('wa')} className="btn btn-link" style={{ padding: 0 }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="#25D366"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.464c1.589.943 3.131 1.417 4.757 1.418 5.4 0 9.794-4.393 9.797-9.794.001-2.618-1.019-5.08-2.87-6.932-1.851-1.852-4.311-2.872-6.93-2.872-5.4 0-9.794 4.394-9.797 9.795 0 1.724.451 3.411 1.305 4.889l-1.092 3.99 4.091-1.074l-.261-.12zm10.222-7.147c-.274-.136-1.615-.797-1.866-.889-.252-.091-.435-.136-.617.137-.182.273-.706.889-.866 1.07-.16.182-.32.205-.594.069-.274-.136-1.157-.426-2.203-1.359-.814-.726-1.363-1.622-1.523-1.895-.16-.273-.017-.421.12-.557.123-.122.274-.319.411-.478.137-.16.182-.273.274-.455.092-.182.046-.341-.023-.478-.069-.136-.617-1.481-.844-2.027-.221-.53-.443-.458-.617-.466l-.525-.006c-.183 0-.479.068-.73.341-.252.273-.959.937-.959 2.285 0 1.348.981 2.651 1.118 2.833.137.182 1.93 2.946 4.676 4.137.653.283 1.164.452 1.562.578.656.208 1.254.179 1.725.109.525-.078 1.615-.659 1.843-1.295.228-.636.228-1.183.16-1.295-.069-.114-.252-.182-.526-.319z"/></svg>
                  </button>

                  {/* Facebook */}
                  <button onClick={() => shareSocial('fb')} className="btn btn-link" style={{ padding: 0 }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </button>

                  {/* X (Twitter) */}
                  <button onClick={() => shareSocial('x')} className="btn btn-link" style={{ padding: 0 }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="#000000"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* SECTION TEXT (PREMIUM & MONEY) - NO BOX */}
        <div style={{ marginTop: '50px' }}>
          <div className="row">
            <div className="col-md-6">
              <h3 style={{ fontWeight: '700', color: '#333' }}>
                <span className="glyphicon glyphicon-star" style={{ color: '#f1c40f' }}></span> Premium Experience
              </h3>
              <p className="text-muted" style={{ lineHeight: '1.8' }}>
                Enjoy a clutter-free experience with our premium redirect service. No unnecessary waiting, just pure speed for your visitors.
              </p>
            </div>
            <div className="col-md-6">
              <h3 style={{ fontWeight: '700', color: '#333' }}>
                <span className="glyphicon glyphicon-stats" style={{ color: '#2ecc71' }}></span> Shorten & Earn Money
              </h3>
              <p className="text-muted" style={{ lineHeight: '1.8' }}>
                Turn your traffic into profit. By using our advanced V2 link tracking and ad integration, you can monetize every single click.
              </p>
            </div>
          </div>
        </div>

        {/* CREATE ACCOUNT AREA DENGAN LINK REFERRAL */}
        <div style={{ marginTop: '80px', marginBottom: '60px' }}>
          <h2 style={{ fontWeight: '800' }}>Ready to get started?</h2>
          <p className="text-muted" style={{ marginBottom: '25px' }}>Join thousands of users and start managing your links professionally today.</p>
          <a 
            href={config.referralLink} 
            target="_blank" 
            className="btn btn-primary btn-lg" 
            style={{ padding: '15px 40px', borderRadius: '50px', fontWeight: 'bold', fontSize: '18px', boxShadow: '0 4px 15px rgba(51, 122, 183, 0.3)' }}
          >
            Create Your Account Now
          </a>
        </div>

      </div>
    </div>
  );
}
