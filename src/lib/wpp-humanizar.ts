/**
 * Humanização de mensagens — o que faz um disparo automático parecer humano.
 *
 * A fonte (pesquisa 22/07): o WhatsApp monitora COMPORTAMENTO de automação, não
 * volume. 300 mensagens em 4 minutos parece bot; 300 ao longo de horas, com
 * intervalos variados e texto que muda, parece um humano ocupado. As duas causas
 * de ban mais comuns são denúncia do destinatário e MENSAGEM IDÊNTICA em massa.
 *
 * Este módulo ataca a segunda: nenhuma variável fixa, nenhum texto repetido.
 * O delay aleatório e a fila de disparo vivem em `wpp-fila.ts`.
 */

/**
 * Sorteia um item de forma determinística a partir de uma semente (o telefone).
 *
 * Por que determinístico e não Math.random(): a MESMA pessoa deve receber SEMPRE
 * a mesma variante. Se ela responde e a gente reenvia, o texto não pode mudar do
 * nada — isso confunde e parece bot. Semear pelo telefone dá variedade ENTRE
 * pessoas e consistência PARA a pessoa.
 */
export function escolherPorSemente<T>(opcoes: T[], semente: string): T {
    if (opcoes.length === 1) return opcoes[0];
    let h = 0;
    for (let i = 0; i < semente.length; i++) {
        h = (h * 31 + semente.charCodeAt(i)) | 0;
    }
    return opcoes[Math.abs(h) % opcoes.length];
}

/** Primeiro nome, capitalizado. "  joão da silva " → "João" */
export function primeiroNome(nome: string): string {
    const p = (nome || "").trim().split(/\s+/)[0] || "";
    if (!p) return "";
    return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
}

/**
 * Monta uma mensagem variada a partir de um esqueleto.
 *
 * `blocos` é uma lista de partes; cada parte pode ser texto fixo (string) ou um
 * conjunto de alternativas (string[]) — o motor sorteia uma por pessoa. Assim
 * duas pessoas quase nunca recebem exatamente o mesmo texto, mas o conteúdo é o
 * mesmo. `vars` substitui {chave} pelas variáveis (nome, email, etc).
 */
export function montarMensagem(
    blocos: Array<string | string[]>,
    semente: string,
    vars: Record<string, string> = {},
): string {
    const partes = blocos.map((b, i) => {
        const escolhido = Array.isArray(b) ? escolherPorSemente(b, semente + ":" + i) : b;
        return escolhido;
    });
    let texto = partes.join("\n");
    for (const [k, v] of Object.entries(vars)) {
        texto = texto.split(`{${k}}`).join(v);
    }
    return texto;
}

/**
 * Saudação variada por pessoa. Abertura idêntica em 100 mensagens é o sinal de
 * bot mais óbvio que existe.
 */
export function saudacaoVariada(nome: string, semente: string): string {
    const p = primeiroNome(nome);
    const comNome = [`Opa, ${p}!`, `Oi, ${p}!`, `E aí, ${p}!`, `Fala, ${p}!`];
    const semNome = ["Opa!", "Oi!", "E aí!", "Fala!"];
    return escolherPorSemente(p ? comNome : semNome, semente);
}
