/**
 * Config viva da Imersão: tabela singleton `imersao_config` no Supabase (fetch cru ao PostgREST,
 * mesmo padrão de ciclo-atual.ts). Campos: lote_forcado, limite_lote, link_grupo,
 * link_preinstalacao, encerrado. Qualquer falha cai no fallback, e quem manda é o calendário
 * de lote.ts.
 *
 * "% vendido" só existe com limite real (limite_lote) e contagem real em imersao_inscritos.
 * Sem os dois, vendidoPct é null e a página não mostra barra.
 */
const SUPABASE_URL = "https://supabase.redpro.com.br";

const headers = () => {
    const key = process.env.SUPABASE_SERVICE_KEY!;
    return { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
};

export type ImersaoConfig = {
    loteForcado: number | null;
    limiteLote: number | null;
    linkGrupo: string;
    linkPreinstalacao: string;
    encerrado: boolean;
};

const FALLBACK: ImersaoConfig = { loteForcado: null, limiteLote: null, linkGrupo: "", linkPreinstalacao: "", encerrado: false };

export async function lerImersaoConfig(revalidar = 60): Promise<ImersaoConfig> {
    try {
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/imersao_config?select=lote_forcado,limite_lote,link_grupo,link_preinstalacao,encerrado&limit=1`,
            { headers: headers(), next: { revalidate: revalidar } },
        );
        if (!res.ok) return FALLBACK;
        const rows = await res.json();
        const r = Array.isArray(rows) && rows[0];
        if (!r) return FALLBACK;
        return {
            loteForcado: r.lote_forcado ?? null,
            limiteLote: r.limite_lote ?? null,
            linkGrupo: r.link_grupo ?? "",
            linkPreinstalacao: r.link_preinstalacao ?? "",
            encerrado: Boolean(r.encerrado),
        };
    } catch {
        return FALLBACK;
    }
}

/** Inscritos do lote (tabela do ION). Null se não der para contar de verdade. */
export async function contarInscritosDoLote(lote: number, revalidar = 60): Promise<number | null> {
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/imersao_inscritos?select=id&lote=eq.${lote}`, {
            headers: { ...headers(), Prefer: "count=exact", Range: "0-0" },
            next: { revalidate: revalidar },
        });
        if (!res.ok) return null;
        const total = res.headers.get("content-range")?.split("/")[1];
        const n = total ? Number(total) : NaN;
        return Number.isFinite(n) ? n : null;
    } catch {
        return null;
    }
}
