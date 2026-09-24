import type { Metadata } from "next";
import { site } from "@/lib/site";

/** Métadonnées propres à chaque page (titre, description, canonique, réseaux sociaux). */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} · ${site.name}`,
      description,
      url: path,
      siteName: site.name,
      locale: site.locale,
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name} — ${site.tagline}` }],
    },
    twitter: { card: "summary_large_image", title: `${title} · ${site.name}`, description },
  };
}
