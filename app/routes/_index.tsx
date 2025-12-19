import { useEffect, useState } from "react";

export default function Index() {
  const [timeString, setTimeString] = useState("");

  useEffect(() => {
    function updateCounter() {
      const domain = window.location.hostname;
      if (domain === "vapp.uk") {
        window.location.href = "https://vapp.uk";
      }

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
          Welcome!
        </h1>

        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
          Voidium specializes in <strong>Discord bot hosting</strong> and has been providing reliable hosting for <strong>{timeString}</strong>. We keep your bots online 24/7 so you can focus on coding amazing features. Join our Discord to create your account and get started!
        </p>

        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '900',
            textShadow: '3px 3px 0px #fb923c',
            marginBottom: '1.5rem',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em'
          }}>
            What We Offer
          </h2>

          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{
              border: '4px solid #1a1a1a',
              background: 'white',
              padding: '1.5rem',
              boxShadow: '8px 8px 0px #fb923c'
            }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="10" r="1" fill="#fb923c"/>
                  <circle cx="15" cy="10" r="1" fill="#fb923c"/>
                  <path d="M9 14h6" stroke="#fb923c" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Discord Bot Hosting
              </h3>
              <p>Our specialty! Host your Discord bots 24/7 with zero downtime. We handle all the infrastructure so you can focus on coding amazing bots.</p>
            </div>

            <div style={{
              border: '4px solid #1a1a1a',
              background: 'white',
              padding: '1.5rem',
              boxShadow: '8px 8px 0px #fb923c'
            }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="7.5,4.27 12,6.87 16.5,4.27" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="12" y1="22.5" x2="12" y2="6.87" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Website Hosting
              </h3>
              <p>Also available - free hosting for your websites and web applications. Perfect companion to your Discord bots.</p>
            </div>

            <div style={{
              border: '4px solid #1a1a1a',
              background: 'white',
              padding: '1.5rem',
              boxShadow: '8px 8px 0px #fb923c'
            }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Powerful Specs
              </h3>
              <p>Each hosting instance comes with <strong>314MB RAM</strong>, <strong>50% CPU</strong>, <strong>4 cores</strong>, and <strong>4GB SSD storage</strong> for optimal performance.</p>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '900',
              marginBottom: '1.5rem',
              textTransform: 'uppercase'
            }}>
              Why Choose Voidium?
            </h3>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
              <div style={{
                border: '4px solid #1a1a1a',
                background: 'white',
                padding: '1.5rem',
                boxShadow: '8px 8px 0px #fb923c',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🆓</div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '0.5rem' }}>100% Free</h4>
                <p style={{ fontSize: '0.9rem' }}>No hidden fees, no premium tiers. Just free hosting for everyone.</p>
              </div>

              <div style={{
                border: '4px solid #1a1a1a',
                background: 'white',
                padding: '1.5rem',
                boxShadow: '8px 8px 0px #fb923c',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '0.5rem' }}>Lightning Fast</h4>
                <p style={{ fontSize: '0.9rem' }}>High-performance SSD storage with dedicated CPU cores for instant bot responses.</p>
              </div>

              <div style={{
                border: '4px solid #1a1a1a',
                background: 'white',
                padding: '1.5rem',
                boxShadow: '8px 8px 0px #fb923c',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛡️</div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '0.5rem' }}>Secure & SSL</h4>
                <p style={{ fontSize: '0.9rem' }}>HTTPS encryption included for all your hosted content.</p>
              </div>

              <div style={{
                border: '4px solid #1a1a1a',
                background: 'white',
                padding: '1.5rem',
                boxShadow: '8px 8px 0px #fb923c',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '0.5rem' }}>Community Support</h4>
                <p style={{ fontSize: '0.9rem' }}>Join our Discord for help, updates, and bot developer community.</p>
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
              marginBottom: '0.5rem',
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
              Ready to host with us? It's simple:
            </p>
            <ol style={{ paddingLeft: '1.5rem', color: '#166534' }}>
              <li style={{ marginBottom: '0.5rem' }}>1. Join our Discord server</li>
              <li style={{ marginBottom: '0.5rem' }}>2. Create your account</li>
              <li style={{ marginBottom: '0.5rem' }}>3. Upload your files or connect your bot</li>
              <li>4. Your site/bot goes live instantly!</li>
            </ol>
          </div>
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
