/**
 * Leitura do estado singleton do ciclo vigente da Hermes Week.
 *
 * A tabela `ciclo_atual` (ver src/app/hermes-week/ciclo_atual.sql) guarda uma
 * linha só, escrita pelo Alfred toda sexta-feira. Mesma mecânica de
 * fetch cru ao PostgREST usada em wpp-health/route.ts — sem client dedicado
 * do Supabase neste repositório.
 */

const SUPABASE_URL = "https://supabase.redpro.com.br";

function sbHeaders() {
    const key = process.env.SUPABASE_SERVICE_KEY!;
    return { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

export type CicloAtual = { dataInicio: string; linkGrupo: string };

/**
 * Retorna o ciclo vigente. Se a tabela ainda não tiver linha (ou a leitura
 * falhar), cai no fallback abaixo — evita quebrar o e-mail de compra por
 * causa de uma tabela vazia, mas o fallback precisa ser atualizado junto
 * com o primeiro seed real (ver ciclo_atual.sql).
 */
export async function lerCicloAtual(): Promise<CicloAtual> {
    const fallback: CicloAtual = {
        dataInicio: "2026-09-14",
        linkGrupo: "https://chat.whatsapp.com/F3fKDtOH98MBbgkSroDt2G",
    };
    try {
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/ciclo_atual?id=eq.true&select=data_inicio,link_grupo&limit=1`,
            { headers: sbHeaders(), cache: "no-store" },
        );
        if (!res.ok) return fallback;
        const rows = await res.json();
        const row = Array.isArray(rows) && rows[0];
        if (!row) return fallback;
        return { dataInicio: row.data_inicio, linkGrupo: row.link_grupo };
    } catch {
        return fallback;
    }
}
