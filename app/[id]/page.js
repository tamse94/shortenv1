import { turso } from "@/lib/turso";
import { decodeUrl } from "@/lib/encoder";
import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import { config } from "@/lib/config";

export const dynamic = 'force-dynamic';

export default async function RedirectPage({ params }) {
  const { id } = params;

  // 1. Ambil data URL
  const urlRes = await turso.execute({
    sql: "SELECT target_url, mode, title, image_url, description FROM urls WHERE id = ?",
    args: [id]
  });
  const urlData = urlRes.rows[0];

  if (!urlData) {
    notFound(); 
  }

  // 2. Ambil Settingan Web
  const setRes = await turso.execute("SELECT key, value FROM settings");
  const sys = {};
  setRes.rows.forEach(r => sys[r.key] = r.value);

  // 3. Tarik Header & Bersihkan Domain (Hanya domain.com tanpa https/www)
  const headerList = headers();
  const userAgent = headerList.get('user-agent') || '';
  const host = headerList.get('host') || 'domain.com';
  const plainDomain = host.replace(/^https?:\/\//, '').replace(/^www\./, '');

  const isInAppBrowser = /FBAN|FBAV|Instagram|Line|TikTok|Twitter|Snapchat/i.test(userAgent);
  const target = decodeUrl(urlData.target_url);

  // 4. Tambah Hit Counter
  turso.execute({
    sql: "UPDATE urls SET hit_count = hit_count + 1 WHERE id = ?",
    args: [id]
  });

  // 5. Anti In-App Browser (Buka otomatis di Chrome asli)
  if (sys.force_external === "on" && isInAppBrowser) {
    return (
      <script dangerouslySetInnerHTML={{
        __html: `
          var currentUrl = window.location.href.replace(/^https?:\\/\\//, '');
          var intentUrl = "intent://" + currentUrl + "#Intent;scheme=https;package=com.android.chrome;end";
          window.location.replace(intentUrl);
        `
      }} />
    );
  }

  // 6. Kalau Mode V1, langsung terbang
  if (urlData.mode === "v1") {
    redirect(target);
  }

  // 7. Kalau Mode V2, Tampilkan Landing Page HTML Lo
  return (
    <>
      {/* TRIK AJAIB: Matikan Navbar & Footer bawaan dari layout.js khusus di halaman ini */}
      <style dangerouslySetInnerHTML={{ __html: `
        nav.navbar.navbar-default, footer:not(.footer-custom) { display: none !important; }
        body { padding-top: 0 !important; background-color: #f5f6fa; }
        .container { margin-top: 0 !important; width: 100% !important; padding: 0 !important; }
      `}} />

      {/* Panggil File CSS Custom lo */}
      <link rel="stylesheet" href="/redirect.css" />
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

      {/* NAVBAR CUSTOM V2 */}
      <nav className="navbar-custom clearfix">
        <a href="/" className="navbar-brand-custom">
          {sys.site_name || "ShortenURL"}
        </a>
        <a href={config.referralLink} target="_blank" rel="noopener noreferrer">
          <button className="btn btn-payout">Payout Rates</button>
        </a>
      </nav>

      {/* MAIN KONTEN */}
      <div className="main-container">
        <div className="card-wrapper">
          <div className="redirect-card">

            {/* Area Iklan Atas Judul */}
            {sys.ads_body && <div style={{ marginBottom: '15px' }} dangerouslySetInnerHTML={{ __html: sys.ads_body }} />}
            
            {urlData.image_url && (
              <div className="area-image-container">
                <img src={urlData.image_url} alt="Content Image" className="area-image" />
              </div>
            )}
            
            <h2 className="title-page">{urlData.title || "Tautan Anda Sedang Disiapkan"}</h2>
            
            <hr className="separator" />
            
            {/* STEP 1: Tombol Lanjut Pertama */}
            <div id="step-1">
              <h3 className="skip-title">How Can I Skip This Page?</h3>
              <div className="text-fallback">
                <a href={config.referralLink}>click here</a><br/>
                if the process does not start automatically
              </div>
              <button id="btn-hw" className="btn btn-continue">Click here to continue</button>
            </div>

            {/* STEP 2: Timer & Iklan */}
            <div id="step-2" style={{ display: 'none' }}>
              <div className="ad-slot-box">
                <span></span>
                {/* Sisipkan Iklan Berdasarkan Perangkat */}
                {sys.ads_mobile && <div className="visible-xs" dangerouslySetInnerHTML={{ __html: sys.ads_mobile }} />}
                {sys.ads_desktop && <div className="hidden-xs" dangerouslySetInnerHTML={{ __html: sys.ads_desktop }} />}
              </div>

              <div id="timer-wrapper">
                <div className="timer-circle">
                  <span id="timer-count">10</span>
                </div>
                <div className="text-fallback">Please wait...</div>
              </div>

              <div id="get-link-wrapper" style={{ display: 'none' }}>
                <h3 className="skip-title">Your link is ready.</h3>
                <button id="btn-gl" className="btn btn-get-link">Get Link</button>
              </div>
            </div>

          </div>
        </div>

        {/* INFO WRAPPER */}
        <div className="info-wrapper">
          <div className="info-section">
            <h3>What is {plainDomain}?</h3>
            <p>{plainDomain} is a free tool where you can create short links and get paid! Make money from home while managing and protecting your links. <a href={config.referralLink} target="_blank" rel="noopener noreferrer">Register now!</a></p>

            <h3>How Can I Skip This Page?</h3>
            <p>Complete the process, follow the on-screen instructions and click the continue button to proceed to your destination.</p>

            <h3>Shorten URLs and earn money</h3>
            <p>Signup for an account in just 2 minutes. Start creating short URLs and sharing them with your family and friends to begin earning.</p>
          </div>
        </div>
      </div>

      {/* FOOTER CUSTOM V2 */}
      <footer className="footer-custom">
        <div className="footer-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of use</a>
          <a href="/dmca">DMCA</a>
        </div>
        <p className="footer-copyright">Copyright &copy; {plainDomain} {new Date().getFullYear()}</p>
        <button id="btn-scroll" className="btn-scroll-top">
          <i className="material-icons">arrow_upward</i>
        </button>
      </footer>

      {/* Iklan Footer */}
      {sys.ads_footer && <div dangerouslySetInnerHTML={{ __html: sys.ads_footer }} />}

      {/* SCRIPT LOGIKA _HW DAN _GL */}
      <script dangerouslySetInnerHTML={{
        __html: `
          // Eksekusi fungsi saat _HW diklik
          function _HW() {
              document.getElementById('step-1').style.display = 'none';
              document.getElementById('step-2').style.display = 'block';
              
              var timeLeft = 10;
              var timerElem = document.getElementById('timer-count');
              
              var countdown = setInterval(function() {
                  timeLeft--;
                  timerElem.textContent = timeLeft;
                  
                  if (timeLeft <= 0) {
                      clearInterval(countdown);
                      document.getElementById('timer-wrapper').style.display = 'none';
                      document.getElementById('get-link-wrapper').style.display = 'block';
                  }
              }, 1000);
          }

          // Eksekusi fungsi saat Get Link (_GL) diklik
          function _GL() {
              var targetUrl = "${target}";
              var offerUrl = "${sys.link_offer || ''}";

              // Buka offer di tab baru (kalau ada)
              if (offerUrl !== '') {
                  window.open(offerUrl, '_blank');
              }
              // Tab ini meluncur ke link tujuan aslinya
              window.location.href = targetUrl;
          }

          // Daftarkan event listener (wajib biar Next.js nggak error)
          document.getElementById('btn-hw').addEventListener('click', _HW);
          document.getElementById('btn-gl').addEventListener('click', _GL);
          document.getElementById('btn-scroll').addEventListener('click', function() { window.scrollTo(0,0); });
        `
      }} />
    </>
  );
}
