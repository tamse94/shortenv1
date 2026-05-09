import { headers } from "next/headers";
import { getSetting } from "@/lib/turso";

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const siteName = await getSetting("site_name") || "ShortenURL";
  const domainHost = headers().get('host') || 'domain.com';
  const plainDomain = domainHost.replace(/^https?:\/\//, '').replace(/^www\./, '');

  return {
    title: `Privacy Policy - ${siteName}`,
    description: `Comprehensive Privacy Policy document for ${siteName} (${plainDomain}). Learn how we collect, use, process, and protect your personal data in compliance with global standards.`,
    alternates: { canonical: '/privacy' }
  };
}

export default async function PrivacyPolicyPage() {
  const siteName = await getSetting("site_name") || "ShortenURL";
  const headerList = headers();
  const host = headerList.get('host') || 'domain.com';
  const plainDomain = host.replace(/^https?:\/\//, '').replace(/^www\./, '');

  return (
    <div className="container">
      <div className="legal-wrapper">
        <div className="legal-header">
          <h1>Privacy Policy</h1>
          <p className="legal-date">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="legal-content">
          <p>
            At <strong>{siteName}</strong>, accessible from <strong>{plainDomain}</strong>, one of our main priorities is the privacy of our visitors. This comprehensive Privacy Policy document contains detailed types of information that is collected and recorded by {siteName} and exactly how we use, process, and share it. This policy has been compiled to better serve those who are concerned with how their 'Personally Identifiable Information' (PII) is being used online.
          </p>
          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us. This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in {siteName}.
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            We collect several different types of information for various purposes to provide and improve our Service to you. The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
          </p>
          <ul>
            <li><strong>Personal Data:</strong> When you register for an account, we may ask for your contact information, including items such as name, email address, address, and payment details for payout purposes.</li>
            <li><strong>Usage Data:</strong> We may also collect information on how the Service is accessed and used. This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</li>
          </ul>

          <h2>2. Use of Your Information</h2>
          <p>We use the information we collect in various ways, including to:</p>
          <ul>
            <li>Provide, operate, and maintain our website infrastructure securely.</li>
            <li>Improve, personalize, and expand our website features and user experience.</li>
            <li>Understand and analyze how you use our website to create better tools.</li>
            <li>Process transactions and send related information, including payout confirmations.</li>
            <li>Send you administrative emails, updates, security alerts, and support messages.</li>
            <li>Find and prevent fraud, spam, and abuse of our URL shortening services.</li>
          </ul>

          <h2>3. Log Files and Tracking</h2>
          <p>
            {siteName} follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
          </p>

          <h2>4. Google DoubleClick DART Cookie & Advertising</h2>
          <p>
            Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to {plainDomain} and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">https://policies.google.com/technologies/ads</a>.
          </p>
          <p>
            Some of advertisers on our site may use cookies and web beacons. Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on {siteName}, which are sent directly to users' browser. They automatically receive your IP address when this occurs.
          </p>

          <h2>5. GDPR Data Protection Rights</h2>
          <p>We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>
          <ul>
            <li><strong>The right to access:</strong> You have the right to request copies of your personal data.</li>
            <li><strong>The right to rectification:</strong> You have the right to request that we correct any information you believe is inaccurate.</li>
            <li><strong>The right to erasure:</strong> You have the right to request that we erase your personal data, under certain conditions.</li>
            <li><strong>The right to restrict processing:</strong> You have the right to request that we restrict the processing of your personal data.</li>
          </ul>

          <h2>6. CCPA Privacy Rights</h2>
          <p>Under the CCPA, among other rights, California consumers have the right to request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers. You also have the right to request the deletion of your data and opt-out of the sale of personal information.</p>

          <h2>7. Children's Information</h2>
          <p>
            Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. {siteName} does not knowingly collect any Personal Identifiable Information from children under the age of 13.
          </p>
        </div>
      </div>
    </div>
  );
}
