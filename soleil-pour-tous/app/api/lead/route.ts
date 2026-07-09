import { NextResponse } from "next/server";
import { Resend } from "resend";
import { leadFormSchema, type LeadFormValues } from "@/lib/lead-schema";

const LEAD_NOTIFICATION_EMAIL =
  process.env.LEAD_NOTIFICATION_EMAIL ?? "soleilpourtouspro@gmail.com";
const RESEND_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "Soleil Pour Tous <onboarding@resend.dev>";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderLeadEmailHtml(lead: LeadFormValues) {
  const rows: [string, string][] = [
    ["Prénom", lead.prenom],
    ["Nom", lead.nom],
    ["Email", lead.email],
    ["Téléphone", lead.telephone],
    ["Adresse", lead.adresse],
    ["Code postal", lead.codePostal],
    ["Ville", lead.ville],
    ["Type de logement", lead.typeLogement],
    ["Statut d'occupation", lead.statutOccupation],
    ["Surface de toiture (m²)", lead.surfaceToiture],
    ["Facture d'électricité mensuelle (€)", lead.factureMensuelle],
    ["Revenu fiscal de référence (€)", lead.revenuFiscal],
  ];

  return `
    <h2>Nouvelle demande d'étude solaire</h2>
    <table cellpadding="6" style="border-collapse: collapse;">
      ${rows
        .map(
          ([label, value]) => `
        <tr>
          <td style="border-bottom:1px solid #eee;"><strong>${escapeHtml(label)}</strong></td>
          <td style="border-bottom:1px solid #eee;">${escapeHtml(value)}</td>
        </tr>`
        )
        .join("")}
    </table>
  `;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = leadFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const lead = parsed.data;

  if (resend) {
    const { error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: LEAD_NOTIFICATION_EMAIL,
      replyTo: lead.email,
      subject: `Nouveau prospect solaire — ${lead.prenom} ${lead.nom} (${lead.ville})`,
      html: renderLeadEmailHtml(lead),
    });

    if (error) {
      console.error("[lead] échec de l'envoi de l'email de notification:", error.message);
    }
  } else {
    console.warn(
      "[lead] RESEND_API_KEY absente : email de notification non envoyé."
    );
  }

  return NextResponse.json({ ok: true });
}
