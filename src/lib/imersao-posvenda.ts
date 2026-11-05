/**
 * Pós-compra da Imersão Arquiteto de Agentes (ingresso 8852419). Adaptação do que o webhook já faz
 * para a Hermes Week (ION, 05/11/2026).
 *
 * TRAVA DE ENVIO: os e-mails abaixo são TEXTO PROVISÓRIO (a BEACON adapta os da Week).
 * `EMAIL_APROVADO_PELO_RED` fica `false` até o Red aprovar o texto; só então um commit vira para `true`.
 * Com `false`, nenhum e-mail da Imersão sai para aluno. O aviso no Telegram não depende desta trava.
 */
import { primeiroNome } from "./wpp-humanizar";
import type { ImersaoConfig } from "./imersao-config";

export const PRODUTO_IMERSAO_INGRESSO = "8852419";
export const EMAIL_APROVADO_PELO_RED = false;

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

/** E-MAIL 1: confirmação imediata. Texto provisório. */
export function emailConfirmacaoImersao(nome: string, cfg: Pick<ImersaoConfig, "linkGrupo" | "linkPreinstalacao">) {
    const p = primeiroNome(nome) || "Arquiteto";
    const grupo = cfg.linkGrupo
        ? `<p style="font-size:14.5px;line-height:1.55;color:#a3a3a3;margin:0 0 14px">É no grupo que chegam os avisos e o link da sala.</p>${botao(cfg.linkGrupo, "👉 Entrar no grupo", "#25D366")}`
        : `<p style="font-size:14.5px;line-height:1.55;color:#a3a3a3;margin:0">O link do grupo chega por e-mail em breve. Qualquer dúvida: suporte@redpro.com.br.</p>`;
    const pre = cfg.linkPreinstalacao
        ? `<p style="font-size:14.5px;line-height:1.55;color:#a3a3a3;margin:0 0 14px">Deixa o computador pronto antes da primeira noite.</p>${botao(cfg.linkPreinstalacao, "Fazer a pré-instalação")}`
        : "";
    const html = moldura(`
      <h1 style="font-size:24px;font-weight:800;margin:0 0 18px;line-height:1.3">Fala, ${p}.</h1>
      <p style="font-size:16px;line-height:1.6;color:#c9c9c9;margin:0 0 16px">Seu ingresso da <strong style="color:#fff">Imersão Arquiteto de Agentes</strong> está confirmado.</p>
      <p style="font-size:15px;line-height:1.6;color:#c9c9c9;margin:0 0 22px"><strong style="color:#fff">Quarta 25/11 e quinta 26/11, das 19h às 22h (horário de Brasília).</strong> A sala abre às 18h45.</p>
      <div style="background:#141414;border:1px solid #1f1f1f;border-radius:12px;padding:20px 22px;margin:0 0 14px">
        <p style="font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#8a8a8a;margin:0 0 10px">Entra no grupo</p>${grupo}
      </div>${pre ? `
      <div style="background:#141414;border:1px solid rgba(232,163,61,.42);border-radius:12px;padding:20px 22px;margin:0 0 14px">${pre}
      </div>` : ""}
      <div style="background:#141414;border:1px solid #1f1f1f;border-radius:12px;padding:20px 22px;margin:0 0 22px">
        <p style="font-size:14.5px;line-height:1.55;color:#a3a3a3;margin:0 0 14px">Salva as duas noites na sua agenda.</p>${botao(AGENDA_ICS, "Salvar na agenda", "#f5f5f5")}
      </div>
      <p style="font-size:14px;line-height:1.6;color:#8a8a8a;margin:0 0 20px">Tudo isso também está em ${OBRIGADO.replace("https://", "")}.</p>
      <p style="font-size:15px;color:#c9c9c9;margin:0">Te vejo na quarta.<br><strong style="color:#fff">Red</strong></p>`);
    return { subject: "Você tá dentro: Imersão Arquiteto de Agentes, 25 e 26/11, 19h", html };
}

/** E-MAIL 2: boas-vindas e contexto, agendado D+1 09h BRT. Texto provisório. */
export function emailBoasVindasImersao(nome: string, cfg: Pick<ImersaoConfig, "linkGrupo">) {
    const p = primeiroNome(nome) || "Arquiteto";
    const grupo = cfg.linkGrupo
        ? `<div style="background:#141414;border:1px solid #1f1f1f;border-radius:12px;padding:20px 22px;margin:0 0 22px"><p style="font-size:14.5px;line-height:1.55;color:#a3a3a3;margin:0 0 14px">Se ainda não entrou no grupo, entra agora. É por lá que o link da sala chega.</p>${botao(cfg.linkGrupo, "👉 Entrar no grupo", "#25D366")}</div>`
        : "";
    const html = moldura(`
      <h1 style="font-size:22px;font-weight:800;margin:0 0 18px;line-height:1.3">Fala ${p}.</h1>
      <p style="font-size:16px;line-height:1.6;color:#c9c9c9;margin:0 0 16px">Passando para te lembrar das duas noites da Imersão: quarta 25/11 e quinta 26/11, às 19h.</p>
      <p style="font-size:15px;line-height:1.6;color:#c9c9c9;margin:0 0 22px">Vai ser ao vivo, com a gente construindo junto. Deixa o computador por perto.</p>${grupo}
      <p style="font-size:15px;color:#c9c9c9;margin:0">Até lá.<br><strong style="color:#fff">Red</strong></p>`);
    return { subject: "O que esperar da Imersão", html };
}
