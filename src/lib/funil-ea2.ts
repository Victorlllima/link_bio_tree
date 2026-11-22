// Funil de upsell EA² (Red, 22/11/2026). Classifica a compra pela oferta, registra no Supabase
// e diz se é o upsell 2 (consultoria), que avisa NETO e Rigel e marca o aluno para a Amanda não responder sozinha.
export type EtapaEa2 = "ea2_oferta1" | "ea2_oferta2" | "upsell1_fa2" | "upsell2_consultoria" | "fa2_avulsa" | "fa2_renovacao" | "ea2_ingresso";

export const OFERTAS_EA2: Record<string, { etapa: EtapaEa2; valor: number }> = {
    "4vj21bfg": { etapa: "ea2_oferta1", valor: 1250 },
    "24mnfz2e": { etapa: "ea2_oferta2", valor: 1500 },
    "ioehae1s": { etapa: "upsell1_fa2", valor: 4750 }, // Purchase de R$4.750 (diferença paga no upsell 1)
    "gig2ersp": { etapa: "upsell2_consultoria", valor: 12500 },
    "fo6p6zkb": { etapa: "fa2_avulsa", valor: 8000 },
    "l23ajx77": { etapa: "fa2_renovacao", valor: 5000 },
};
export const PRODUTOS_FUNIL_EA2 = new Set(["8660306", "9039408", "9039445"]);

export function classificarEa2(produtoId: string, oferta: string) {
    if (!PRODUTOS_FUNIL_EA2.has(produtoId)) return null;
    const o = OFERTAS_EA2[oferta];
    return o ? { ...o, conhecida: true } : { etapa: "oferta_desconhecida" as const, valor: 0, conhecida: false };
}

export async function registrarFunilEa2(supabaseUrl: string, row: Record<string, unknown>) {
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!key) return { ok: false, erro: "SUPABASE_SERVICE_KEY ausente" };
    try {
        const r = await fetch(`${supabaseUrl}/rest/v1/funil_ea2_eventos?on_conflict=transacao,evento`, {
            method: "POST",
            headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" },
            body: JSON.stringify(row),
        });
        return r.ok ? { ok: true } : { ok: false, erro: `${r.status} ${await r.text()}` };
    } catch (e) {
        return { ok: false, erro: String(e) };
    }
}
