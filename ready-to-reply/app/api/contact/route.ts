import { NextResponse } from "next/server";
import { validateLead, type LeadApiResponse } from "@/lib/lead";

/**
 * Réception des demandes « pilote / démonstration / rappel ».
 *
 * Transmission : la demande validée est envoyée en POST JSON à
 * `CONTACT_WEBHOOK_URL` (Make, Zapier, n8n, CRM, fonction d'envoi d'e-mail…).
 * - Webhook configuré → on ne répond « envoyé » que si le webhook renvoie 2xx.
 * - Pas de webhook en développement → la demande est affichée dans la console
 *   du serveur et le formulaire l'indique explicitement (rien n'est transmis).
 * - Pas de webhook en production → réponse 503 « non configuré » : le
 *   formulaire le dit à l'utilisateur au lieu de simuler un envoi.
 */

const MIN_FILL_MS = 2500; // en dessous : très probablement un robot
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

// Limitation best-effort, en mémoire : elle ne persiste pas entre instances
// serverless. À remplacer par un stockage partagé si le spam devient un sujet.
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const reply = (body: LeadApiResponse, status: number) => NextResponse.json(body, { status });

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return reply({ status: "rate-limited" }, 429);

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body !== "object") return reply({ status: "error" }, 400);

  // Anti-spam : champ piège invisible pour les humains + délai minimal de saisie.
  const startedAt = Number(body.startedAt);
  if (
    (typeof body.website === "string" && body.website.length > 0) ||
    !Number.isFinite(startedAt) ||
    Date.now() - startedAt < MIN_FILL_MS
  ) {
    return reply({ status: "error" }, 400);
  }

  const result = validateLead(body);
  if (!result.ok) return reply({ status: "invalid", errors: result.errors }, 422);

  const lead = { ...result.data, receivedAt: new Date().toISOString(), source: "site-ready-to-reply" };
  const webhook = process.env.CONTACT_WEBHOOK_URL;

  if (!webhook) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] CONTACT_WEBHOOK_URL absent — demande NON transmise (mode dev) :", lead);
      return reply({ status: "dev-logged" }, 200);
    }
    console.error("[contact] CONTACT_WEBHOOK_URL absent : demande refusée, rien n'a été transmis.");
    return reply({ status: "not-configured" }, 503);
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.CONTACT_WEBHOOK_SECRET
          ? { Authorization: `Bearer ${process.env.CONTACT_WEBHOOK_SECRET}` }
          : {}),
      },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`[contact] Le webhook a répondu ${res.status}.`);
      return reply({ status: "error" }, 502);
    }
    return reply({ status: "sent" }, 200);
  } catch (err) {
    console.error("[contact] Échec de l'appel au webhook :", err instanceof Error ? err.message : err);
    return reply({ status: "error" }, 502);
  }
}
