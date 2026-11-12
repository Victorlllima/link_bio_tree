// ============================================================
// EDIÇÕES DA IMERSÃO ARQUITETO DE AGENTES — uma linha por edição, sem código.
// A edição 2 entra acrescentando um objeto em EDICOES (ids, datas, lotes, metas).
// Fonte dos fatos da edição 1: HERMES/2-PRODUTO/imersao/QG-IMERSAO.md (1.1 a 1.5).
// Sem segredo aqui: este arquivo vai para o cliente.
// ============================================================

export interface LoteCfg {
  n: number;
  preco: number;
  ini: string; // YYYY-MM-DD (vira à 00h, -03:00)
  fim: string | null; // último dia do lote; null = até o evento
  oferta: string;
}

export interface EdicaoCfg {
  id: string; // "ims-1"
  numero: number;
  nome: string;
  noite1: string; // YYYY-MM-DD
  noite2: string;
  carrinhoFecha: string; // ISO com fuso
  captacaoIni: string; // primeiro dia de venda do ingresso
  gastoIni: string; // primeiro dia de gasto da campanha
  produtos: { ingresso: string; bumps: { id: string; nome: string; preco: number; exclusivo?: boolean }[] };
  campanha: { id: string; nome: string; conjuntos: { id: string; nome: string }[] };
  lotes: LoteCfg[];
  precoIngressoPadrao: number;
  metas: { cpaMeta: number; cpaCorte: number; ctrMinLink: number; impMinJulgar: number; verbaDia: number; ingressosMeta: number | null };
}

export const EDICOES: EdicaoCfg[] = [
  {
    id: "ims-1",
    numero: 1,
    nome: "Imersão 1 · 25 e 26/nov",
    noite1: "2026-11-25",
    noite2: "2026-11-26",
    carrinhoFecha: "2026-11-30T23:59:00-03:00",
    captacaoIni: "2026-11-03",
    gastoIni: "2026-11-04",
    produtos: {
      ingresso: "8852419",
      bumps: [
        { id: "8852453", nome: "Gravação da Imersão", preco: 197, exclusivo: true },
        { id: "8551609", nome: "50 casos de uso", preco: 37 },
        { id: "8551624", nome: "Segundo cérebro", preco: 47 },
        { id: "8551535", nome: "Os 100 melhores plugins", preco: 27 },
      ],
    },
    campanha: {
      id: "120250898290330175",
      nome: "IMS_041126_VEN_001",
      conjuntos: [
        { id: "120250898295650175", nome: "Quente" },
        { id: "120250898296070175", nome: "Frio" },
      ],
    },
    lotes: [
      { n: 1, preco: 44, ini: "2026-11-03", fim: "2026-11-12", oferta: "sn552kkr" },
      { n: 2, preco: 47, ini: "2026-11-13", fim: "2026-11-19", oferta: "2q6t3s89" },
      { n: 3, preco: 52, ini: "2026-11-20", fim: null, oferta: "95tgc1no" },
    ],
    precoIngressoPadrao: 44,
    // meta ~R$48 e corte R$67 no lote 1 (QG 1.5, ok do Red em 04/11); ingressosMeta 50 = meta da Turma 1 (Red, 07/11, QG 1.5); o resto vem da régua da ZENITH (corte.py)
    metas: { cpaMeta: 48, cpaCorte: 67, ctrMinLink: 0.6, impMinJulgar: 5000, verbaDia: 250, ingressosMeta: 50 },
  },
];
