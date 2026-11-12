/**
 * Config viva da Imersão: tabela singleton `imersao_config` no Supabase (fetch cru ao PostgREST,
 * mesmo padrão de ciclo-atual.ts). Campos: lote_forcado, limite_lote, link_grupo,
 * link_preinstalacao, encerrado. Qualquer falha cai no fallback, e quem manda é o calendário
 * de lote.ts.
 *
 * "% vendido": contagem real de imersao_vendas_por_lote sobre o limite do lote (20/20/10 em
 * lote.ts, ou limite_lote se preenchido). Sem contagem, vendidoPct é null e a página não mostra barra.
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

/**
 * Vendas aprovadas por lote (view imersao_vendas_por_lote, sem reembolso, cancelamento ou
 * chargeback). Só contagem, nada de dado pessoal. Null se não der para contar de verdade:
 * aí a página esconde a barra e a virada fica só por data.
 */
export async function contarVendidosPorLote(revalidar = 60): Promise<Record<number, number> | null> {
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/imersao_vendas_por_lote?select=lote,vendidos`, {
            headers: headers(),
            next: { revalidate: revalidar },
        });
        if (!res.ok) return null;
        const rows = await res.json();
        if (!Array.isArray(rows)) return null;
        const out: Record<number, number> = {};
        for (const r of rows) {
            const lote = Number(r?.lote);
            const n = Number(r?.vendidos);
            if (Number.isInteger(lote) && Number.isFinite(n)) out[lote] = n;
        }
        return out;
    } catch {
        return null;
    }
}
