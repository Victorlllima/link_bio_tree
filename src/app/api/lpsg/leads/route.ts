import { NextResponse } from "next/server";
import { lpsgAutorizado } from "@/lib/lpsg-auth";

export const dynamic = "force-dynamic";

// Lê as duas fichas da Hermes Week para o painel /lpsg (aba "Leads").
// Protegido pelo mesmo gate de senha do painel (LPSG_PASSWORD via cookie) — ver /api/lpsg/auth.

const SUPABASE_URL = "https://supabase.redpro.com.br";

async function buscar(tabela: string, ordem: string) {
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!key) return [];
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/${tabela}?select=*&order=${ordem}&limit=1000`, {
            headers: { apikey: key, Authorization: `Bearer ${key}` },
            cache: "no-store",
        });
        if (!res.ok) {
            console.error(`leads: falha ao ler ${tabela} — ${res.status}`);
            return [];
        }
        return await res.json();
    } catch (e) {
        console.error(`leads: erro ao ler ${tabela} —`, e);
        return [];
    }
}

export async function GET(req: Request) {
    if (!lpsgAutorizado(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    // Os mais quentes primeiro na ficha de interesse; os mais recentes primeiro na matrícula.
    const [matriculas, status] = await Promise.all([
        buscar("hermes_week_matriculas", "criado_em.desc"),
        buscar("hermes_week_interesse", "score.desc,criado_em.desc"),
    ]);

    return NextResponse.json({ ok: true, matriculas, status });
}
