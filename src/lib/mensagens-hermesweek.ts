/**
 * Mensagens da Hermes Week.
 *
 * Diferente do mensagens-crmweek.ts (funil antigo, em standby), os dois
 * valores que mudam a cada ciclo semanal — data de início e link do grupo —
 * NÃO são constantes fixas aqui. Eles vêm da tabela `ciclo_atual` no
 * Supabase, escrita pelo Alfred toda sexta-feira (ver
 * HERMES/CHECKLIST-VIRADA-CICLO.md no repo Starlight).
 *
 * Regras de formato (skill `mensageria-lancamento`, Método Tabari):
 *  1. Bullets com `-`, nunca `•`.
 *  2. Zero travessão — usar "...", vírgula ou quebra de linha.
 *  3. Nunca inventar número, depoimento ou resultado.
 */

import { primeiroNome } from "./wpp-humanizar";

export { primeiroNome };

export type CicloAtual = {
    dataInicio: string; // formato "DD/MM" pronto pra exibição, já convertido de date
    linkGrupo: string;
};

/**
 * Ficha de matrícula (passo 2 do Tabari: "1. confirma e-mail · 2. FICHA · 3. grupo").
 *
 * URL fixa: a Hermes Week é LPSG semanal e a mesma página serve todos os
 * ciclos. O ciclo é resolvido do lado do servidor, por `ciclo_atual`, na
 * rota /api/hermes-week-matricula. Não trocar a cada semana.
 */
export const MATRICULA_URL = "https://www.redpro.com.br/hermes-week/matricula";

/**
 * Formata a data de início do ciclo (vinda como "YYYY-MM-DD" do Postgres)
 * em "segunda-feira, DD/MM" — ex: "segunda-feira, 21/09".
 */
export function formatarDataInicio(dataIsoOuBr: string): string {
    const data = new Date(`${dataIsoOuBr}T00:00:00-03:00`);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    return `segunda-feira, ${dia}/${mes}`;
}

/**
 * E-MAIL 1 — confirmação de compra, disparado no PURCHASE_APPROVED (imediato).
 * Aprovado por Red em 04/09/2026. Ficha de matrícula acrescentada em 06/09/2026.
 *
 * Duas ações, nesta ordem, que é a do Tabari ("1. confirma · 2. FICHA · 3. grupo"):
 * a ficha vem primeiro porque é o que o Red usa pra ajustar as aulas, e o grupo
 * vem em seguida porque é por onde chegam os links. Ordem invertida faria o
 * comprador clicar no grupo e nunca voltar pra ficha.
 */
