"use client";
export default function Footer({ siteName }) {
  const year = new Date().getFullYear();

  return (
    <footer style={{ marginTop: '50px', padding: '20px 0', borderTop: '1px solid #e7e7e7', color: '#777' }}>
      <div className="container text-center">
        <p>&copy; {year} <strong>{siteName || "ShortenURL"}</strong>. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
