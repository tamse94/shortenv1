import { headers } from "next/headers";
import { getSetting } from "@/lib/turso";

export const dynamic = 'force-dynamic';

// 1. GENERATE META TITLE & DESCRIPTION
export async function generateMetadata() {
  const siteName = await getSetting("site_name") || "ShortenURL";
  const domainHost = headers().get('host') || 'domain.com';
  const plainDomain = domainHost.replace(/^https?:\/\//, '').replace(/^www\./, '');

  return {
    title: `Terms of Use - ${siteName}`,
    description: `Read the Terms of Use for ${siteName} (${plainDomain}). These terms govern your use of our URL shortening services and website.`,
    alternates: {
      canonical: '/terms',
    }
  };
}

export default async function TermsOfUsePage() {
  // 2. AMBIL DATA NAMA SITUS DAN DOMAIN
  const siteName = await getSetting("site_name") || "ShortenURL";
  const headerList = headers();
  const host = headerList.get('host') || 'domain.com';
  const plainDomain = host.replace(/^https?:\/\//, '').replace(/^www\./, '');

  return (
    <div className="container" style={{ marginTop: '50px', marginBottom: '80px', maxWidth: '900px' }}>
      
      {/* HEADER HALAMAN */}
      <div style={{ marginBottom: '40px', borderBottom: '2px solid #eee', paddingBottom: '20px' }}>
        <h1 style={{ fontWeight: '800', color: '#2c3e50', fontSize: '36px' }}>Terms of Use</h1>
        <p className="text-muted" style={{ fontSize: '15px' }}>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* KONTEN TEKS RAPIH (TANPA BOX) */}
      <div style={{ 
        fontSize: '16px', 
        lineHeight: '1.8', 
        color: '#444',
        textAlign: 'justify'
      }}>
        <p>
          Welcome to <strong>{siteName}</strong>. These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and {siteName} ("we," "us" or "our"), concerning your access to and use of the <strong>{plainDomain}</strong> website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.
        </p>
        <p>
          You agree that by accessing the website, you have read, understood, and agree to be bound by all of these Terms of Use. If you do not agree with all of these Terms of Use, then you are expressly prohibited from using the website and you must discontinue use immediately.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#2c3e50', marginTop: '40px', marginBottom: '15px' }}>1. URL Shortening Services</h2>
        <p>
          {siteName} provides a service that allows users to create shortened URLs from longer links. By using our service, you agree not to use our URL shortening tools for any malicious, illegal, or harmful purposes. We reserve the right to disable, delete, or redirect any shortened URL created through our platform if it violates these Terms of Use.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#2c3e50', marginTop: '40px', marginBottom: '15px' }}>2. Prohibited Activities</h2>
        <p>You may not access or use the website for any purpose other than that for which we make the website available. As a user of the website, you agree not to create short links that redirect to or contain:</p>
        <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
          <li>Viruses, malware, trojans, or any other destructive material.</li>
          <li>Phishing websites or pages designed to steal personal information.</li>
          <li>Child pornography or any illegal sexually explicit content.</li>
          <li>Content that infringes upon the intellectual property rights of others.</li>
          <li>Terrorist material, hate speech, or content promoting violence.</li>
          <li>Spam, automated scripts, or manipulative traffic generation systems.</li>
        </ul>
        <p>If we discover that your links are associated with any of the prohibited activities above, your account will be terminated immediately, all links will be deleted, and your earnings (if applicable) will be forfeited without notice.</p>

        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#2c3e50', marginTop: '40px', marginBottom: '15px' }}>3. User Registration</h2>
        <p>
          You may be required to register with the website to access certain features. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#2c3e50', marginTop: '40px', marginBottom: '15px' }}>4. Intellectual Property Rights</h2>
        <p>
          Unless otherwise indicated, the website is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the website (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#2c3e50', marginTop: '40px', marginBottom: '15px' }}>5. Site Management & Modification</h2>
        <p>We reserve the right, but not the obligation, to:</p>
        <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
          <li>Monitor the website for violations of these Terms of Use.</li>
          <li>Take appropriate legal action against anyone who, in our sole discretion, violates the law or these Terms of Use.</li>
          <li>Refuse, restrict access to, limit the availability of, or disable (to the extent technologically feasible) any of your Contributions or any portion thereof.</li>
          <li>Modify, suspend, or discontinue the website or our services at any time, for any reason, without notice to you.</li>
        </ul>
        <p>We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the website.</p>

        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#2c3e50', marginTop: '40px', marginBottom: '15px' }}>6. Earnings and Payments (If Applicable)</h2>
        <p>
          If {siteName} provides a monetization program, payments will be processed according to the payout schedule and minimum withdrawal thresholds published on our website. We analyze all traffic carefully. Any attempt to artificially inflate your statistics, use proxy traffic, VPNs, botnets, or click-exchange programs will result in immediate account termination and forfeiture of all pending balances.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#2c3e50', marginTop: '40px', marginBottom: '15px' }}>7. Disclaimer</h2>
        <p>
          The website is provided on an as-is and as-available basis. You agree that your use of the website and our services will be at your sole risk. To the fullest extent permitted by law, we disclaim all warranties, express or implied, in connection with the website and your use thereof, including, without limitation, the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#2c3e50', marginTop: '40px', marginBottom: '15px' }}>8. Limitations of Liability</h2>
        <p>
          In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the website, even if we have been advised of the possibility of such damages.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#2c3e50', marginTop: '40px', marginBottom: '15px' }}>9. Governing Law</h2>
        <p>
          These Terms of Use and your use of the website are governed by and construed in accordance with the laws of the jurisdiction in which {siteName} operates, without regard to its conflict of law principles.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#2c3e50', marginTop: '40px', marginBottom: '15px' }}>10. Contact Us</h2>
        <p>
          In order to resolve a complaint regarding the website or to receive further information regarding use of the website, please contact us via our official contact page.
        </p>

      </div>
    </div>
  );
}
