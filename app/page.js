"use client";
import { useState, useEffect } from "react";
import { config } from "@/lib/config";

export default function HomePage() {
  const [targetUrl, setTargetUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [siteName, setSiteName] = useState("ShortenURL"); 
  const [copyStatus, setCopyStatus] = useState("Copy");

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
        body: JSON.stringify({ id, target_url: targetUrl, mode: "v1" }),
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
    const text = `Cek tautan ini: ${shortUrl}`;
    const url = encodeURIComponent(shortUrl);
    const platforms = {
      wa: `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`,
      fb: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      x: `https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(text)}`
    };
    window.open(platforms[platform], "_blank");
  };

  return (
    <div style={{ overflowX: 'hidden' }}>
      
      {/* 1. HERO SECTION */}
      <div className="row text-center" style={{ paddingTop: '50px', paddingBottom: '30px' }}>
        <div className="col-md-10 col-md-offset-1">
          <h1 style={{ fontWeight: '800', fontSize: '42px', color: '#2c3e50', marginBottom: '15px', letterSpacing: '-0.5px' }}>
            {siteName}
          </h1>
          <p className="text-muted" style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            The most advanced and reliable URL shortener. Simplify your links, track your audience, and expand your reach instantly.
          </p>
        </div>
      </div>

      {/* 2. MAIN SHORTEN BOX (Dibatasi lebarnya biar elegan) */}
      <div className="row">
        {/* Di HP dikasih offset kecil, di PC ada di tengah. Ini kunci biar gak nempel layar! */}
        <div className="col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-12">
          
          <div className="panel panel-default" style={{ 
            borderRadius: '12px', 
            boxShadow: '0 8px 30px rgba(0,0,0,0.06)', 
            border: '1px solid #e3e8ee',
            margin: '0 10px 40px 10px' // Margin pengaman tambahan buat HP
          }}>
            <div className="panel-body" style={{ padding: '40px 25px' }}>
              
              {!shortUrl ? (
                /* STATE 1: FORM INPUT */
                <form onSubmit={handleShorten}>
                  <div className="input-group input-group-lg" style={{ width: '100%' }}>
                    <input 
                      type="url" 
                      className="form-control" 
                      placeholder="Paste your long URL here..." 
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      required
                      style={{ borderRadius: '8px 0 0 8px', border: '2px solid #e3e8ee', borderRight: 'none', boxShadow: 'none', height: '54px', fontSize: '16px' }}
                    />
                    <span className="input-group-btn">
                      <button className="btn btn-primary" type="submit" disabled={loading} style={{ height: '54px', paddingLeft: '30px', paddingRight: '30px', borderRadius: '0 8px 8px 0', fontWeight: 'bold', fontSize: '16px' }}>
                        {loading ? (
                          <span><span className="glyphicon glyphicon-refresh" style={{ animation: 'spin 2s linear infinite' }}></span> Processing...</span>
                        ) : "Shorten URL"}
                      </button>
                    </span>
                  </div>
                </form>
              ) : (
                /* STATE 2: RESULT & SHARE */
                <div className="animate-fade-in text-center">
                  <h4 style={{ color: '#2ecc71', fontWeight: 'bold', marginBottom: '20px' }}>
                    <span className="glyphicon glyphicon-ok-circle"></span> Your link is ready!
                  </h4>
                  
                  <div className="input-group input-group-lg" style={{ width: '100%', marginBottom: '25px' }}>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={shortUrl} 
                      readOnly 
                      style={{ backgroundColor: '#f8f9fa', borderRadius: '8px 0 0 8px', border: '2px solid #e3e8ee', height: '54px', color: '#337ab7', fontWeight: 'bold' }} 
                    />
                    <span className="input-group-btn">
                      <button className="btn btn-primary" style={{ height: '54px', fontWeight: 'bold' }} onClick={() => {
                        navigator.clipboard.writeText(shortUrl);
                        setCopyStatus("Copied!");
                        setTimeout(() => setCopyStatus("Copy"), 2000);
                      }}>
                        <span className="glyphicon glyphicon-copy"></span> {copyStatus}
                      </button>
                      <button className="btn btn-default" style={{ height: '54px', border: '2px solid #e3e8ee', borderLeft: 'none' }} onClick={() => { setShortUrl(""); setTargetUrl(""); }} title="Shorten another URL">
                        <span className="glyphicon glyphicon-repeat"></span>
                      </button>
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', alignItems: 'center', padding: '10px 0' }}>
                    <span className="text-muted" style={{ fontWeight: 'bold' }}>Share on:</span>
                    
                    <button onClick={() => shareSocial('wa')} className="btn btn-link" style={{ padding: 0, transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="#25D366"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.464c1.589.943 3.131 1.417 4.757 1.418 5.4 0 9.794-4.393 9.797-9.794.001-2.618-1.019-5.08-2.87-6.932-1.851-1.852-4.311-2.872-6.93-2.872-5.4 0-9.794 4.394-9.797 9.795 0 1.724.451 3.411 1.305 4.889l-1.092 3.99 4.091-1.074l-.261-.12zm10.222-7.147c-.274-.136-1.615-.797-1.866-.889-.252-.091-.435-.136-.617.137-.182.273-.706.889-.866 1.07-.16.182-.32.205-.594.069-.274-.136-1.157-.426-2.203-1.359-.814-.726-1.363-1.622-1.523-1.895-.16-.273-.017-.421.12-.557.123-.122.274-.319.411-.478.137-.16.182-.273.274-.455.092-.182.046-.341-.023-.478-.069-.136-.617-1.481-.844-2.027-.221-.53-.443-.458-.617-.466l-.525-.006c-.183 0-.479.068-.73.341-.252.273-.959.937-.959 2.285 0 1.348.981 2.651 1.118 2.833.137.182 1.93 2.946 4.676 4.137.653.283 1.164.452 1.562.578.656.208 1.254.179 1.725.109.525-.078 1.615-.659 1.843-1.295.228-.636.228-1.183.16-1.295-.069-.114-.252-.182-.526-.319z"/></svg>
                    </button>
                    <button onClick={() => shareSocial('fb')} className="btn btn-link" style={{ padding: 0, transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </button>
                    <button onClick={() => shareSocial('x')} className="btn btn-link" style={{ padding: 0, transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="#000000"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      {/* 3. FITUR LENGKAP UNTUK MEYAKINKAN PENGUNJUNG (3 KOLOM) */}
      <div className="row text-center" style={{ marginTop: '30px', padding: '0 15px' }}>
        <div className="col-md-4 col-sm-4">
          <div style={{ padding: '20px' }}>
            <span className="glyphicon glyphicon-flash" style={{ fontSize: '40px', color: '#f39c12', marginBottom: '15px' }}></span>
            <h4 style={{ fontWeight: '700', color: '#2c3e50' }}>Lightning Fast</h4>
            <p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.6' }}>
              Experience zero-latency routing. We process redirects instantly so your visitors never have to wait.
            </p>
          </div>
        </div>
        <div className="col-md-4 col-sm-4">
          <div style={{ padding: '20px' }}>
            <span className="glyphicon glyphicon-piggy-bank" style={{ fontSize: '40px', color: '#2ecc71', marginBottom: '15px' }}></span>
            <h4 style={{ fontWeight: '700', color: '#2c3e50' }}>Monetize Traffic</h4>
            <p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.6' }}>
              Turn your links into profit. Integrate your custom ad networks smoothly with our advanced features.
            </p>
          </div>
        </div>
        <div className="col-md-4 col-sm-4">
          <div style={{ padding: '20px' }}>
            <span className="glyphicon glyphicon-stats" style={{ fontSize: '40px', color: '#3498db', marginBottom: '15px' }}></span>
            <h4 style={{ fontWeight: '700', color: '#2c3e50' }}>Track Performance</h4>
            <p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.6' }}>
              Get detailed insights on every click. Know exactly how your campaigns are performing in real-time.
            </p>
          </div>
        </div>
      </div>

      {/* 4. CALL TO ACTION (LINK REFERRAL CONFIG) */}
      <div className="row text-center" style={{ marginTop: '50px', marginBottom: '70px', padding: '40px 15px', backgroundColor: '#fff', borderTop: '1px solid #e7e7e7', borderBottom: '1px solid #e7e7e7' }}>
        <div className="col-md-12">
          <h2 style={{ fontWeight: '800', color: '#2c3e50', marginBottom: '15px' }}>Ready to elevate your links?</h2>
          <p className="text-muted" style={{ fontSize: '16px', marginBottom: '30px', maxWidth: '500px', margin: '0 auto 30px auto' }}>
            Join thousands of professionals who trust our platform for managing and monetizing their URLs.
          </p>
          <a 
            href={config.referralLink} 
            target="_blank" 
            className="btn btn-primary btn-lg" 
            style={{ 
              padding: '16px 45px', 
              borderRadius: '50px', 
              fontWeight: '700', 
              fontSize: '18px', 
              boxShadow: '0 4px 15px rgba(51, 122, 183, 0.4)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            Create Free Account
          </a>
        </div>
      </div>

    </div>
  );
}
