import { redirect } from "@remix-run/cloudflare";

export async function loader() {
  return redirect("/home");
}

export default function Index() {
  return null;
}
