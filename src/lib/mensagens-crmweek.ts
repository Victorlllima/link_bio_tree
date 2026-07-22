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
 * MENSAGEM 1 — imediata, no momento da compra.
 *
 * Uma pergunta só, resposta de um toque. A ordem é deliberada: os 3 passos do
 * Tabari (confirma e-mail → ficha → grupo) foram divididos em DUAS mensagens,
 * com o pedido de resposta ANTES de qualquer tarefa.
 *
 * Por quê: desde 2026 o WhatsApp mantém um contador cumulativo de mensagens sem
 * resposta em 48h (janela móvel de 30 dias). Número que só envia e nunca recebe
 * entra na fila de banimento. Pedir a confirmação no fim, depois de 3 tarefas,
 * só é respondido por quem já ia responder — a taxa de silêncio sobe justamente
 * no grupo mais frio. Pedindo primeiro, todo mundo responde em segundos, o que
 * abre a janela de 24h e marca conversa bidirecional.
 *
 * O e-mail não é pretexto: é por ele que a Hotmart entrega o acesso.
 */
export function confirmarEmail(nome: string, email: string): string {
    const p = primeiroNome(nome);
    const saudacao = p ? `Opa, ${p}!` : "Opa!";

    return [
        `${saudacao} 🧩`,
        "",
        "Sua vaga no *Desafio: Seu CRM em 5 Dias* tá confirmada.",
        "",
        "Antes de te passar os acessos, confirma uma coisa rápida pra mim:",
        "",
        `Seu e-mail é *${email}*?`,
        "",
        "Responde *SIM* se estiver certo, ou manda o e-mail correto que eu corrijo aqui.",
    ].join("\n");
}

/** Versão com botões da mensagem 1 — um toque converte mais que digitar. */
export function confirmarEmailBotoes(nome: string, email: string) {
    const p = primeiroNome(nome);
    const saudacao = p ? `Opa, ${p}!` : "Opa!";

    return {
        title: "Vaga confirmada 🧩",
        description: [
            `${saudacao}`,
            "",
            "Sua vaga no *Desafio: Seu CRM em 5 Dias* tá confirmada.",
            "",
            "Antes de te passar os acessos, confirma pra mim:",
            "",
            `Seu e-mail é *${email}*?`,
        ].join("\n"),
        footer: "Desafio: Seu CRM em 5 Dias",
        buttons: [
            { type: "reply" as const, displayText: "SIM, é esse", id: "email_ok" },
            { type: "reply" as const, displayText: "Não, vou corrigir", id: "email_corrigir" },
        ],
    };
}

/**
 * MENSAGEM 2 — só depois que a pessoa responde.
 *
 * Vai dentro da janela de 24h aberta pela resposta dela: é o envio mais seguro
 * que existe no WhatsApp. Traz os passos 2 e 3 (ficha + grupo).
 */
export function passosRestantes(emailEstavaCerto: boolean, emailNovo?: string): string {
    const abertura = emailEstavaCerto
        ? "Show, e-mail confirmado. ✅"
        : `Anotado, vou usar *${emailNovo}*. ✅`;

    return [
        abertura,
        "",
        "Agora os 2 últimos passos:",
        "",
        `*1.* Ficha de matrícula (1 minuto)`,
        FICHA_MATRICULA_URL,
        "É o que me deixa adaptar as aulas ao seu momento.",
        "",
        `*2.* Entra no grupo do desafio`,
        GRUPO_URL,
        "É lá que eu aviso quando cada aula entra no ar.",
        "",
        "As aulas são de *segunda a sexta, às 7h*. Deixa o computador do lado, porque desde o primeiro dia é mão na massa.",
    ].join("\n");
}
