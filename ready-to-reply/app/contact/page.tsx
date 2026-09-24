import { Placeholder } from "@/components/labels";
import { LeadForm } from "@/components/lead-form";
import { Container } from "@/components/ui";
import { requestTypes, type Lead } from "@/lib/lead";
import { pageMetadata } from "@/lib/metadata";
import { contact } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Rejoindre le pilote",
  description:
    "Rejoignez la phase pilote de Ready to Reply, demandez une démonstration ou demandez à être recontacté. Pour les PME de l'électricité et de l'éclairage en priorité.",
  path: "/contact",
});

const next = [
  "Nous lisons votre demande et revenons vers vous par e-mail.",
  "Un premier échange, pour comprendre comment vous répondez aux marchés aujourd'hui.",
  "Si le pilote vous convient, vous testez les premières versions et vos retours orientent le produit.",
];

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ demande?: string | string[] }>;
}) {
  const { demande } = await searchParams;
  const initialType = requestTypes.find((t) => t.value === demande)?.value ?? "pilote";

  return (
    <Container className="grid gap-14 py-12 sm:py-20 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
      <div>
        <p className="eyebrow">Contact · phase pilote</p>
        <h1 className="mt-3 text-4xl leading-[1.1] sm:text-5xl">Faisons le premier pas ensemble.</h1>
        <p className="mt-6 text-lg leading-relaxed text-ink-soft">
          Ready to Reply se construit avec des PME qui répondent aux marchés publics, en commençant par
          l&apos;électricité et l&apos;éclairage. Rejoignez la phase pilote, demandez une démonstration, ou posez
          simplement vos questions.
        </p>
        <h2 className="mt-10 font-sans text-sm font-bold uppercase tracking-[0.14em] text-ink-muted">Et ensuite ?</h2>
        <ol className="mt-4 space-y-4">
          {next.map((n, i) => (
            <li key={n} className="flex gap-4">
              <span className="figure flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-terracotta text-sm text-ivory">
                {i + 1}
              </span>
              <span className="pt-1 leading-relaxed text-ink-soft">{n}</span>
            </li>
          ))}
        </ol>
        <p className="mt-10 rounded-xl border border-line bg-ivory p-5 text-sm leading-relaxed text-ink-soft">
          Les conditions de la phase pilote seront précisées lors du premier échange. La plateforme n&apos;étant pas
          encore ouverte, aucun paiement n&apos;est demandé.
        </p>
        <div className="mt-6 text-sm text-ink-muted">
          <p>
            E-mail : {contact.email ? <a href={`mailto:${contact.email}`}>{contact.email}</a> : <Placeholder>e-mail à compléter</Placeholder>}
          </p>
          <p className="mt-2">
            Téléphone : {contact.phone ? <a href={`tel:${contact.phone}`}>{contact.phone}</a> : <Placeholder>téléphone à compléter</Placeholder>}
          </p>
        </div>
      </div>
      <div className="card p-6 sm:p-10">
        <h2 className="text-2xl">Votre demande</h2>
        <p className="mb-8 mt-2 text-sm text-ink-muted">Deux minutes suffisent.</p>
        <LeadForm initialType={initialType as Lead["requestType"]} />
      </div>
    </Container>
  );
}
