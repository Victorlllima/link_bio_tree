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
 * Formata a data de início do ciclo (vinda como "YYYY-MM-DD" do Postgres)
 * em "segunda-feira, DD/MM" — ex: "segunda-feira, 14/09".
 */
export function formatarDataInicio(dataIsoOuBr: string): string {
    const data = new Date(`${dataIsoOuBr}T00:00:00-03:00`);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    return `segunda-feira, ${dia}/${mes}`;
}

/**
 * E-MAIL 1 — confirmação de compra, disparado no PURCHASE_APPROVED.
 * Aprovado por Red em 04/09/2026.
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
      <div style="background:#141414;border:1px solid #1f1f1f;border-radius:12px;padding:20px 22px;margin:0 0 22px">
        <p style="font-size:14.5px;line-height:1.55;color:#a3a3a3;margin:0 0 14px">
          Esse é o grupo do WhatsApp onde tudo vai acontecer. É nele que te enviaremos os avisos e os links das aulas.
        </p>
        <a href="${ciclo.linkGrupo}" style="display:inline-block;background:#25D366;color:#0a0a0a;font-weight:800;font-size:15px;padding:12px 24px;border-radius:10px;text-decoration:none">👉 Entrar no grupo</a>
      </div>
      <p style="font-size:14px;line-height:1.6;color:#8a8a8a;margin:0 0 20px">
        Nos próximos dias eu te mando mais detalhes. Por enquanto, só entra no grupo e reserva a data ✌🏻.
      </p>
      <p style="font-size:15px;color:#c9c9c9;margin:0">Te vejo na segunda.<br><strong style="color:#fff">Red</strong></p>
    </div>`;
    return { subject, html };
}

/**
 * E-MAIL 2 — boas-vindas + contexto, D+1 após compra.
 * Aprovado por Red em 04/09/2026 (com correção "configurando" → "configurado").
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
