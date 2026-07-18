import type { MetadataRoute } from "next";

// Full public URL (including the /website base path) is provided by the deploy
// workflow; fall back to the known production URL for local static exports.
const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://cmu-argus-2.github.io/website";

// Trailing slashes match next.config.ts `trailingSlash: true`.
const routes = ["", "mission", "team", "updates", "open-source", "radio", "design"];

// Required for `output: export` — emit a static sitemap.xml at build time.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${base}/${route ? `${route}/` : ""}`,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
