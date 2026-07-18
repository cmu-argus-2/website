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
  keywords: [
    "CubeSat",
    "orbit determination",
    "attitude determination",
    "vision-based navigation",
    "open source spacecraft",
    "small satellite",
    "Argus",
    "Carnegie Mellon",
    "Instituto Superior Técnico",
  ],
  authors: [{ name: "Argus mission — Carnegie Mellon & Instituto Superior Técnico" }],
  creator: "Argus mission team",
  publisher: "Carnegie Mellon University & Instituto Superior Técnico",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Argus",
    locale: "en_US",
    title: site.title,
    description: site.description,
    url: siteUrl,
    images: [{ url: socialImage, width: 1200, height: 630, alt: site.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: [socialImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

// Organization structured data — helps search engines understand who runs the site.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Argus",
  description: site.description,
  url: siteUrl ?? metadataBase.toString(),
  logo: socialImage,
  sameAs: [site.github],
  member: [
    { "@type": "CollegeOrUniversity", name: "Carnegie Mellon University" },
    { "@type": "CollegeOrUniversity", name: "Instituto Superior Técnico" },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
