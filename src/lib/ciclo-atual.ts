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
export async function lerCicloAtual(opts?: { revalidar?: number }): Promise<CicloAtual> {
    /* `revalidar` troca no-store por ISR. O webhook de compra lê sem opção
       (dado fresco, é ele que manda a data no e-mail); a LP passa segundos e
       volta a ser pré-renderizada, que é o que o tráfego pago exige. */
    const fallback: CicloAtual = {
        dataInicio: "2026-09-21",
        linkGrupo: "https://chat.whatsapp.com/F3fKDtOH98MBbgkSroDt2G",
    };
    try {
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/ciclo_atual?id=eq.true&select=data_inicio,link_grupo&limit=1`,
            opts?.revalidar
                ? { headers: sbHeaders(), next: { revalidate: opts.revalidar } }
                : { headers: sbHeaders(), cache: "no-store" },
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

/* ============================================================================
 *  DATAS PRONTAS PRA EXIBIÇÃO NA LP
 * ----------------------------------------------------------------------------
 *  A LP precisa de data cravada: é onde a pessoa decide comprar, e "segunda que
 *  vem" não responde "segunda que vem QUAL?" pra quem cai de anúncio numa
 *  sexta. A regra de 27/07 que proíbe data cravada vale pro CRIATIVO, que é
 *  reaproveitado entre ciclos sem reedição. A página é servida na hora e pode
 *  dizer a data exata sem custo nenhum.
 *
 *  Por isso a data sai daqui e não de string escrita à mão no componente: o
 *  ciclo roda toda segunda, e data hardcoded em .tsx foi exatamente o bug de
 *  27/07 (a LP do Desafio anunciava uma semana que já tinha sido adiada).
 * ==========================================================================*/

const MESES = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

export type CicloFormatado = {
    /** "21/09" — a segunda da Aula 1 */
    inicio: string;
    /** "21 de setembro" — para frase corrida ("Segunda, dia 21 de setembro") */
    inicioExtenso: string;
    /** "21 a 25 de setembro" — a semana de aulas, pro eyebrow */
    faixa: string;
    /** ["21/09", ... "25/09"] — na ordem de `compartilhado.dias` */
    aulas: string[];
    /** "26/09" — janela de dúvidas no grupo */
    duvidas: string;
    /** "27/09" — apresentação do backend */
    apresentacao: string;
};

/** Lê "2026-09-21" em UTC de propósito: `new Date("2026-09-21")` já é UTC, e
 *  formatar com getDate() local devolveria 20/09 em GMT-3. */
export function formatarCiclo(dataInicio: string): CicloFormatado {
    const [a, m, d] = dataInicio.split("-").map(Number);
    const d0 = new Date(Date.UTC(a, m - 1, d));
    const em = (n: number) => new Date(d0.getTime() + n * 86400000);
    const curta = (x: Date) =>
        `${String(x.getUTCDate()).padStart(2, "0")}/${String(x.getUTCMonth() + 1).padStart(2, "0")}`;

    const sexta = em(4);
    const mesmoMes = sexta.getUTCMonth() === d0.getUTCMonth();
    const faixa = mesmoMes
        ? `${d0.getUTCDate()} a ${sexta.getUTCDate()} de ${MESES[d0.getUTCMonth()]}`
        : `${d0.getUTCDate()} de ${MESES[d0.getUTCMonth()]} a ${sexta.getUTCDate()} de ${MESES[sexta.getUTCMonth()]}`;

    return {
        inicio: curta(d0),
        inicioExtenso: `${d0.getUTCDate()} de ${MESES[d0.getUTCMonth()]}`,
        faixa,
        aulas: [0, 1, 2, 3, 4].map((n) => curta(em(n))),
        duvidas: curta(em(5)),
        apresentacao: curta(em(6)),
    };
}
