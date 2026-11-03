/* Lote vigente da Imersão, calculado por data (Brasília, -03:00).
   Fonte única de preço, rótulo, próximo preço e oferta: página, checkout e pixel leem daqui.
   A tabela imersao_config pode forçar um lote (lote_forcado) ou encerrar as vendas; sem ela,
   vale só o calendário abaixo. */

export type Lote = { n: 1 | 2 | 3; preco: number; oferta: string; inicio: string; fim: string };

export const LOTES: readonly Lote[] = [
    { n: 1, preco: 44, oferta: "sn552kkr", inicio: "2026-11-03T00:00:00-03:00", fim: "2026-11-13T00:00:00-03:00" },
    { n: 2, preco: 53, oferta: "2q6t3s89", inicio: "2026-11-13T00:00:00-03:00", fim: "2026-11-20T00:00:00-03:00" },
    { n: 3, preco: 62, oferta: "95tgc1no", inicio: "2026-11-20T00:00:00-03:00", fim: "2026-11-25T19:00:00-03:00" },
];

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

export type OverrideLote = { loteForcado?: number | null; encerrado?: boolean };

/** Lote vigente. Antes de 03/11 vale o lote 1; depois do fim do lote 3 as vendas encerram. */
export function loteVigente(agora: Date = new Date(), o: OverrideLote = {}): { lote: Lote; encerrado: boolean } {
    const t = agora.getTime();
    const forcado = LOTES.find((l) => l.n === o.loteForcado);
    const porData = LOTES.find((l) => t < new Date(l.fim).getTime()) ?? LOTES[LOTES.length - 1];
    const fimGeral = new Date(LOTES[LOTES.length - 1].fim).getTime();
    return { lote: forcado ?? porData, encerrado: Boolean(o.encerrado) || t >= fimGeral };
}

export type DadosLote = {
    n: number;
    rotulo: string;
    preco: string;
    precoNum: string;
    ate: string;
    proximoPreco: string | null;
    proximoA: string | null;
    vendidoPct: number | null;
};

export function dadosDoLote(l: Lote, vendidoPct: number | null): DadosLote {
    const prox = LOTES.find((x) => x.n === l.n + 1);
    return {
        n: l.n,
        rotulo: `Lote ${l.n} de ${LOTES.length}`,
        preco: brl(l.preco),
        precoNum: String(l.preco),
        ate: diaAntes(l.fim),
        proximoPreco: prox ? brl(prox.preco) : null,
        proximoA: prox ? dm(prox.inicio) : null,
        vendidoPct,
    };
}

export const listaLotes = () =>
    LOTES.map((l) => ({ n: l.n, de: dm(l.inicio), ate: diaAntes(l.fim), preco: brl(l.preco) }));
