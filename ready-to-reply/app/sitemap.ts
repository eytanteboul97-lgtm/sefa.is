import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const routes = [
  "",
  "/comment-ca-marche",
  "/produit",
  "/tarifs",
  "/a-propos",
  "/contact",
  "/veille",
  "/mentions-legales",
  "/confidentialite",
  "/cookies",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((r) => ({ url: `${site.url}${r}`, changeFrequency: "monthly", priority: r === "" ? 1 : 0.6 }));
}
