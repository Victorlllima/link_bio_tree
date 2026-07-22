/**
 * WhatsApp Business Cloud API (Meta) — canal de BACKUP.
 *
 * Existe para um cenário só: o número da Evolution (Baileys, não-oficial) ser
 * bloqueado no meio de um ciclo. Baileys tem risco real de banimento; a Cloud
 * API não. Quando isso acontecer, trocar `WHATSAPP_PROVIDER` para "oficial"
 * redireciona toda a mensageria sem tocar em código.
 *
 * Conta: WABA 982945829973742 ("RedPro Academy") · número +55 61 9108-9602
 * (phone_number_id 596089036916067) · qualidade GREEN · CLOUD_API.
 *
 * ⚠️ A JANELA DE 24 HORAS governa tudo aqui.
 * Texto livre só chega se a pessoa mandou mensagem nas últimas 24h. Fora disso,
 * a Meta exige um TEMPLATE pré-aprovado. Por isso `enviarTexto` devolve
 * `foraDaJanela: true` em vez de fingir sucesso — o chamador precisa saber que
 * tem de cair no template.
 */

const GRAPH = "https://graph.facebook.com/v21.0";

export type ResultadoOficial =
    | { ok: true }
    | { ok: false; erro: string; foraDaJanela?: boolean };

function cfg() {
    return {
        token: process.env.WHATSAPP_OFICIAL_TOKEN,
        phoneId: process.env.WHATSAPP_OFICIAL_PHONE_ID,
    };
}

/** Só dígitos com DDI 55 — a Meta rejeita máscara e aceita E.164 sem "+". */
export function normalizarDestinoOficial(fone: string): string {
    const d = (fone || "").replace(/\D/g, "");
    if (!d) return "";
    if (d.startsWith("55")) return d;
    if (d.length === 10 || d.length === 11) return `55${d}`;
    return d;
}

async function chamar(body: Record<string, unknown>): Promise<ResultadoOficial> {
    const { token, phoneId } = cfg();
    if (!token) return { ok: false, erro: "WHATSAPP_OFICIAL_TOKEN ausente" };
    if (!phoneId) return { ok: false, erro: "WHATSAPP_OFICIAL_PHONE_ID ausente" };

    try {
        const res = await fetch(`${GRAPH}/${phoneId}/messages`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ messaging_product: "whatsapp", ...body }),
        });

        if (res.ok) return { ok: true };

        const texto = await res.text();
        // 131047 / 131026: fora da janela de 24h, ou o destino não aceita
        // mensagem livre. É o erro esperado, não uma falha de configuração.
        const foraDaJanela = /131047|131026|24 hour|re-engagement/i.test(texto);
        return { ok: false, erro: `${res.status} ${texto.slice(0, 300)}`, foraDaJanela };
    } catch (e) {
        return { ok: false, erro: String(e) };
    }
}

/** Texto livre. Só funciona DENTRO da janela de 24h — ver nota no topo. */
export async function enviarTextoOficial(destino: string, texto: string): Promise<ResultadoOficial> {
    const numero = normalizarDestinoOficial(destino);
    if (!numero) return { ok: false, erro: "destino vazio ou inválido" };

    return chamar({
        to: numero,
        type: "text",
        text: { body: texto, preview_url: false },
    });
}

/**
 * Template aprovado — o único envio que atravessa a janela de 24h.
 *
 * `variaveis` preenche os {{1}}, {{2}}… do corpo, na ordem. O template precisa
 * estar APPROVED na WABA; nome e idioma têm de bater exatamente com o cadastro.
 */
export async function enviarTemplateOficial(
    destino: string,
    template: string,
    variaveis: string[] = [],
    idioma = "pt_BR",
): Promise<ResultadoOficial> {
    const numero = normalizarDestinoOficial(destino);
    if (!numero) return { ok: false, erro: "destino vazio ou inválido" };

    const components = variaveis.length
        ? [{ type: "body", parameters: variaveis.map((v) => ({ type: "text", text: v })) }]
        : undefined;

    return chamar({
        to: numero,
        type: "template",
        template: { name: template, language: { code: idioma }, ...(components ? { components } : {}) },
    });
}

/** Diagnóstico do número: qualidade, verificação e nome de exibição. */
export async function estadoNumeroOficial() {
    const { token, phoneId } = cfg();
    if (!token || !phoneId) return { ok: false, erro: "credenciais ausentes" };

    try {
        const res = await fetch(
            `${GRAPH}/${phoneId}?fields=display_phone_number,verified_name,quality_rating,code_verification_status,name_status,status,throughput`,
            { headers: { Authorization: `Bearer ${token}` } },
        );
        if (!res.ok) return { ok: false, erro: `${res.status} ${(await res.text()).slice(0, 200)}` };
        return { ok: true, dados: await res.json() };
    } catch (e) {
        return { ok: false, erro: String(e) };
    }
}
