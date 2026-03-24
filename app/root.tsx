import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { json, redirect, type LoaderFunctionArgs } from "@remix-run/cloudflare";

export const loader = ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const hostname = url.hostname.toLowerCase();

  if (hostname === "vapp.uk" || hostname === "www.vapp.uk") {
    const target = new URL(url.toString());
    target.hostname = "voidium.uk";
    target.protocol = "https:";
    return redirect(target.toString(), 301);
  }

  if (hostname === "status.voidium.uk" || hostname === "www.status.voidium.uk") {
    const target = new URL("https://voidium.uk/status");
    target.search = url.search;
    return redirect(target.toString(), 301);
  }

  return json({ origin: url.origin });
};

export const links = () => {
  return [
    { rel: "icon", type: "image/png", href: "/icon.png" },
    { rel: "apple-touch-icon", href: "/icon.png" },
    { rel: "shortcut icon", href: "/favicon.ico" },
  ];
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
