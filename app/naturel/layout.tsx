import type { Metadata } from "next";
import "./naturel.css";

export const metadata: Metadata = {
  title: {
    absolute: "Naturel — Every piece tells a story.",
  },
  description:
    "Naturel is a numbered coastal-series cap collection made slowly, in small runs. No add to cart — join the waiting list.",
  openGraph: {
    title: "Naturel — Every piece tells a story.",
    description:
      "A numbered coastal-series cap collection made slowly, in small runs.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function NaturelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="naturel-page">{children}</div>;
}
