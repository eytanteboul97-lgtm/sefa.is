import { NextResponse } from "next/server";
import { BoampError, searchNotices } from "@/lib/boamp";
import { parseProfile, scoreNotice, type ScoredNotice } from "@/lib/matching";

/**
 * Veille : avis BOAMP récents notés pour le profil passé en paramètres.
 * GET /api/marches?keywords=éclairage,LED&types=FOURNITURES&departments=69,01&minAmount=100000&days=21
 */

export type MarchesResponse =
  | {
      status: "ok";
      results: ScoredNotice[];
      meta: {
        scanned: number;
        totalAvailable: number;
        matched: number;
        amountUnknown: number;
        mode: "full-text" | "date-only";
        since: string;
        fetchedAt: string;
      };
    }
  | { status: "error"; message: string };

export async function GET(request: Request) {
  const params = Object.fromEntries(new URL(request.url).searchParams);
  const profile = parseProfile(params);

  try {
    const search = await searchNotices(profile);
    const results = search.notices
      .map((n) => scoreNotice(n, profile))
      .filter((n): n is ScoredNotice => n !== null)
      .sort((a, b) => b.score - a.score || (a.daysLeft ?? 999) - (b.daysLeft ?? 999));

    const body: MarchesResponse = {
      status: "ok",
      results,
      meta: {
        scanned: search.scanned,
        totalAvailable: search.totalAvailable,
        matched: results.length,
        amountUnknown: results.filter((r) => r.amount === null).length,
        mode: search.mode,
        since: search.since,
        fetchedAt: new Date().toISOString(),
      },
    };
    return NextResponse.json(body, { headers: { "Cache-Control": "public, max-age=300" } });
  } catch (err) {
    const detail = err instanceof BoampError ? err.message : err instanceof Error ? err.message : "erreur inconnue";
    console.error("[marches] Échec de la récupération BOAMP :", detail);
    const body: MarchesResponse = {
      status: "error",
      message: "Le BOAMP n'a pas pu être consulté pour le moment. Réessayez dans quelques minutes.",
    };
    return NextResponse.json(body, { status: 502 });
  }
}
