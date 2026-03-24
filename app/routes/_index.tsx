import { useEffect, useState } from "react";
import { Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = ({ matches }) => {
  const rootData = matches.find((match) => match.id === "root")?.data as
    | { origin?: unknown }
    | undefined;
  const origin = typeof rootData?.origin === "string" ? rootData.origin : "https://voidium.uk";
  const ogImage = `${origin}/og.png`;
  const ogIcon = `${origin}/icon.png`;
  return [
    { title: "Voidium - Free Discord Bot Hosting" },
    { name: "description", content: "Free Discord bot hosting with 24/7 uptime, powerful specs, and community support. Host your bots online for free with Voidium!" },
    { property: "og:title", content: "Voidium - Free Discord Bot Hosting" },
    { property: "og:description", content: "Free Discord bot hosting with 24/7 uptime, powerful specs, and community support. Host your bots online for free!" },
    { property: "og:image", content: ogImage },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: "Voidium Hosting" },
    { property: "og:image", content: ogIcon },
    { property: "og:image:width", content: "512" },
    { property: "og:image:height", content: "512" },
    { property: "og:url", content: `${origin}/` },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Voidium Hosting" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Voidium - Free Discord Bot Hosting" },
    { name: "twitter:description", content: "Free Discord bot hosting with 24/7 uptime, powerful specs, and community support. Host your bots online for free!" },
    { name: "twitter:image", content: ogImage },
    { name: "twitter:image:alt", content: "Voidium Hosting" }
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

        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            border: '4px solid #1a1a1a',
            background: 'white',
            padding: '1.25rem 1.5rem',
            boxShadow: '8px 8px 0px #fb923c',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '1.25rem',
              fontWeight: '900',
              margin: 0,
              lineHeight: '1.4',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em'
            }}>
              Hey we are voidium a hosting comapny that is fully free we have been doing this for{" "}
              <span style={{
                background: '#fb923c',
                padding: '0.15rem 0.35rem',
                border: '3px solid #1a1a1a',
                boxShadow: '4px 4px 0px #1a1a1a',
                display: 'inline-block'
              }}>
                {timeString}
              </span>
            </p>
          </div>
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
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          alignItems: 'stretch'
        }}>
          <Link to="/docs" style={{ textDecoration: 'none' }}>
            <button
              style={{
                background: 'white',
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
                borderRadius: '0',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '68px'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translate(-2px, -2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '12px 12px 0px #1a1a1a';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translate(0px, 0px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '8px 8px 0px #1a1a1a';
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translate(2px, 2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '4px 4px 0px #1a1a1a';
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translate(-2px, -2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '12px 12px 0px #1a1a1a';
              }}
            >
              Docs
            </button>
          </Link>

          <a href="https://panel.voidium.uk" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
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
                borderRadius: '0',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '68px'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translate(-2px, -2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '12px 12px 0px #1a1a1a';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translate(0px, 0px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '8px 8px 0px #1a1a1a';
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translate(2px, 2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '4px 4px 0px #1a1a1a';
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translate(-2px, -2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '12px 12px 0px #1a1a1a';
              }}
            >
              Panel
            </button>
          </a>

          <a href="/status" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <button
              style={{
                background: '#0ea5e9',
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
                borderRadius: '0',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '68px'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translate(-2px, -2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '12px 12px 0px #1a1a1a';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translate(0px, 0px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '8px 8px 0px #1a1a1a';
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translate(2px, 2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '4px 4px 0px #1a1a1a';
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translate(-2px, -2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '12px 12px 0px #1a1a1a';
              }}
            >
              Status
            </button>
          </a>

          <a href="https://discord.gg/8cdxBEXnbS" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
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
                borderRadius: '0',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '68px'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translate(-2px, -2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '12px 12px 0px #1a1a1a';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translate(0px, 0px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '8px 8px 0px #1a1a1a';
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translate(2px, 2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '4px 4px 0px #1a1a1a';
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translate(-2px, -2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '12px 12px 0px #1a1a1a';
              }}
            >
              Discord
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
