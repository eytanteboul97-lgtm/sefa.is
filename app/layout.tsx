import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, Fraunces, Playfair_Display, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/smooth-scroll";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const luxury = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-luxury",
  display: "swap",
});

const accent = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["italic"],
  variable: "--font-accent",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = "https://sefa.co";
const title = "Sefa — Israel's digital beauty house";
const description =
  "Book Israel's finest salons, hairdressers, spas and barbershops in a breath. For salon owners: fill your calendar, cut no-shows by 40%, get paid before clients arrive.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s · Sefa",
  },
  description,
  keywords: [
    "beauty booking Israel",
    "salon Tel Aviv",
    "hair salon booking",
    "spa Israel",
    "barbershop booking",
    "salon software Israel",
  ],
  authors: [{ name: "Sefa" }],
  openGraph: {
    type: "website",
    locale: "en_IL",
    alternateLocale: ["fr_FR", "he_IL"],
    url: siteUrl,
    siteName: "Sefa",
    title,
    description,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Sefa — Israel's digital beauty house" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: siteUrl,
    languages: { en: siteUrl, he: `${siteUrl}/he` },
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#17140F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Sefa",
    url: siteUrl,
    description,
    inLanguage: ["en", "fr", "he"],
  };

  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${luxury.variable} ${accent.variable} ${mono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-paper text-ink font-body antialiased">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
