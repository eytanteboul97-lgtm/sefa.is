import { faq } from "@/content/faq";

/**
 * FAQ en <details> natifs : accessibles au clavier et aux lecteurs d'écran
 * (état « développé / réduit » annoncé) sans JavaScript. Style dans globals.css (.faq).
 */
export function Faq({ items = faq }: { items?: typeof faq }) {
  return (
    <div className="faq">
      {items.map((item) => (
        <details key={item.q}>
          <summary>
            {item.q}
            <span aria-hidden="true" className="plus" />
          </summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  );
}
