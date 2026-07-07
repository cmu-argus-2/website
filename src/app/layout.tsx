import type { Metadata } from "next";
import "./globals.css";
import { spaceGrotesk, inter, plexMono } from "./fonts";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { site } from "@/content/copy";
import { withBasePath } from "@/lib/paths";

// Full public URL, including the GitHub Pages project path. The deploy workflow
// supplies this in production; keeping it optional preserves local builds.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
const metadataBase = new URL(siteUrl ?? "http://localhost:3000");
const socialImage = siteUrl
  ? `${siteUrl}/images/argus-studio.webp`
  : withBasePath("/images/argus-studio.webp");

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: site.title,
    template: "%s · Argus",
  },
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    url: siteUrl,
    images: [socialImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${plexMono.variable} h-full antialiased`}
      // browser extensions (content filters) inject attributes into <html>
      // before hydration; suppress attribute-only mismatch noise on this
      // element — children still hydrate strictly
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
