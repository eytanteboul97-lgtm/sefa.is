import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Tant que le site n'est pas prêt pour le public (textes légaux, coordonnées),
  // NEXT_PUBLIC_ALLOW_INDEXING reste absent : les moteurs sont priés de ne pas indexer.
  const allow = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  return {
    rules: allow ? { userAgent: "*", allow: "/", disallow: "/api/" } : { userAgent: "*", disallow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