export function emailConfirmacao(nome: string, ciclo: CicloAtual): { subject: string; html: string } {
    const p = primeiroNome(nome) || "Arquiteto";
    const dataFmt = formatarDataInicio(ciclo.dataInicio);
    const subject = `Você tá dentro — Hermes Week começa ${dataFmt}, 20h`;
    const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:520px;margin:0 auto;background:#080808;color:#f5f5f5;padding:36px 28px;border-radius:16px">
      <h1 style="font-size:24px;font-weight:800;margin:0 0 18px;line-height:1.3">Fala, ${p}.</h1>
      <p style="font-size:16px;line-height:1.6;color:#c9c9c9;margin:0 0 16px">
        Sua vaga na <strong style="color:#fff">Hermes Week</strong> tá confirmada. Aqui vai o que você precisa saber agora:
      </p>
      <p style="font-size:15px;line-height:1.6;color:#c9c9c9;margin:0 0 22px">
        <strong style="color:#fff">Começa ${dataFmt}, 20h.</strong> Cinco aulas, segunda a sexta, sempre no mesmo horário.
      </p>
      <p style="font-size:15px;line-height:1.6;color:#c9c9c9;margin:0 0 18px">
        Antes disso, duas coisas rápidas:
      </p>
      <div style="background:#141414;border:1px solid rgba(232,163,61,.42);border-radius:12px;padding:20px 22px;margin:0 0 14px">
        <p style="font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#E8A33D;margin:0 0 10px">1 · Preenche sua ficha de matrícula</p>
        <p style="font-size:14.5px;line-height:1.55;color:#a3a3a3;margin:0 0 14px">
          Leva menos de 2 minutos. É com ela que eu descubro em que sistema você tá, o que você já tentou e onde travou, e ajusto a instalação e os exemplos das aulas pra isso.
        </p>
        <a href="${MATRICULA_URL}" style="display:inline-block;background:#E8A33D;color:#0a0a0a;font-weight:800;font-size:15px;padding:12px 24px;border-radius:10px;text-decoration:none">Preencher a ficha</a>
      </div>
      <div style="background:#141414;border:1px solid #1f1f1f;border-radius:12px;padding:20px 22px;margin:0 0 22px">
        <p style="font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#8a8a8a;margin:0 0 10px">2 · Entra no grupo</p>
        <p style="font-size:14.5px;line-height:1.55;color:#a3a3a3;margin:0 0 14px">
          É nele que chegam os avisos e os links de cada aula. Quem não entra no grupo não recebe os links.
        </p>
        <a href="${ciclo.linkGrupo}" style="display:inline-block;background:#25D366;color:#0a0a0a;font-weight:800;font-size:15px;padding:12px 24px;border-radius:10px;text-decoration:none">👉 Entrar no grupo</a>
      </div>
      <p style="font-size:14px;line-height:1.6;color:#8a8a8a;margin:0 0 20px">
        Amanhã eu te mando mais detalhes de como a semana funciona. Por hoje é só isso ✌🏻.
      </p>
      <p style="font-size:15px;color:#c9c9c9;margin:0">Te vejo na segunda.<br><strong style="color:#fff">Red</strong></p>
    </div>`;
    return { subject, html };
}

/**
 * E-MAIL 2 — boas-vindas + contexto, D+1 após compra.
 * Aprovado por Red em 04/09/2026 (com correção "configurando" → "configurado").
 *
 * Até 06/09/2026 este e-mail saía junto com o e-mail 1, no mesmo instante e
 * em ordem aleatória (`Promise.all`) — o teste de 06/09 mostrou o e-mail 2
 * chegando 54ms ANTES do e-mail 1. Agora é agendado de verdade, via
 * `scheduled_at` do Resend, para as 09h BRT do dia seguinte à compra
 * (ver `agendamentoD1()` no webhook da Hotmart).
 */
export function emailBoasVindas(nome: string, ciclo: CicloAtual): { subject: string; html: string } {
    const p = primeiroNome(nome) || "Arquiteto";
    const subject = "O que esperar da Hermes Week";
    const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:520px;margin:0 auto;background:#080808;color:#f5f5f5;padding:36px 28px;border-radius:16px">
      <h1 style="font-size:22px;font-weight:800;margin:0 0 18px;line-height:1.3">Fala ${p}.</h1>
      <p style="font-size:16px;line-height:1.6;color:#c9c9c9;margin:0 0 16px">
        Passando só pra te lembrar de entrar no nosso grupo, caso você ainda não tenha entrado.
      </p>
      <p style="font-size:15px;line-height:1.6;color:#c9c9c9;margin:0 0 16px">
        Teremos cinco aulas, de segunda à sexta, às 20h. Vamos construir juntos e do zero o Hermes, até que ele esteja configurado e respondendo no seu celular.
      </p>
      <p style="font-size:15px;line-height:1.6;color:#c9c9c9;margin:0 0 22px">
        A cada dia a gente sai da aula com uma funcionalidade nova no ar.
      </p>
      <div style="background:#141414;border:1px solid #1f1f1f;border-radius:12px;padding:20px 22px;margin:0 0 22px">
        <p style="font-size:14.5px;line-height:1.55;color:#a3a3a3;margin:0 0 14px">
          Se ainda não entrou no grupo, entra agora, é lá que os links das aulas chegam.
        </p>
        <a href="${ciclo.linkGrupo}" style="display:inline-block;background:#25D366;color:#0a0a0a;font-weight:800;font-size:15px;padding:12px 24px;border-radius:10px;text-decoration:none">👉 Entrar no grupo</a>
      </div>
      <p style="font-size:15px;color:#c9c9c9;margin:0">Até segunda.<br><strong style="color:#fff">Red</strong></p>
    </div>`;
    return { subject, html };
}

/* ============================================================================
 *  E-MAIL DE RECUPERAÇÃO — carrinho que não fechou (ORION, 11/09/2026)
 * ----------------------------------------------------------------------------
 *  Nasceu de uma perda real: em 10/09 um comprador gerou o Pix da Hermes Week
 *  (`PURCHASE_BILLET_PRINTED`, 12h03) e o `PURCHASE_EXPIRED` entrou às 01h32 do
 *  dia seguinte. O webhook registrou os dois eventos e **nada disparou**.
 *
 *  Por que e-mail e não WhatsApp: a recuperação do ciclo anterior (CRM Week) usa
 *  fila da Evolution, e a instância `academy-suporte` está desconectada desde
 *  04/09. E-mail é o único canal da Hermes Week que está provado funcionando.
 *
 *  Tom: quem gerou Pix e não pagou não desistiu do produto, esbarrou no
 *  caminho. Cobrança agressiva aqui queima alguém que estava a um clique.
 * ==========================================================================*/

