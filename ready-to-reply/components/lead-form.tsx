"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { buttonClasses } from "@/components/ui";
import {
  companySizes,
  needs,
  requestTypes,
  trades,
  validateLead,
  type Lead,
  type LeadApiResponse,
  type LeadErrors,
} from "@/lib/lead";
import { cn } from "@/lib/utils";

type Outcome = "sent" | "dev-logged" | "not-configured" | "rate-limited" | "error" | null;

const fieldOrder: (keyof Lead)[] = [
  "requestType",
  "fullName",
  "email",
  "company",
  "trade",
  "companySize",
  "need",
  "message",
  "consent",
];

const inputBase =
  "mt-2 block w-full rounded-xl border bg-ivory px-4 py-3 text-base text-ink placeholder:text-ink-muted/80 transition-colors focus:border-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-terracotta-deep";

export function LeadForm({ initialType = "pilote" }: { initialType?: Lead["requestType"] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const startedAt = useRef<number>(0);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedOnce, setSubmittedOnce] = useState(false);
  const [outcome, setOutcome] = useState<Outcome>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const readForm = () => {
    const fd = new FormData(formRef.current!);
    return {
      requestType: fd.get("requestType"),
      fullName: fd.get("fullName"),
      email: fd.get("email"),
      company: fd.get("company"),
      trade: fd.get("trade"),
      companySize: fd.get("companySize") ?? "",
      need: fd.get("need"),
      message: fd.get("message"),
      consent: fd.get("consent") === "on",
      website: fd.get("website"),
    };
  };

  // Après une première tentative, les erreurs se mettent à jour pendant la saisie.
  const revalidate = () => {
    if (!submittedOnce) return;
    const r = validateLead(readForm());
    setErrors(r.ok ? {} : r.errors);
  };

  const focusFirstError = (errs: LeadErrors) => {
    const first = fieldOrder.find((f) => errs[f]);
    if (!first) return;
    const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
    el?.focus();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return; // pas de double envoi
    setSubmittedOnce(true);
    setOutcome(null);

    const raw = readForm();
    const result = validateLead(raw);
    if (!result.ok) {
      setErrors(result.errors);
      focusFirstError(result.errors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.data, website: raw.website, startedAt: startedAt.current }),
      });
      const data = (await res.json().catch(() => ({ status: "error" }))) as LeadApiResponse;

      if (data.status === "invalid") {
        setErrors(data.errors);
        focusFirstError(data.errors);
      } else {
        setOutcome(data.status);
        if (data.status === "sent" || data.status === "dev-logged") formRef.current?.reset();
      }
    } catch {
      setOutcome("error");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (outcome) statusRef.current?.focus();
  }, [outcome]);

  const errorCount = Object.keys(errors).length;

  if (outcome === "sent") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="rounded-2xl border border-sage/30 bg-sage-soft p-8">
        <p className="font-serif text-2xl text-ink">Merci, votre demande a bien été transmise.</p>
        <p className="mt-3 leading-relaxed text-ink-soft">
          Nous revenons vers vous par e-mail pour convenir d&apos;un échange. Si vous ne recevez rien dans les
          prochains jours, pensez à vérifier vos courriers indésirables.
        </p>
        <button type="button" onClick={() => setOutcome(null)} className={buttonClasses("secondary", "mt-6")}>
          Envoyer une autre demande
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      method="post"
      action="/api/contact"
      onSubmit={onSubmit}
      noValidate
      onChange={revalidate}
      className="space-y-7"
    >
      <div aria-live="polite" className="empty:hidden">
        {errorCount > 0 && (
          <p className="rounded-xl border border-terracotta/40 bg-terracotta-soft px-4 py-3 text-sm font-medium text-terracotta-deep">
            {errorCount === 1 ? "Un champ est à corriger." : `${errorCount} champs sont à corriger.`} Les erreurs sont
            indiquées sous chaque champ concerné.
          </p>
        )}
      </div>

      {outcome && (
        <div
          ref={statusRef}
          tabIndex={-1}
          role={outcome === "dev-logged" ? "status" : "alert"}
          className={cn(
            "rounded-xl border px-5 py-4 text-sm leading-relaxed",
            outcome === "dev-logged" ? "border-ochre/30 bg-ochre-soft text-ink" : "border-terracotta/40 bg-terracotta-soft text-ink",
          )}
        >
          {outcome === "dev-logged" && (
            <>
              <strong>Mode développement : votre demande n&apos;a pas été transmise.</strong> Elle a été validée et
              affichée dans la console du serveur. Pour recevoir réellement les demandes, renseignez la variable
              <code className="mx-1 rounded bg-ivory px-1">CONTACT_WEBHOOK_URL</code>(voir le README).
            </>
          )}
          {outcome === "not-configured" && (
            <>
              <strong>Votre demande n&apos;a pas pu être envoyée.</strong> La réception des demandes n&apos;est pas
              encore activée sur ce site. Nous vous prions de nous excuser : merci de réessayer un peu plus tard.
            </>
          )}
          {outcome === "rate-limited" && (
            <>
              <strong>Trop de tentatives en peu de temps.</strong> Votre demande n&apos;a pas été envoyée ; merci de
              réessayer dans quelques minutes.
            </>
          )}
          {outcome === "error" && (
            <>
              <strong>Votre demande n&apos;a pas pu être envoyée.</strong> Une erreur est survenue de notre côté ou la
              connexion a été interrompue. Vos informations sont toujours dans le formulaire : vous pouvez réessayer.
            </>
          )}
        </div>
      )}

      <fieldset>
        <legend className="text-sm font-bold">Votre demande</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {requestTypes.map((t) => (
            <label
              key={t.value}
              className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-ivory p-4 text-sm font-medium transition-colors hover:border-ink/40 has-[:checked]:border-ink has-[:checked]:bg-cream has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-terracotta-deep"
            >
              <input
                type="radio"
                name="requestType"
                value={t.value}
                defaultChecked={t.value === initialType}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#2B1E18]"
              />
              {t.label}
            </label>
          ))}
        </div>
        <FieldError id="requestType" error={errors.requestType} />
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField name="fullName" label="Prénom et nom" autoComplete="name" error={errors.fullName} />
        <TextField
          name="email"
          label="E-mail professionnel"
          type="email"
          autoComplete="email"
          inputMode="email"
          error={errors.email}
          hint="Nous l'utilisons uniquement pour vous répondre."
        />
        <TextField name="company" label="Nom de l'entreprise" autoComplete="organization" error={errors.company} />
        <SelectField name="trade" label="Métier" options={trades} placeholder="Choisir votre métier" error={errors.trade} />
        <SelectField
          name="companySize"
          label="Taille de l'entreprise"
          optional
          options={companySizes}
          error={errors.companySize}
        />
        <SelectField
          name="need"
          label="Besoin principal"
          options={needs}
          placeholder="Choisir votre besoin"
          error={errors.need}
        />
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-bold">
          Message <span className="font-normal text-ink-muted">(facultatif)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={1500}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-error" : "message-hint"}
          className={cn(inputBase, errors.message ? "border-terracotta" : "border-line")}
        />
        {!errors.message && (
          <p id="message-hint" className="mt-2 text-sm text-ink-muted">
            Les marchés que vous visez, vos questions… N&apos;y joignez aucun document confidentiel.
          </p>
        )}
        <FieldError id="message" error={errors.message} />
      </div>

      {/* Champ piège anti-spam : invisible et ignoré par les humains. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Ne pas remplir ce champ</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-soft">
          <input
            type="checkbox"
            name="consent"
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            className="mt-1 h-4 w-4 shrink-0 accent-[#2B1E18]"
          />
          <span>
            J&apos;accepte que Ready to Reply utilise ces informations pour répondre à ma demande et me recontacter à
            ce sujet. Elles ne sont ni revendues ni utilisées à d&apos;autres fins. Détails et droits dans la{" "}
            <Link href="/confidentialite" className="font-semibold text-terracotta-deep underline underline-offset-2">
              politique de confidentialité
            </Link>
            .
          </span>
        </label>
        <FieldError id="consent" error={errors.consent} />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button type="submit" disabled={submitting} aria-disabled={submitting} className={buttonClasses("primary", "sm:w-auto")}>
          {submitting ? (
            <>
              <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-ivory/40 border-t-ivory" />
              Envoi en cours…
            </>
          ) : (
            "Envoyer ma demande"
          )}
        </button>
        <p className="text-sm text-ink-muted">Tous les champs sont obligatoires, sauf mention contraire.</p>
      </div>
      <p className="sr-only" aria-live="polite">
        {submitting ? "Envoi de votre demande en cours." : ""}
      </p>
    </form>
  );
}

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={`${id}-error`} className="mt-2 flex gap-1.5 text-sm font-medium text-terracotta-deep">
      <span aria-hidden="true">!</span>
      {error}
    </p>
  );
}

function TextField({
  name,
  label,
  type = "text",
  autoComplete,
  inputMode,
  error,
  hint,
}: {
  name: keyof Lead;
  label: string;
  type?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  error?: string;
  hint?: string;
}) {
  const describedBy = [error && `${name}-error`, hint && !error && `${name}-hint`].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={name} className="text-sm font-bold">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        required
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(inputBase, error ? "border-terracotta" : "border-line")}
      />
      {hint && !error && (
        <p id={`${name}-hint`} className="mt-2 text-sm text-ink-muted">
          {hint}
        </p>
      )}
      <FieldError id={name} error={error} />
    </div>
  );
}

function SelectField({
  name,
  label,
  options,
  placeholder,
  optional,
  error,
}: {
  name: keyof Lead;
  label: string;
  options: readonly { value: string; label: string }[];
  placeholder?: string;
  optional?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-bold">
        {label} {optional && <span className="font-normal text-ink-muted">(facultatif)</span>}
      </label>
      <select
        id={name}
        name={name}
        required={!optional}
        defaultValue=""
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={cn(inputBase, "appearance-none bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-10", error ? "border-terracotta" : "border-line")}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M4 6l4 4 4-4' stroke='%232B1E18' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
        }}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <FieldError id={name} error={error} />
    </div>
  );
}
