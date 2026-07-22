/**
 * Mensagens do Desafio CRM em 5 Dias (nome interno: CRM Week).
 *
 * ⚠️ "CRM Week" / "LPSG" são nomes INTERNOS — nunca aparecem para o aluno.
 * O nome público é "Desafio: Seu CRM em 5 Dias".
 *
 * Regras de formato (skill `mensageria-lancamento`, Método Tabari):
 *  1. Bullets com `-`, nunca `•`.
 *  2. Zero travessão — usar "...", vírgula ou quebra de linha.
 *  3. Negrito no padrão WhatsApp: *texto* (asterisco simples, não markdown).
 *  4. Nunca inventar número, depoimento ou resultado.
 */

export const GRUPO_URL = "https://chat.whatsapp.com/I3AcP8IpTtsG2y3gC7O0bS";
export const FICHA_MATRICULA_URL = "https://www.redpro.com.br/crm-week-matricula";

/** Primeiro nome, capitalizado. "  joão da silva " → "João" */
export function primeiroNome(nome: string): string {
    const p = (nome || "").trim().split(/\s+/)[0] || "";
    if (!p) return "";
    return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
}

/**
 * Boas-vindas pós-compra do ingresso (R$44).
 *
 * Segue os 3 passos obrigatórios do Tabari (MECANICA-DEFINITIVA-LPSG.md):
 *   (a) confirmar o e-mail  (b) preencher a ficha  (c) entrar no grupo
 *
 * Uma mensagem só, com os 3 passos numerados. O método pede os 3 passos, não 3
 * mensagens: cada disparo extra consome cota do cap 4+4 e aumenta risco de
 * bloqueio do número.
 */
export function boasVindasIngresso(nome: string, email: string): string {
    const p = primeiroNome(nome);
    const saudacao = p ? `Opa, ${p}!` : "Opa!";

    return [
        `${saudacao} 🧩`,
        "",
        "Sua vaga no *Desafio: Seu CRM em 5 Dias* está confirmada.",
        "",
        "São 3 passos rápidos pra você não perder nada:",
        "",
        `*1.* Confirma pra mim se esse e-mail está certo: ${email}`,
        "É por ele que chega seu acesso. Se estiver errado, me responde aqui com o correto.",
        "",
        `*2.* Preenche a ficha de matrícula (1 minuto): ${FICHA_MATRICULA_URL}`,
        "É o que me deixa adaptar as aulas ao seu momento.",
        "",
        `*3.* Entra no grupo do desafio: ${GRUPO_URL}`,
        "É lá que eu aviso quando cada aula entra no ar.",
        "",
        "As aulas são de *segunda a sexta, às 7h*. Deixa o computador do lado, porque desde o primeiro dia é mão na massa.",
        "",
        'Feito os 3 passos, me responde aqui com um "ok" que eu confirmo seu lugar.',
    ].join("\n");
}
