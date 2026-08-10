/**
 * Evolution API — operações de GRUPO (broadcast do carrinho + trocas de nome).
 *
 * Servidor: evo.redpro.com.br (v2.3.7) · instância `academy-suporte`
 * Número (admin dos grupos): +55 61 94756-0305.
 *
 * Diferente do 1:1 (evolution.ts), aqui:
 *  - o destino é um JID de grupo (`...@g.us`), não um telefone;
 *  - NÃO há guardrail de volume (é 1 envio por marco, não um lote);
 *  - o retorno CARREGA o `key.id`, porque a verificação de falha depende dele.
 *
 * ⚠️ REGRA ABSOLUTA (Red, 09/08/2026): NENHUM envio a grupo sem aprovação
 * explícita do Red. Esta lib só EXECUTA o POST; quem decide se pode enviar é a
 * camada de aprovação (disparos_grupo.aprovado + link de aprovação no Telegram).
 * Nunca chamar `enviarTextoGrupo`/`trocarNomeGrupo` a partir de um teste ou de
 * um fluxo que não tenha passado pela aprovação.
 */

const URL_PADRAO = "https://evo.redpro.com.br";
const INSTANCIA_PADRAO = "academy-suporte";

function base() {
    return process.env.EVOLUTION_API_URL || URL_PADRAO;
}
function instancia() {
    return process.env.EVOLUTION_INSTANCE || INSTANCIA_PADRAO;
}

// Delay de "digitação" aleatório — mesma lógica anti-assinatura-de-bot do 1:1.
const DELAY_MIN = 900;
const DELAY_MAX = 2600;
function delayAleatorio(): number {
    return DELAY_MIN + Math.floor(Math.random() * (DELAY_MAX - DELAY_MIN));
}

export type EnvioGrupo =
    | { ok: true; keyId: string | null }
    | { ok: false; erro: string };

export type TrocaNome = { ok: true } | { ok: false; erro: string };

/**
 * Posta um texto no grupo `jid`. Retorna o `key.id` da mensagem (quando a
 * Evolution devolve), que é a âncora da verificação de ENTREGA posterior.
 *
 * `key.id` ausente no retorno = a Evolution não registrou a mensagem = FALHA de
 * envio (o chamador alerta na hora). Um 2xx sem key.id é tratado como sucesso
 * parcial: enviou, mas não dá pra rastrear a entrega.
 */
export async function enviarTextoGrupo(jid: string, texto: string): Promise<EnvioGrupo> {
    const apikey = process.env.EVOLUTION_API_KEY;
    if (!apikey) return { ok: false, erro: "EVOLUTION_API_KEY ausente" };
    if (!/@g\.us$/.test(jid)) return { ok: false, erro: `JID de grupo inválido: ${jid}` };

    try {
        const res = await fetch(`${base()}/message/sendText/${instancia()}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", apikey },
            body: JSON.stringify({
                number: jid, // a Evolution aceita o JID de grupo no campo `number`
                text: texto,
                delay: delayAleatorio(),
                linkPreview: false,
            }),
        });
        if (!res.ok) return { ok: false, erro: `${res.status} ${(await res.text()).slice(0, 200)}` };
        const j = await res.json().catch(() => ({}));
        // Evolution devolve { key: { id, remoteJid, ... }, status, ... }
        const keyId: string | null = j?.key?.id ?? null;
        return { ok: true, keyId };
    } catch (e) {
        return { ok: false, erro: String(e) };
    }
}

/**
 * Troca o nome (subject) do grupo. Requer que o número seja admin — confirmado
 * pelo Red em 09/08/2026 para os dois grupos do ciclo.
 */
export async function trocarNomeGrupo(jid: string, novoNome: string): Promise<TrocaNome> {
    const apikey = process.env.EVOLUTION_API_KEY;
    if (!apikey) return { ok: false, erro: "EVOLUTION_API_KEY ausente" };
    if (!/@g\.us$/.test(jid)) return { ok: false, erro: `JID de grupo inválido: ${jid}` };

    try {
        const res = await fetch(
            `${base()}/group/updateGroupSubject/${instancia()}?groupJid=${encodeURIComponent(jid)}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json", apikey },
                body: JSON.stringify({ subject: novoNome }),
            },
        );
        if (!res.ok) return { ok: false, erro: `${res.status} ${(await res.text()).slice(0, 200)}` };
        return { ok: true };
    } catch (e) {
        return { ok: false, erro: String(e) };
    }
}

/**
 * Verifica a ENTREGA de uma mensagem já enviada, pelo key.id. O ACK do WhatsApp
 * chega assíncrono, então isto é consultado DEPOIS do envio (não no ato).
 *
 * Retorna o status bruto ('PENDING' | 'SERVER_ACK' | 'DELIVERY_ACK' | 'READ' | ...)
 * ou null se não achou. A leitura é por chat/findMessages filtrando pelo key.id.
 */
export async function statusMensagemGrupo(jid: string, keyId: string): Promise<string | null> {
    const apikey = process.env.EVOLUTION_API_KEY;
    if (!apikey || !keyId) return null;

    try {
        const res = await fetch(`${base()}/chat/findMessages/${instancia()}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", apikey },
            body: JSON.stringify({ where: { key: { id: keyId, remoteJid: jid } } }),
        });
        if (!res.ok) return null;
        const j = await res.json().catch(() => null);
        // O formato varia por versão: array direto ou { messages: { records: [] } }.
        const rec = Array.isArray(j)
            ? j[0]
            : j?.messages?.records?.[0] ?? j?.records?.[0] ?? null;
        return rec?.status ?? null;
    } catch {
        return null;
    }
}
