import { NextResponse } from "next/server";
import { buscarPicoAoVivo, buscarDuracaoMin, listarVideosDasAulas } from "@/lib/youtube";

// ============================================================
// CRON: lê hw_dash_youtube (qual vídeo é qual aula de cada ciclo) e grava
// o pico de presença ao vivo + a duração em hw_dash_manual — os mesmos
// campos (presenca_a{n}, duracao_a{n}) que antes só entravam na mão pela
// aba "Lançar números" do painel /dashboard.
// ============================================================

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SB = "https://supabase.redpro.com.br/rest/v1";
const CRON_SECRET = process.env.CRON_SECRET;

function sbHeaders() {
  const k = process.env.SUPABASE_SERVICE_KEY!;
  return { apikey: k, Authorization: `Bearer ${k}`, "Content-Type": "application/json" };
}

async function atualizar(): Promise<{ ok: boolean; atualizados: number; erros: string[] }> {
  const erros: string[] = [];
  const resMapa = await fetch(`${SB}/hw_dash_youtube?select=ciclo,aula_n,video_id`, {
    headers: sbHeaders(),
    cache: "no-store",
  });
  if (!resMapa.ok) return { ok: false, atualizados: 0, erros: [await resMapa.text()] };
  const manual = (await resMapa.json()) as { ciclo: string; aula_n: number; video_id: string }[];

  // Playlists por ciclo ("Hermes Week - 12 a 19/10"): descobre sozinho qual vídeo é qual aula de qual ciclo.
  // A tabela hw_dash_youtube, se tiver a linha, manda mais que a descoberta (correção manual).
  const mapaPorChave = new Map<string, { ciclo: string; aula_n: number; video_id: string }>();
  try {
    for (const v of await listarVideosDasAulas()) mapaPorChave.set(`${v.ciclo}#${v.aula_n}`, v);
  } catch (e) {
    erros.push(`playlists: ${String((e as Error).message || e)}`);
  }
  const descobertos = [...mapaPorChave.values()].map((v) => ({ ciclo: v.ciclo, aula_n: v.aula_n, video_id: v.video_id }));
  for (const m of manual) mapaPorChave.set(`${m.ciclo}#${m.aula_n}`, m);
  const mapa = [...mapaPorChave.values()];
  if (descobertos.length) {
    // grava o que descobriu (sem sobrescrever correção manual) para o painel e a equipe verem o mapa
    await fetch(`${SB}/hw_dash_youtube?on_conflict=ciclo,aula_n`, {
      method: "POST",
      headers: { ...sbHeaders(), Prefer: "resolution=ignore-duplicates,return=minimal" },
      body: JSON.stringify(descobertos),
    }).catch(() => null);
  }

  const gravar: { ciclo: string; chave: string; valor: number; atualizado_em: string }[] = [];
  for (const m of mapa) {
    try {
      // o pico é do dia em que a aula foi ao ar: D0 + (n-1); a apresentação (6) é o domingo, D0 + 6
      const diaAula = new Date(new Date(`${m.ciclo}T12:00:00Z`).getTime() + (m.aula_n === 6 ? 6 : m.aula_n - 1) * 86400000).toISOString().slice(0, 10);
      if (diaAula > new Date().toISOString().slice(0, 10)) continue; // aula que ainda não foi ao ar
      const [pico, duracao] = await Promise.all([
        buscarPicoAoVivo(m.video_id, diaAula),
        buscarDuracaoMin(m.video_id),
      ]);
      const agora = new Date().toISOString();
      // a Analytics demora ~48h: pico 0 de aula recente é dado que ainda não chegou, não presença zero
      const recente = diaAula >= new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10);
      if (pico !== null && !(pico === 0 && recente)) gravar.push({ ciclo: m.ciclo, chave: `presenca_a${m.aula_n}`, valor: pico, atualizado_em: agora });
      if (duracao !== null) gravar.push({ ciclo: m.ciclo, chave: `duracao_a${m.aula_n}`, valor: duracao, atualizado_em: agora });
    } catch (e) {
      erros.push(`${m.ciclo} aula ${m.aula_n}: ${String((e as Error).message || e)}`);
    }
  }

  if (gravar.length) {
    const r = await fetch(`${SB}/hw_dash_manual?on_conflict=ciclo,chave`, {
      method: "POST",
      headers: { ...sbHeaders(), Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(gravar),
    });
    if (!r.ok) erros.push(await r.text());
  }

  return { ok: erros.length === 0, atualizados: gravar.length, erros };
}

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (CRON_SECRET && auth !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const r = await atualizar();
  console.log("[CRON dashboard-youtube]", JSON.stringify(r));
  return NextResponse.json(r, { status: r.ok ? 200 : 502 });
}
