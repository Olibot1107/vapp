import type { MetaFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = ({ matches }) => {
  const rootData = matches.find((match) => match.id === "root")?.data as
    | { origin?: unknown }
    | undefined;
  const origin = typeof rootData?.origin === "string" ? rootData.origin : "https://voidium.uk";
  const ogImage = `${origin}/og.png`;
  const ogIcon = `${origin}/icon.png`;
  return [
    { title: "Voidium Docs" },
    {
      name: "description",
      content:
        "Documentation for Voidium — how to get started, where to get help, and common questions.",
    },
    { property: "og:title", content: "Voidium Docs" },
    { property: "og:description", content: "Documentation for Voidium — how to get started, where to get help, and common questions." },
    { property: "og:image", content: ogImage },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: "Voidium Hosting" },
    { property: "og:image", content: ogIcon },
    { property: "og:image:width", content: "512" },
    { property: "og:image:height", content: "512" },
    { property: "og:url", content: `${origin}/docs` },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Voidium Hosting" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Voidium Docs" },
    { name: "twitter:description", content: "Documentation for Voidium — how to get started, where to get help, and common questions." },
    { name: "twitter:image", content: ogImage },
    { name: "twitter:image:alt", content: "Voidium Hosting" },
  ];
};

export default function Docs() {
  return (
    <div
      style={{
        fontFamily:
          '"Space Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: "#fef7ed",
        color: "#1a1a1a",
        lineHeight: "1.6",
        padding: "20px",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            marginBottom: "1.5rem",
          }}
        >
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "900",
              textShadow: "4px 4px 0px #fb923c",
              margin: 0,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
            }}
          >
            Docs
          </h1>

          <Link to="/" style={{ textDecoration: "none" }}>
            <button
              style={{
                background: "white",
                color: "#1a1a1a",
                border: "4px solid #1a1a1a",
                padding: "0.75rem 1.25rem",
                fontWeight: "900",
                fontSize: "1rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                cursor: "pointer",
                boxShadow: "8px 8px 0px #1a1a1a",
                transition: "all 0.1s ease",
                borderRadius: "0",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translate(-2px, -2px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "12px 12px 0px #1a1a1a";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translate(0px, 0px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "8px 8px 0px #1a1a1a";
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translate(2px, 2px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "4px 4px 0px #1a1a1a";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translate(-2px, -2px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "12px 12px 0px #1a1a1a";
              }}
            >
              Back Home
            </button>
          </Link>
        </div>

        <div
          style={{
            border: "4px solid #1a1a1a",
            background: "white",
            padding: "1.25rem 1.5rem",
            boxShadow: "8px 8px 0px #fb923c",
            marginBottom: "1.5rem",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", fontWeight: "900", margin: 0 }}>
            Quick Links
          </h2>
          <div
            style={{
              display: "grid",
              gap: "0.75rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              marginTop: "0.75rem",
              alignItems: "stretch",
            }}
          >
            <a
              href="https://panel.voidium.uk"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <button
                style={{
                  background: "#fb923c",
                  color: "#1a1a1a",
                  border: "4px solid #1a1a1a",
                  padding: "0.75rem 1.25rem",
                  fontWeight: "900",
                  fontSize: "1rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                  boxShadow: "8px 8px 0px #1a1a1a",
                  transition: "all 0.1s ease",
                  borderRadius: "0",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "58px",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translate(-2px, -2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "12px 12px 0px #1a1a1a";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translate(0px, 0px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "8px 8px 0px #1a1a1a";
                }}
                onMouseDown={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translate(2px, 2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "4px 4px 0px #1a1a1a";
                }}
                onMouseUp={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translate(-2px, -2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "12px 12px 0px #1a1a1a";
                }}
              >
                Panel
              </button>
            </a>

            <a
              href="/status"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <button
                style={{
                  background: "#0ea5e9",
                  color: "#1a1a1a",
                  border: "4px solid #1a1a1a",
                  padding: "0.75rem 1.25rem",
                  fontWeight: "900",
                  fontSize: "1rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                  boxShadow: "8px 8px 0px #1a1a1a",
                  transition: "all 0.1s ease",
                  borderRadius: "0",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "58px",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translate(-2px, -2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "12px 12px 0px #1a1a1a";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translate(0px, 0px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "8px 8px 0px #1a1a1a";
                }}
                onMouseDown={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translate(2px, 2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "4px 4px 0px #1a1a1a";
                }}
                onMouseUp={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translate(-2px, -2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "12px 12px 0px #1a1a1a";
                }}
              >
                Status
              </button>
            </a>

            <a
              href="https://discord.gg/9eM8z6j9AK"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <button
                style={{
                  background: "#5865f2",
                  color: "#1a1a1a",
                  border: "4px solid #1a1a1a",
                  padding: "0.75rem 1.25rem",
                  fontWeight: "900",
                  fontSize: "1rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                  boxShadow: "8px 8px 0px #1a1a1a",
                  transition: "all 0.1s ease",
                  borderRadius: "0",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "58px",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translate(-2px, -2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "12px 12px 0px #1a1a1a";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translate(0px, 0px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "8px 8px 0px #1a1a1a";
                }}
                onMouseDown={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translate(2px, 2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "4px 4px 0px #1a1a1a";
                }}
                onMouseUp={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translate(-2px, -2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "12px 12px 0px #1a1a1a";
                }}
              >
                Discord
              </button>
            </a>
          </div>
        </div>

        <div
          id="getting-started"
          style={{
            border: "4px solid #1a1a1a",
            background: "#dcfce7",
            padding: "1.5rem",
            boxShadow: "8px 8px 0px #22c55e",
            marginBottom: "1.5rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "900",
              marginTop: 0,
              marginBottom: "1rem",
              color: "#166534",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              textTransform: "uppercase",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"
                stroke="#22c55e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"
                stroke="#22c55e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"
                stroke="#22c55e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"
                stroke="#22c55e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Getting Started
          </h2>
          <p style={{ marginBottom: "1rem", color: "#166534" }}>
            Ready to host your bot? It&apos;s simple:
          </p>
          <ol style={{ paddingLeft: "1.5rem", color: "#166534", margin: 0 }}>
            <li style={{ marginBottom: "0.5rem" }}>Join our Discord server</li>
            <li style={{ marginBottom: "0.5rem" }}>Create your account</li>
            <li style={{ marginBottom: "0.5rem" }}>Create a server</li>
            <li style={{ marginBottom: "0.5rem" }}>Login on the dashboard</li>
            <li style={{ marginBottom: "0.5rem" }}>Upload your bot files</li>
            <li>Start your bot and go live!</li>
          </ol>
        </div>

        <div
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              border: "4px solid #1a1a1a",
              background: "white",
              padding: "1.25rem 1.5rem",
              boxShadow: "8px 8px 0px #fb923c",
            }}
          >
            <h3 style={{ fontSize: "1.25rem", fontWeight: "900", marginTop: 0 }}>
              What Is Voidium?
            </h3>
            <p style={{ margin: 0 }}>
              Voidium is free Discord bot hosting. You bring the code, we keep it online.
            </p>
          </div>

          <div
            style={{
              border: "4px solid #1a1a1a",
              background: "white",
              padding: "1.25rem 1.5rem",
              boxShadow: "8px 8px 0px #fb923c",
            }}
          >
            <h3 style={{ fontSize: "1.25rem", fontWeight: "900", marginTop: 0 }}>
              Tokens & Secrets
            </h3>
            <p style={{ margin: 0 }}>
              Keep your Discord bot token private. Don’t commit it to GitHub — use environment
              variables / the panel’s settings to store secrets.
            </p>
          </div>

          <div
            style={{
              border: "4px solid #1a1a1a",
              background: "white",
              padding: "1.25rem 1.5rem",
              boxShadow: "8px 8px 0px #fb923c",
            }}
          >
            <h3 style={{ fontSize: "1.25rem", fontWeight: "900", marginTop: 0 }}>
              Troubleshooting
            </h3>
            <ul style={{ paddingLeft: "1.25rem", margin: 0 }}>
              <li>Bot not starting: check logs first.</li>
              <li>Crashes: verify Node/Python version and dependencies.</li>
              <li>Downtime: check the status page.</li>
            </ul>
          </div>
        </div>

        <div
          id="help"
          style={{
            border: "4px solid #1a1a1a",
            background: "#dcfce7",
            padding: "1.25rem 1.5rem",
            boxShadow: "8px 8px 0px #22c55e",
          }}
        >
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "900",
              marginTop: 0,
              marginBottom: "0.5rem",
              color: "#166534",
            }}
          >
            Need Help?
          </h3>
          <p style={{ margin: 0, color: "#166534" }}>
            Ask in Discord and include: what you tried, what you expected, and a screenshot of the
            logs/errors.
          </p>
        </div>
      </div>
    </div>
  );
}
