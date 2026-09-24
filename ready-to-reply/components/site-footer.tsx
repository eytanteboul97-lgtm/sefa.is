import Link from "next/link";
import { Logo } from "@/components/logo";
import { Container } from "@/components/ui";
import { nav, site, socials, primaryCta } from "@/lib/site";

const legalLinks = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/confidentialite", label: "Politique de confidentialité" },
  { href: "/cookies", label: "Cookies" },
];

export function SiteFooter() {
  return (
    <footer className="bg-ink text-cream">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo variant="dark" className="w-40" />
            <p className="mt-5 max-w-sm font-serif text-xl leading-snug">{site.tagline}</p>
            <p className="mt-2 text-sm text-tan">{site.brandLine}</p>
          </div>

          <nav aria-label="Plan du site">
            <h2 className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-tan">Le site</h2>
            <ul className="mt-4 space-y-2.5 text-[0.95rem]">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-cream/90 hover:text-ivory hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={primaryCta.href} className="text-cream/90 hover:text-ivory hover:underline">
                  Contact et phase pilote
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Informations légales">
            <h2 className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-tan">Informations</h2>
            <ul className="mt-4 space-y-2.5 text-[0.95rem]">
              {legalLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-cream/90 hover:text-ivory hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
              {socials.map((s) => (
                <li key={s.href}>
                  <a href={s.href} rel="noopener noreferrer" className="text-cream/90 hover:text-ivory hover:underline">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 space-y-3 border-t border-cream/15 pt-8 text-sm leading-relaxed text-cream/75">
          <p>
            Ready to Reply est un service indépendant, en cours de construction. Il n&apos;est ni un organisme
            public, ni un partenaire officiel des acheteurs publics ou des plateformes de publication des marchés.
          </p>
          <p>Les écrans présentés sur ce site sont des maquettes ; les exemples de marchés sont fictifs.</p>
          <p>© {new Date().getFullYear()} {site.name}</p>
        </div>
      </Container>
    </footer>
  );
}
