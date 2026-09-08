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
