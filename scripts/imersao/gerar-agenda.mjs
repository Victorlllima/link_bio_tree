#!/usr/bin/env node
/**
 * Gera o JSON de lembretes de grupo da Imersão no formato de `agenda.js carregar` (Starlight/HERMES/automacao-vps).
 * NÃO escreve no banco e NÃO aprova nada: tudo sai com aprovado=false. Quem carrega e aprova é o ION, com o ok do Red.
 *
 * Uso: node scripts/imersao/gerar-agenda.mjs --jid 1203630xxxxxxxxx@g.us > agenda-imersao.json
 * Os textos são RASCUNHO. O link da sala é placeholder ([LINK-SALA]): o agenda.js recusa a linha enquanto ele não for trocado.
 * Regras do QG: no máximo 1 mensagem por dia no grupo; nada no domingo 08/11 entre 15h e 22h.
 */
const i = process.argv.indexOf("--jid");
const jid = i >= 0 ? process.argv[i + 1] : "";
if (!jid.endsWith("@g.us")) { console.error("passe --jid <grupo>@g.us (o grupo 'Imersão Arquiteto de Agentes', vindo da AMANDA)"); process.exit(2); }

const L = (rotulo, quando, texto) => ({ rotulo: `IMERSAO ${rotulo} (RASCUNHO)`, quando, tipo: "msg", jid, texto, aprovado: false });
const itens = [
  L("D-5", "2026-11-20T12:00:00-03:00",
`Faltam 5 dias para a Imersão Arquiteto de Agentes.

- Quarta 25/11 e quinta 26/11
- Das 19h às 22h, horário de Brasília
- Ao vivo, com a gente construindo junto

Deixa o computador por perto. O link da sala chega aqui, no dia.`),
  L("D-3", "2026-11-22T12:00:00-03:00",
`Faltam 3 dias para a Imersão.

Se ainda não salvou as duas noites na agenda, salva agora: https://www.redpro.com.br/imersao/agenda.ics`),
  L("D-1", "2026-11-24T12:00:00-03:00",
`A Imersão começa amanhã, às 19h.

A sala abre às 18h45. O link chega aqui, no grupo, amanhã.`),
  L("dia 25/11 noite 1", "2026-11-25T18:45:00-03:00",
`A sala da noite 1 abriu. Entra aqui: [LINK-SALA]

Começamos às 19h.`),
  L("dia 26/11 noite 2", "2026-11-26T18:45:00-03:00",
`A sala da noite 2 abriu. Entra aqui: [LINK-SALA]

Começamos às 19h.`),
];

// Trava do QG: pitch da última turma do produto anterior, domingo 08/11, 15h às 22h.
for (const it of itens) {
  const t = new Date(Date.parse(it.quando) - 3 * 3600_000);
  if (t.toISOString().slice(0, 10) === "2026-11-08" && t.getUTCHours() >= 15 && t.getUTCHours() < 22) throw new Error("lembrete cai no domingo 08/11 entre 15h e 22h: " + it.rotulo);
}
console.log(JSON.stringify(itens, null, 2));
