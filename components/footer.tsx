import { Logo } from "@/components/logo";

const columns = [
  {
    title: "Platform",
    links: ["Discover salons", "For salon owners", "Pricing", "Blog"],
  },
  { title: "Help", links: ["FAQ", "Support", "Contact", "Status"] },
  { title: "Company", links: ["About", "Instagram", "Privacy", "Terms"] },
];

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-paper px-6 py-16">
      <div className="mx-auto grid max-w-6xl gap-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="text-xl">
            <Logo />
          </span>
          <p className="mt-3 max-w-xs text-sm text-ink/50">
            Your calendar, your rules. The smart booking platform for
            Israel's beauty industry.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-display text-sm font-semibold text-ink/70">{col.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-ink/50 hover:text-gold">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-ink/10 pt-6 text-xs text-ink/40 sm:flex-row">
        <p>© {new Date().getFullYear()} Sefa · Online beauty booking · Israel</p>
        <div className="flex gap-4">
          <button className="hover:text-ink">EN</button>
          <button className="hover:text-ink">עב</button>
        </div>
      </div>
    </footer>
  );
}
