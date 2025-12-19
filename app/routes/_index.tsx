import { useEffect, useState } from "react";
import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [
    { title: "Voidium - Free Discord Bot Hosting" },
    { name: "description", content: "Free Discord bot hosting with 24/7 uptime, powerful specs, and community support. Host your bots online for free with Voidium!" },
    { name: "og:title", content: "Voidium - Free Discord Bot Hosting" },
    { name: "og:description", content: "Free Discord bot hosting with 24/7 uptime, powerful specs, and community support. Host your bots online for free!" },
    { name: "og:image", content: "https://olibot1107.github.io/Oli-cdn/cdn/Untitled-1.png" },
    { name: "og:url", content: "https://vapp.uk" },
    { name: "og:type", content: "website" },
    { name: "og:site_name", content: "Voidium Hosting" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Voidium - Free Discord Bot Hosting" },
    { name: "twitter:description", content: "Free Discord bot hosting with 24/7 uptime, powerful specs, and community support. Host your bots online for free!" },
    { name: "twitter:image", content: "https://olibot1107.github.io/Oli-cdn/cdn/Untitled-1.png" }
  ];
};

export default function Index() {
  const [timeString, setTimeString] = useState("");

  useEffect(() => {
    function updateCounter() {
      // Target Date: Sunday, 7 September 2025 20:26:00
      const start = new Date(2025, 8, 7, 20, 26, 0); // Month is 0-indexed (8 = September)
      const now = new Date();

      let years = now.getFullYear() - start.getFullYear();
      let months = now.getMonth() - start.getMonth();
      let days = now.getDate() - start.getDate();
      let hours = now.getHours() - start.getHours();
      let minutes = now.getMinutes() - start.getMinutes();
      let seconds = now.getSeconds() - start.getSeconds();

      // Adjust for negative values (borrowing from larger units)
      if (seconds < 0) { seconds += 60; minutes--; }
      if (minutes < 0) { minutes += 60; hours--; }
      if (hours < 0) { hours += 24; days--; }
      if (days < 0) {
        // Get days in the previous month to borrow correctly
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        days += prevMonth;
        months--;
      }
      if (months < 0) { months += 12; years--; }

      setTimeString(`${years} years, ${months} months, ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`);
    }

    // Run once and then update every 10 seconds (less frequent updates)
    updateCounter();
    const interval = setInterval(updateCounter, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      fontFamily: '"Space Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#fef7ed',
      color: '#1a1a1a',
      lineHeight: '1.6',
      padding: '20px',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: '900',
          textShadow: '4px 4px 0px #fb923c',
          marginBottom: '2rem',
          textTransform: 'uppercase',
          letterSpacing: '-0.02em'
        }}>
          Oh Hi!
        </h1>

        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem', lineHeight: '1.6' }}>
            Hey! We're <strong>Voidium</strong>, your go-to for free Discord bot hosting. We've been keeping bots online for <strong>{timeString}</strong>.
          </p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            <div style={{
              border: '4px solid #1a1a1a',
              background: 'white',
              padding: '1.5rem',
              boxShadow: '8px 8px 0px #fb923c',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="10" r="1" fill="#fb923c"/>
                  <circle cx="15" cy="10" r="1" fill="#fb923c"/>
                  <path d="M9 14h6" stroke="#fb923c" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '0.5rem' }}>Discord Bot Hosting</h4>
              <p style={{ fontSize: '0.9rem' }}>24/7 uptime for your Discord bots. We handle the infrastructure so you can focus on coding.</p>
            </div>

            <div style={{
              border: '4px solid #1a1a1a',
              background: 'white',
              padding: '1.5rem',
              boxShadow: '8px 8px 0px #fb923c',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#fb923c" strokeWidth="2"/>
                  <path d="M9 12l2 2 4-4" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '0.5rem' }}>100% Free</h4>
              <p style={{ fontSize: '0.9rem' }}>Zero hidden costs. Just free hosting for everyone.</p>
            </div>

            <div style={{
              border: '4px solid #1a1a1a',
              background: 'white',
              padding: '1.5rem',
              boxShadow: '8px 8px 0px #fb923c',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 11H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3m7-10h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3m-7-10V5a2 2 0 0 0 2 2h3M7 16V9a2 2 0 0 1 2-2h3" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '0.5rem' }}>Community Support</h4>
              <p style={{ fontSize: '0.9rem' }}>Join our Discord for help and to connect with other bot developers.</p>
            </div>
          </div>
        </div>

        <div style={{
          border: '4px solid #1a1a1a',
          background: '#dcfce7',
          padding: '1.5rem',
          boxShadow: '8px 8px 0px #22c55e',
          marginBottom: '2rem'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '900',
            marginBottom: '1rem',
            color: '#166534',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Getting Started
          </h3>
          <p style={{ marginBottom: '1rem', color: '#166534' }}>
            Ready to host your bot? It's simple:
          </p>
          <ol style={{ paddingLeft: '1.5rem', color: '#166534' }}>
            <li style={{ marginBottom: '0.5rem' }}>Join our Discord server</li>
            <li style={{ marginBottom: '0.5rem' }}>Create your account</li>
            <li style={{ marginBottom: '0.5rem' }}>Create a server</li>
            <li style={{ marginBottom: '0.5rem' }}>Login on the dashboard</li>
            <li style={{ marginBottom: '0.5rem' }}>Upload your bot files</li>
            <li>Start your bot and go live!</li>
          </ol>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="https://hosting.voidium.uk" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <button
              style={{
                background: '#fb923c',
                color: '#1a1a1a',
                border: '4px solid #1a1a1a',
                padding: '1rem 2rem',
                fontWeight: '900',
                fontSize: '1.1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                boxShadow: '8px 8px 0px #1a1a1a',
                transition: 'all 0.1s ease',
                borderRadius: '0'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.transform = 'translate(-2px, -2px)';
                (e.target as HTMLElement).style.boxShadow = '12px 12px 0px #1a1a1a';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.transform = 'translate(0px, 0px)';
                (e.target as HTMLElement).style.boxShadow = '8px 8px 0px #1a1a1a';
              }}
              onMouseDown={(e) => {
                (e.target as HTMLElement).style.transform = 'translate(2px, 2px)';
                (e.target as HTMLElement).style.boxShadow = '4px 4px 0px #1a1a1a';
              }}
              onMouseUp={(e) => {
                (e.target as HTMLElement).style.transform = 'translate(-2px, -2px)';
                (e.target as HTMLElement).style.boxShadow = '12px 12px 0px #1a1a1a';
              }}
            >
              Go to hosting.voidium.uk
            </button>
          </a>

          <a href="https://discord.gg/E2Kywq9Uk5" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <button
              style={{
                background: '#5865f2',
                color: '#1a1a1a',
                border: '4px solid #1a1a1a',
                padding: '1rem 2rem',
                fontWeight: '900',
                fontSize: '1.1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                boxShadow: '8px 8px 0px #1a1a1a',
                transition: 'all 0.1s ease',
                borderRadius: '0'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.transform = 'translate(-2px, -2px)';
                (e.target as HTMLElement).style.boxShadow = '12px 12px 0px #1a1a1a';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.transform = 'translate(0px, 0px)';
                (e.target as HTMLElement).style.boxShadow = '8px 8px 0px #1a1a1a';
              }}
              onMouseDown={(e) => {
                (e.target as HTMLElement).style.transform = 'translate(2px, 2px)';
                (e.target as HTMLElement).style.boxShadow = '4px 4px 0px #1a1a1a';
              }}
              onMouseUp={(e) => {
                (e.target as HTMLElement).style.transform = 'translate(-2px, -2px)';
                (e.target as HTMLElement).style.boxShadow = '12px 12px 0px #1a1a1a';
              }}
            >
              Join Discord
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
