/**
 * Pós-compra da Imersão Arquiteto de Agentes (ingresso 8852419). Adaptação do que o webhook já faz
 * para a Hermes Week (ION, 05/11/2026).
 *
 * TRAVA DE ENVIO: `EMAIL_APROVADO_PELO_RED` (true só para o e-mail 1, ok do Red 05/11). Sem link do grupo ou com
 * reembolso/chargeback da transação, o e-mail não sai. O aviso no Telegram não depende desta trava.
 */
import { primeiroNome } from "./wpp-humanizar";
import type { ImersaoConfig } from "./imersao-config";

export const PRODUTO_IMERSAO_INGRESSO = "8852419";
/** Ok do Red em 05/11/2026 só para o e-mail 1. O e-mail 2 (D+1) NÃO foi aprovado e não existe mais no código. */
export const EMAIL_APROVADO_PELO_RED = true;

/** Início da noite 1 (25/11, 19h BRT). O e-mail 2 (D+1) só é agendado se cair antes de a sala abrir. */
const INICIO_EVENTO = Date.parse("2026-11-25T18:45:00-03:00");
const AGENDA_ICS = "https://www.redpro.com.br/imersao/agenda.ics";
const OBRIGADO = "https://www.redpro.com.br/imersao/obrigado";

/** Ofertas do ingresso → lote e preço (QG-IMERSAO 1.2). */
const LOTES: Record<string, { lote: number; preco: number }> = {
    sn552kkr: { lote: 1, preco: 44 },
    "2q6t3s89": { lote: 2, preco: 53 },
    "95tgc1no": { lote: 3, preco: 62 },
};

export function loteDaOferta(codigo: string): { lote: number; preco: number } | null {
    return LOTES[codigo] ?? null;
}

/** 09h BRT do dia seguinte, ou null se isso cair depois de a sala abrir (compra em cima do evento). */
export function agendamentoD1Imersao(agora: number = Date.now()): string | null {
    const brt = new Date(agora - 3 * 3600_000);
    brt.setUTCDate(brt.getUTCDate() + 1);
    const y = brt.getUTCFullYear();
    const m = String(brt.getUTCMonth() + 1).padStart(2, "0");
    const d = String(brt.getUTCDate()).padStart(2, "0");
    const iso = `${y}-${m}-${d}T09:00:00-03:00`;
    return Date.parse(iso) < INICIO_EVENTO ? iso : null;
}

const botao = (href: string, rotulo: string, cor = "#E8A33D") =>
    `<a href="${href}" style="display:inline-block;background:${cor};color:#0a0a0a;font-weight:800;font-size:15px;padding:12px 24px;border-radius:10px;text-decoration:none">${rotulo}</a>`;

const moldura = (corpo: string) => `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:520px;margin:0 auto;background:#080808;color:#f5f5f5;padding:36px 28px;border-radius:16px">${corpo}
    </div>`;

/** E-MAIL 1: confirmação imediata. Texto A da BEACON (posto-BEACON-2/resposta.md), com os 2 cortes do Red de 05/11
 *  (sem o passo da pré-instalação, sem a frase "Uma pessoa lê."). Palavras literais. */
export const ASSUNTO_CONFIRMACAO = "Sua vaga na Imersão está confirmada (25 e 26/11, 19h)";
export const PRECABECALHO_CONFIRMACAO = "Entre no grupo da turma agora. É por lá que saem os avisos.";

const esc = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const P = "font-size:15px;line-height:1.6;color:#c9c9c9;margin:0 0 14px";
const link = (href: string) => `<a href="${href}" style="color:#E8A33D">${href}</a>`;

/** Devolve null se não há link do grupo: o e-mail não sai sem ele (regra do Red, 05/11). */
export function emailConfirmacaoImersao(nome: string, cfg: Pick<ImersaoConfig, "linkGrupo">) {
    if (!cfg.linkGrupo) return null;
    const p = primeiroNome(nome);
    const html = `<span style="display:none;max-height:0;overflow:hidden;opacity:0">${PRECABECALHO_CONFIRMACAO}</span>` + moldura(`
      <p style="${P}">${p ? `Oi, ${esc(p)}.` : "Oi,"}</p>
      <p style="${P}">Deu certo: sua vaga na Imersão Arquiteto de Agentes está garantida.</p>
      <p style="${P};margin-bottom:6px"><strong style="color:#fff">Quando:</strong></p>
      <ul style="${P};padding-left:20px">
        <li>Quarta, 25/11, das 19h às 22h</li>
        <li>Quinta, 26/11, das 19h às 22h</li>
        <li>Horário de Brasília. A sala abre 15 minutos antes, às 18h45.</li>
      </ul>
      <p style="${P}"><strong style="color:#fff">Faça agora, em 2 passos (leva uns 2 minutos):</strong></p>
      <ol style="${P};padding-left:20px">
        <li style="margin-bottom:10px"><strong style="color:#fff">Entre no grupo da turma:</strong> ${link(cfg.linkGrupo)}<br>É onde eu aviso tudo e onde você tira dúvida antes do evento.</li>
        <li><strong style="color:#fff">Coloque as duas noites na sua agenda:</strong> ${link(OBRIGADO)} (o botão "Adicionar à agenda" baixa o arquivo .ics com as duas datas).</li>
      </ol>
      <p style="${P}">O link da transmissão chega por e-mail e no grupo perto do evento. Não precisa guardar nada agora.</p>
      <p style="${P}">Qualquer problema (pagamento, acesso, link que não abriu), responda este e-mail ou escreva para suporte@redpro.com.br.</p>
      <p style="${P}">Nos vemos na quarta.</p>
      <p style="font-size:15px;color:#fff;font-weight:700;margin:0">Red</p>`);
    return { subject: ASSUNTO_CONFIRMACAO, html };
}

