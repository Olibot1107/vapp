import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";

export const loader = ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
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
