import { turso } from "@/lib/turso";
import { decodeUrl } from "@/lib/encoder";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export const dynamic = 'force-dynamic';

export default async function RedirectPage({ params }) {
  const { id } = params;

  const urlRes = await turso.execute({
    sql: "SELECT target_url, mode, title, image_url, description FROM urls WHERE id = ?",
    args: [id]
  });
  const urlData = urlRes.rows[0];
  if (!urlData) redirect("/");

  const setRes = await turso.execute("SELECT key, value FROM settings");
  const sys = {};
  setRes.rows.forEach(r => sys[r.key] = r.value);

  const headerList = headers();
  const userAgent = headerList.get('user-agent') || '';
  const isInAppBrowser = /FBAN|FBAV|Instagram|Line|TikTok|Twitter|Snapchat/i.test(userAgent);
  
  const target = decodeUrl(urlData.target_url);

  turso.execute({
    sql: "UPDATE urls SET hit_count = hit_count + 1 WHERE id = ?",
    args: [id]
  });

  // JIKA FITUR FORCE EXTERNAL ON & DI DALAM SOSMED
  // Kita pakai sistem Intent untuk panggil popup bawaan OS (Android Chrome)
  if (sys.force_external === "on" && isInAppBrowser) {
    return (
      <script dangerouslySetInnerHTML={{
        __html: `
          // Ambil URL halaman ini tanpa https://
          var currentUrl = window.location.href.replace(/^https?:\\/\\//, '');
          // Trik Intent URI untuk maksa buka Chrome eksternal
          var intentUrl = "intent://" + currentUrl + "#Intent;scheme=https;package=com.android.chrome;end";
          window.location.replace(intentUrl);
        `
      }} />
    );
  }

  // JIKA V1: Redirect Langsung
  if (urlData.mode === "v1") {
    redirect(target);
  }

  // JIKA V2: Safelink & Slot Iklan
  return (
    <div className="redirect-container">
      
      {/* ADS HEAD */}
      {sys.ads_head && <div dangerouslySetInnerHTML={{ __html: sys.ads_head }} />}

      <div className="redirect-card">
        
        {/* ADS BODY */}
        {sys.ads_body && (
          <div style={{ marginBottom: '15px' }} dangerouslySetInnerHTML={{ __html: sys.ads_body }} />
        )}

        {/* ADS MOBILE ONLY */}
        {sys.ads_mobile && (
          <div className="visible-xs" style={{ marginBottom: '15px' }} dangerouslySetInnerHTML={{ __html: sys.ads_mobile }} />
        )}
        
        {/* ADS DESKTOP ONLY */}
        {sys.ads_desktop && (
          <div className="hidden-xs" style={{ marginBottom: '15px' }} dangerouslySetInnerHTML={{ __html: sys.ads_desktop }} />
        )}

        {urlData.image_url && <img src={urlData.image_url} alt={urlData.title} className="redirect-image" />}
        <h1 className="redirect-title">{urlData.title || "Tautan Anda Sudah Siap"}</h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          {urlData.description || "Klik tombol di bawah untuk melanjutkan."}
        </p>
        
        <div id="loader" className="spinner"></div>
        
        <a 
          href={sys.link_offer || target} 
          id="btn-getlink" 
          className="btn-getlink" 
          style={{ display: 'none' }}
          onClick={(e) => {
            if (sys.link_offer) {
               e.preventDefault();
               window.open(sys.link_offer, '_blank');
               window.location.href = target;
            }
          }}
        >
          Kunjungi Tautan (Get Link)
        </a>

        {/* ADS FOOTER */}
        {sys.ads_footer && (
          <div style={{ marginTop: '20px' }} dangerouslySetInnerHTML={{ __html: sys.ads_footer }} />
        )}

        <script dangerouslySetInnerHTML={{
          __html: `
            setTimeout(() => {
              document.getElementById('loader').style.display = 'none';
              document.getElementById('btn-getlink').style.display = 'inline-block';
            }, 3000);
          `
        }} />

      </div>
    </div>
  );
}
