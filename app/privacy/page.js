import { headers } from "next/headers";
import { getSetting } from "@/lib/turso";

export const dynamic = 'force-dynamic';

// 1. GENERATE META TITLE & DESCRIPTION KHUSUS HALAMAN INI
export async function generateMetadata() {
  const siteName = await getSetting("site_name") || "ShortenURL";
  const domainHost = headers().get('host') || 'domain.com';
  const plainDomain = domainHost.replace(/^https?:\/\//, '').replace(/^www\./, '');

  return {
    title: `Privacy Policy - ${siteName}`,
    description: `Privacy Policy document for ${siteName} (${plainDomain}). Learn how we collect, use, and protect your personal information and data.`,
    alternates: {
      canonical: '/privacy',
    }
  };
}

export default async function PrivacyPolicyPage() {
  // 2. AMBIL NAMA SITUS DAN DOMAIN UNTUK TEKS DINAMIS
  const siteName = await getSetting("site_name") || "ShortenURL";
  const headerList = headers();
  const host = headerList.get('host') || 'domain.com';
  const plainDomain = host.replace(/^https?:\/\//, '').replace(/^www\./, '');

  return (
    <div className="container" style={{ marginTop: '50px', marginBottom: '80px', maxWidth: '900px' }}>
      
      {/* HEADER HALAMAN */}
      <div style={{ marginBottom: '40px', borderBottom: '2px solid #eee', paddingBottom: '20px' }}>
        <h1 style={{ fontWeight: '800', color: '#2c3e50', fontSize: '36px' }}>Privacy Policy for {siteName}</h1>
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
          At <strong>{siteName}</strong>, accessible from <strong>{plainDomain}</strong>, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by {siteName} and how we use it.
        </p>
        <p>
          If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
        </p>
        <p>
          This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in {siteName}. This policy is not applicable to any information collected offline or via channels other than this website.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#2c3e50', marginTop: '40px', marginBottom: '15px' }}>1. Consent</h2>
        <p>
          By using our website, you hereby consent to our Privacy Policy and agree to its terms.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#2c3e50', marginTop: '40px', marginBottom: '15px' }}>2. Information We Collect</h2>
        <p>
          The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
        </p>
        <p>
          If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
        </p>
        <p>
          When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#2c3e50', marginTop: '40px', marginBottom: '15px' }}>3. How We Use Your Information</h2>
        <p>We use the information we collect in various ways, including to:</p>
        <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
          <li>Provide, operate, and maintain our website</li>
          <li>Improve, personalize, and expand our website</li>
          <li>Understand and analyze how you use our website</li>
          <li>Develop new products, services, features, and functionality</li>
          <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
          <li>Send you emails</li>
          <li>Find and prevent fraud</li>
        </ul>

        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#2c3e50', marginTop: '40px', marginBottom: '15px' }}>4. Log Files</h2>
        <p>
          {siteName} follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#2c3e50', marginTop: '40px', marginBottom: '15px' }}>5. Cookies and Web Beacons</h2>
        <p>
          Like any other website, {siteName} uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#2c3e50', marginTop: '40px', marginBottom: '15px' }}>6. Advertising Partners Privacy Policies</h2>
        <p>
          You may consult this list to find the Privacy Policy for each of the advertising partners of {siteName}.
        </p>
        <p>
          Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on {siteName}, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
        </p>
        <p>
          Note that {siteName} has no access to or control over these cookies that are used by third-party advertisers.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#2c3e50', marginTop: '40px', marginBottom: '15px' }}>7. Third Party Privacy Policies</h2>
        <p>
          {siteName}'s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
        </p>
        <p>
          You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#2c3e50', marginTop: '40px', marginBottom: '15px' }}>8. CCPA Privacy Rights (Do Not Sell My Personal Information)</h2>
        <p>Under the CCPA, among other rights, California consumers have the right to:</p>
        <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
          <li>Request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.</li>
          <li>Request that a business delete any personal data about the consumer that a business has collected.</li>
          <li>Request that a business that sells a consumer's personal data, not sell the consumer's personal data.</li>
        </ul>
        <p>If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.</p>

        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#2c3e50', marginTop: '40px', marginBottom: '15px' }}>9. GDPR Data Protection Rights</h2>
        <p>We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>
        <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
          <li><strong>The right to access</strong> – You have the right to request copies of your personal data. We may charge you a small fee for this service.</li>
          <li><strong>The right to rectification</strong> – You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete.</li>
          <li><strong>The right to erasure</strong> – You have the right to request that we erase your personal data, under certain conditions.</li>
          <li><strong>The right to restrict processing</strong> – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
          <li><strong>The right to object to processing</strong> – You have the right to object to our processing of your personal data, under certain conditions.</li>
          <li><strong>The right to data portability</strong> – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
        </ul>
        <p>If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.</p>

        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#2c3e50', marginTop: '40px', marginBottom: '15px' }}>10. Children's Information</h2>
        <p>
          Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
        </p>
        <p>
          {siteName} does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#2c3e50', marginTop: '40px', marginBottom: '15px' }}>11. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately, after they are posted on this page.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#2c3e50', marginTop: '40px', marginBottom: '15px' }}>12. Contact Us</h2>
        <p>
          If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at our official email address or via our contact page.
        </p>

      </div>
    </div>
  );
}