/** Checkout do ingresso. Mesma fonte do componente da LP, repetida aqui porque
 *  o webhook não importa código de página. Trocar nos dois se o produto mudar. */
export const CHECKOUT_URL = "https://pay.hotmart.com/J107439791C?checkoutMode=10&src=recuperacao";

/** Logo da marca no topo do e-mail. URL absoluta e pública: cliente de e-mail
 *  não resolve caminho relativo, e imagem embutida em base64 cai no spam com
 *  mais facilidade. `width` no atributo E no style porque Outlook ignora o
 *  style e Gmail ignora o atributo. */
export const LOGO_URL = "https://www.redpro.com.br/logo-academy.png";

/** Motivo do carrinho não ter fechado. Muda UMA frase do corpo — e ela importa:
 *  dizer "o código expirou" para quem abandonou o checkout sem gerar código
 *  nenhum é afirmar algo falso, e este público confere. (ZENITH, 14/09/2026) */
export type MotivoRecuperacao = "expirado" | "abandono";

export function emailRecuperacao(
    nome: string,
    ciclo: CicloAtual,
    motivo: MotivoRecuperacao = "expirado",
): { subject: string; html: string } {
    const p = primeiroNome(nome) || "Arquiteto";
    const dataFmt = formatarDataInicio(ciclo.dataInicio);
    const subject = motivo === "abandono"
        ? `${p}, você parou no meio da inscrição (a Hermes Week começa ${dataFmt})`
        : `${p}, seu pagamento não foi concluído (a Hermes Week começa ${dataFmt})`;
    const abertura = motivo === "abandono"
        ? "Você chegou até o checkout da Hermes Week e não terminou."
        : "Você começou a compra da Hermes Week e o pagamento não foi concluído. O código expirou, então o link não vale mais.";
    const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:520px;margin:0 auto;background:#080808;color:#f5f5f5;padding:36px 28px;border-radius:16px">
      <img src="${LOGO_URL}" alt="RedPro AI Academy" width="170"
           style="display:block;margin:0 auto 30px;width:170px;max-width:60%;height:auto" />

      <h1 style="font-size:24px;font-weight:800;margin:0 0 18px;line-height:1.3">Fala, ${p}.</h1>

      <p style="font-size:15px;line-height:1.65;color:#d6d6d6;margin:0 0 16px">
        ${abertura}
      </p>

      <p style="font-size:15px;line-height:1.65;color:#d6d6d6;margin:0 0 22px">
        Se foi desistência, tudo bem, pode ignorar esse e-mail. Mas se foi só a vida
        acontecendo no meio do caminho, ${motivo === "abandono" ? "o link" : "o link novo"} tá aqui embaixo e leva um minuto.
      </p>

      <div style="text-align:center;margin:26px 0">
        <a href="${CHECKOUT_URL}" style="display:inline-block;background:#E8A33D;color:#0a0a0a;font-weight:800;font-size:16px;padding:15px 34px;border-radius:10px;text-decoration:none">Concluir minha inscrição</a>
      </div>

      <p style="font-size:15px;line-height:1.65;color:#d6d6d6;margin:0 0 16px">
        A gente começa <strong style="color:#fff">${dataFmt}, às 20h</strong>. São cinco
        aulas, de segunda a sexta, e em toda uma você sai com uma coisa a mais funcionando
        na sua máquina.
      </p>

      <p style="font-size:15px;line-height:1.65;color:#d6d6d6;margin:0 0 22px">
        Se deu algum problema no pagamento, ou se ficou alguma dúvida antes de decidir,
        responde esse e-mail que eu te ajudo.
      </p>

      <p style="font-size:15px;line-height:1.6;color:#d6d6d6;margin:0">Red</p>

      <p style="font-size:12px;line-height:1.6;color:#777;margin:26px 0 0;border-top:1px solid #222;padding-top:16px">
        RedPro AI Academy · <a href="mailto:suporte@redpro.com.br" style="color:#E8A33D">suporte@redpro.com.br</a>
      </p>
    </div>`;
    return { subject, html };
}
