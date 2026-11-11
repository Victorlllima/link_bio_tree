/* Lote vigente da Imersão, calculado por data (Brasília, -03:00) e por vendas.
   Fonte única de preço, rótulo, próximo preço, limite e oferta: página, checkout e pixel leem daqui.
   A tabela imersao_config pode forçar um lote (lote_forcado) ou encerrar as vendas.

   Virada (decisão do Red, 11/11): na data OU ao esgotar o limite do lote, o que vier primeiro.
   Limites 20/20/10. Acima de 50 abre o lote extra (4), que só entra por lote_forcado=4 ou quando
   o lote 3 esgota. Sem oferta na Hotmart, o lote extra não entra: a página segue no lote 3. */

export type Lote = {
    n: 1 | 2 | 3 | 4;
    preco: number;
    oferta: string;
    inicio: string;
    fim: string;
    /** ingressos do lote; ao esgotar, vira para o seguinte */
    limite: number;
    extra?: boolean;
};

export const LOTES: readonly Lote[] = [
    { n: 1, preco: 44, oferta: "sn552kkr", inicio: "2026-11-03T00:00:00-03:00", fim: "2026-11-16T00:00:00-03:00", limite: 20 },
    { n: 2, preco: 53, oferta: "2q6t3s89", inicio: "2026-11-16T00:00:00-03:00", fim: "2026-11-20T00:00:00-03:00", limite: 20 },
    { n: 3, preco: 62, oferta: "95tgc1no", inicio: "2026-11-20T00:00:00-03:00", fim: "2026-11-25T19:00:00-03:00", limite: 10 },
];

/* Lote extra (acima de 50 ingressos). PENDENTE: a oferta de R$ 77 ainda não existe na Hotmart.
   Enquanto `oferta` estiver vazia, o lote extra nunca fica vigente (a página e o botão seguem no
   lote 3). Quando a MIRA criar a oferta, preencher aqui e no CASE da view imersao_inscritos
   (migração imersao_lote_extra_pre_checkout.sql). O limite de 10 é provisório: a barra recomeça nele. */
export const LOTE_EXTRA: Lote = {
    n: 4,
    preco: 77,
    oferta: "",
    inicio: "2026-11-03T00:00:00-03:00",
    fim: "2026-11-25T19:00:00-03:00",
    limite: 10,
    extra: true,
};

/** Preço do último lote regular: o "de" riscado quando o lote atual é mais barato. */
export const PRECO_CHEIO = Math.max(...LOTES.map((l) => l.preco));

export const EVENTO = {
    chip: "AO VIVO · 25 E 26 DE NOVEMBRO",
    extenso: "quarta 25 e quinta 26 de novembro",
    horario: "19h às 22h",
    noite1: "25/11",
    noite2: "26/11",
    noite1Inicio: "2026-11-25T19:00:00-03:00",
    noite1Fim: "2026-11-25T22:00:00-03:00",
    noite2Inicio: "2026-11-26T19:00:00-03:00",
    noite2Fim: "2026-11-26T22:00:00-03:00",
} as const;

const dm = (iso: string) =>
    new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit" }).format(new Date(iso));
const brl = (v: number) => `R$ ${v.toFixed(0)}`;
const diaAntes = (iso: string) => dm(new Date(new Date(iso).getTime() - 60_000).toISOString());

/** Vendidos por número de lote (contagem real, sem reembolso). Null = não deu para contar. */
export type VendidosPorLote = Record<number, number>;

export type OverrideLote = {
    loteForcado?: number | null;
    encerrado?: boolean;
    vendidos?: VendidosPorLote | null;
    /** imersao_config.limite_lote: se preenchido, substitui o limite de todos os lotes */
    limite?: number | null;
};

export const limiteDoLote = (l: Lote, limiteCfg?: number | null) => (limiteCfg && limiteCfg > 0 ? limiteCfg : l.limite);

const seguinte = (l: Lote): Lote | null => (l.extra ? null : LOTES.find((x) => x.n === l.n + 1) ?? LOTE_EXTRA);
const disponivel = (l: Lote) => Boolean(l.oferta);

/** Lote vigente. Antes de 03/11 vale o lote 1; depois do fim do lote 3 as vendas encerram. */
export function loteVigente(agora: Date = new Date(), o: OverrideLote = {}): { lote: Lote; encerrado: boolean } {
    const t = agora.getTime();
    const forcado = [...LOTES, LOTE_EXTRA].find((l) => l.n === o.loteForcado && disponivel(l));
    let lote = forcado ?? LOTES.find((l) => t < new Date(l.fim).getTime()) ?? LOTES[LOTES.length - 1];

    // virada por esgotar: só sem lote forçado e com contagem real
    if (!forcado && o.vendidos) {
        for (let prox = seguinte(lote); prox && disponivel(prox); prox = seguinte(lote)) {
            if ((o.vendidos[lote.n] ?? 0) < limiteDoLote(lote, o.limite)) break;
            lote = prox;
        }
    }
    const fimGeral = new Date(LOTES[LOTES.length - 1].fim).getTime();
    return { lote, encerrado: Boolean(o.encerrado) || t >= fimGeral };
}

/** % do lote vendido (0 a 100), ou null sem contagem real. */
export function pctVendido(l: Lote, vendidos: VendidosPorLote | null, limiteCfg?: number | null): number | null {
    if (!vendidos) return null;
    const n = vendidos[l.n] ?? 0;
    return Math.min(100, Math.round((n / limiteDoLote(l, limiteCfg)) * 100));
}

export type DadosLote = {
    n: number;
    rotulo: string;
    preco: string;
    precoNum: string;
    /** preço cheio riscado ("de R$ 62"), só quando o lote atual é mais barato */
    de: string | null;
    ate: string;
    proximoPreco: string | null;
    proximoA: string | null;
    vendidoPct: number | null;
};

export function dadosDoLote(l: Lote, vendidoPct: number | null): DadosLote {
    const prox = l.extra ? undefined : LOTES.find((x) => x.n === l.n + 1);
    return {
        n: l.n,
        rotulo: l.extra ? "Lote extra" : `Lote ${l.n} de ${LOTES.length}`,
        preco: brl(l.preco),
        precoNum: String(l.preco),
        de: l.preco < PRECO_CHEIO ? brl(PRECO_CHEIO) : null,
        ate: diaAntes(l.fim),
        proximoPreco: prox ? brl(prox.preco) : null,
        proximoA: prox ? dm(prox.inicio) : null,
        vendidoPct,
    };
}

export const listaLotes = () =>
    LOTES.map((l) => ({ n: l.n, de: dm(l.inicio), ate: diaAntes(l.fim), preco: brl(l.preco) }));
