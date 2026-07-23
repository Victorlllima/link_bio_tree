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

import { montarMensagem, saudacaoVariada, primeiroNome } from "./wpp-humanizar";

export const GRUPO_URL = "https://chat.whatsapp.com/I3AcP8IpTtsG2y3gC7O0bS";
export const FICHA_MATRICULA_URL = "https://www.redpro.com.br/crm-week-matricula";

export { primeiroNome };

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
/**
 * ⚠️ Sem botões nativos, por decisão técnica (22/07/2026).
 * `sendButtons` no conector Baileys devolve HTTP 201 mas NUNCA entrega — bug
 * confirmado nas issues #2390 e #2404 da Evolution API, reproduzido aqui na
 * v2.3.7. Botão interativo só funciona no conector Cloud API (WABA oficial) e
 * está em vias de ser descontinuado no Baileys. Texto é o que entrega hoje.
 *
 * A palavra é *CONFIRMO*, não "SIM": "sim" aparece solto em qualquer frase e
 * gera falso positivo na classificação; "CONFIRMO" é inequívoco. Digitar uma
 * palavra específica também é um micro-compromisso — psicologicamente mais
 * forte que tocar um botão.
 */
export function confirmarEmail(nome: string, email: string, semente = ""): string {
    // A semente é o telefone: mesma pessoa sempre recebe a mesma variante, mas
    // duas pessoas diferentes quase nunca recebem texto idêntico (anti-ban).
    const sem = semente || nome || email;
    return montarMensagem(
        [
            `${saudacaoVariada(nome, sem)} 🧩`,
            "",
            [
                "Sua vaga no *Desafio: Seu CRM em 5 Dias* tá confirmada.",
                "Tá confirmada sua vaga no *Desafio: Seu CRM em 5 Dias*.",
                "Você garantiu sua vaga no *Desafio: Seu CRM em 5 Dias*.",
            ],
            "",
            [
                "Antes de te passar os acessos, confirma uma coisa rápida pra mim:",
                "Antes de liberar seu acesso, preciso confirmar uma coisa:",
                "Só uma checagem rápida antes de te mandar os acessos:",
            ],
            "",
            `Seu e-mail é *${email}*?`,
            "",
            [
                "Responde *CONFIRMO* se estiver certo, ou manda o e-mail correto que eu ajusto aqui.",
                "Se estiver certo, responde *CONFIRMO*. Se não, me manda o e-mail correto que eu ajusto.",
                "Tá certo? Responde *CONFIRMO*. Se for outro, é só mandar aqui que eu corrijo.",
            ],
        ],
        sem,
    );
}

/**
 * MENSAGEM 2 — só depois que a pessoa responde.
 *
 * Vai dentro da janela de 24h aberta pela resposta dela: é o envio mais seguro
 * que existe no WhatsApp. Traz os passos 2 e 3 (ficha + grupo).
 */
export function passosRestantes(emailEstavaCerto: boolean, emailNovo?: string, semente = ""): string {
    const sem = semente || emailNovo || "passos";
    const abertura = emailEstavaCerto
        ? ["Show, e-mail confirmado. ✅", "Perfeito, e-mail confirmado. ✅", "Fechou, e-mail confirmado. ✅"]
        : [`Anotado, vou usar *${emailNovo}*. ✅`, `Corrigido, vou usar *${emailNovo}*. ✅`];

    // FUNÇÃO ÚNICA desta msg (decisão do Red 23/07): SÓ o grupo. A ficha saiu daqui —
    // agora ela é pedida na página de obrigado (web), e o e-mail é a rede de segurança
    // dos dois. Mantida a estrutura de variações rotativas do ION (anti-repetição).
    return montarMensagem(
        [
            abertura,
            "",
            [
                "Agora seu passo mais importante: *entra no grupo do desafio.* É lá que eu aviso quando cada aula entra no ar.",
                "Agora o passo que não pode faltar: *entra no grupo do desafio.* É por lá que eu aviso quando cada aula entra no ar.",
                "Falta uma coisa só, e é a mais importante: *entra no grupo do desafio.* É lá que eu aviso quando cada aula sai.",
            ],
            "",
            `👉 ${GRUPO_URL}`,
            "",
            "As aulas são de *segunda a sexta, às 7h*. Desde o primeiro dia é mão na massa, então já vem com o computador do lado pra você não perder nada e construir tudo junto comigo.",
            "",
            "Te espero segunda. Bora construir seu CRM. 🦈",
        ],
        sem,
    );
}

