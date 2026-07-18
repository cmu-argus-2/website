import type { MetadataRoute } from "next";

// The deploy workflow supplies the full public URL (including the /website base
// path); fall back to the known production URL for local static exports.
const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://cmu-argus-2.github.io/website";

// Required for `output: export` — emit a static robots.txt at build time.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${base}/sitemap.xml`,
  };
}
