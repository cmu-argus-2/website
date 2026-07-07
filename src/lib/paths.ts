const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Runtime asset URLs (textures, models, <img> src) don't get Next's basePath
 * applied automatically the way route links do — prefix them explicitly.
 */
export function withBasePath(path: string): string {
  if (path.startsWith("http")) return path;
  return `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}