/**
 * E-MAIL de boas-vindas — a REDE DE SEGURANÇA.
 *
 * Função única: pegar quem escapou do grupo e da ficha. Por isso menciona os DOIS
 * ("caso ainda não tenha feito") — é o único canal que fica guardado e a pessoa
 * reabre dias depois. A obrigado cuida da ficha, o WhatsApp cuida do grupo; o
 * e-mail é o plano B de ambos. Retorna { subject, html }.
 */
export function emailBoasVindas(nome: string): { subject: string; html: string } {
    const p = primeiroNome(nome) || "Shark";
    const subject = `${p}, garante seu lugar no Desafio antes de segunda`;
    const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:520px;margin:0 auto;background:#080808;color:#f5f5f5;padding:36px 28px;border-radius:16px">
      <h1 style="font-size:25px;font-weight:800;margin:0 0 18px;line-height:1.25">Sua vaga tá garantida, ${p}. 🦈</h1>
      <p style="font-size:16px;line-height:1.6;color:#c9c9c9;margin:0 0 16px">
        Você está dentro do <strong style="color:#fff">Desafio: Seu CRM em 5 Dias</strong>. De segunda a sexta, 7h da manhã, a gente constrói do zero um CRM completo — o tipo de sistema que as empresas pagam caro pra ter. E sem escrever código.
      </p>
      <p style="font-size:15px;line-height:1.6;color:#c9c9c9;margin:0 0 22px">
        Pra você não perder nada, confere se já fez estas duas coisas. <strong style="color:#fff">Se já fez, então tá tudo pronto.</strong>
      </p>
      <div style="background:#141414;border:1px solid #1f1f1f;border-radius:12px;padding:20px 22px;margin:0 0 14px">
        <p style="font-size:16px;font-weight:700;color:#fff;margin:0 0 6px">1. Entrou no grupo do WhatsApp?</p>
        <p style="font-size:14.5px;line-height:1.55;color:#a3a3a3;margin:0 0 14px">É por lá que eu mando o link de cada aula. Sem o grupo, você fica de fora dos avisos.</p>
        <a href="${GRUPO_URL}" style="display:inline-block;background:#25D366;color:#0a0a0a;font-weight:800;font-size:15px;padding:12px 24px;border-radius:10px;text-decoration:none">👉 Entrar no grupo</a>
      </div>
      <div style="background:#141414;border:1px solid #1f1f1f;border-radius:12px;padding:20px 22px;margin:0 0 24px">
        <p style="font-size:16px;font-weight:700;color:#fff;margin:0 0 6px">2. Preencheu a ficha de matrícula?</p>
        <p style="font-size:14.5px;line-height:1.55;color:#a3a3a3;margin:0 0 14px">É com ela que eu adapto os exemplos das aulas pra sua realidade.</p>
        <a href="${FICHA_MATRICULA_URL}" style="display:inline-block;background:#F97316;color:#0a0a0a;font-weight:800;font-size:15px;padding:12px 24px;border-radius:10px;text-decoration:none">👉 Preencher a ficha</a>
      </div>
      <p style="font-size:14px;line-height:1.6;color:#8a8a8a;margin:0 0 20px">
        As aulas começam <strong style="color:#c9c9c9">segunda, 7h</strong>. Deixa o computador do lado — desde o primeiro dia é construção.
      </p>
      <p style="font-size:15px;color:#c9c9c9;margin:0">Te espero lá.<br><strong style="color:#fff">Red</strong></p>
    </div>`;
    return { subject, html };
}
