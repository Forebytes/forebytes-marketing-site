import type { Metadata, Viewport } from "next";
import { caprasimo, figtree, inter, playfair } from "@/lib/fonts";
import { SITE } from "@/lib/site";
import SmoothScroll from "@/components/SmoothScroll";
import JsonLd from "@/components/JsonLd";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name}: ${SITE.tagline}`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: ["restaurant discovery app", "Dublin restaurants", "AR menu", "dish ratings", "restaurant menus with prices", "nutrition", "Forebytes"],
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE.name}: ${SITE.tagline}`,
    description: SITE.description,
    siteName: SITE.name,
    locale: SITE.locale,
    type: "website",
    url: "/",
  },
  twitter: { card: "summary_large_image", title: `${SITE.name}: ${SITE.tagline}`, description: SITE.description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = { themeColor: "#f5ead8", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${caprasimo.variable} ${figtree.variable} ${playfair.variable} ${inter.variable}`}>
      <body className="bg-bg text-text font-body antialiased">
        <SmoothScroll />
        <JsonLd data={{
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "Organization", "@id": `${SITE.url}/#org`, name: SITE.name, url: SITE.url, logo: `${SITE.url}/logo.png`, email: SITE.emails.support },
            { "@type": "WebSite", "@id": `${SITE.url}/#site`, url: SITE.url, name: SITE.name, description: SITE.description, inLanguage: "en-IE", publisher: { "@id": `${SITE.url}/#org` } },
          ],
        }} />
        {children}
      </body>
    </html>
  );
}
