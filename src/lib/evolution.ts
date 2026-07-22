/**
 * Evolution API — envio de WhatsApp 1:1.
 *
 * Servidor: evo.redpro.com.br (v2.3.7) · instância `academy-suporte`
 * Número remetente: +55 61 3686-6405 ("RedPro AI Academy | Suporte")
 *
 * Por que Evolution e não ManyChat (decisão do Red, 22/07/2026):
 * a conta ManyChat é PRO, mas a API externa e a integração Hotmart exigem um
 * tier ACIMA do PRO ("Upgrade required" na própria tela da chave). Sem API não
 * há ponte automática compra → mensagem. A Evolution já roda no servidor do Red,
 * sem custo adicional e sem limite de plano.
 *
 * ⚠️ Regra Tabari do cap 4+4: máximo 4 mensagens 1:1 + 4 no grupo por dia, por
 * pessoa. Não é limite técnico da Evolution — é o que evita o número ser
 * bloqueado pelo WhatsApp. Quem dispara em lote precisa respeitar.
 */

const URL_PADRAO = "https://evo.redpro.com.br";
const INSTANCIA_PADRAO = "academy-suporte";

export type EnvioResultado = { ok: true } | { ok: false; erro: string };

/** Só dígitos com DDI 55 — formato que a Evolution espera no destinatário. */
export function normalizarDestino(fone: string): string {
    const d = (fone || "").replace(/\D/g, "");
    if (!d) return "";
    if (d.startsWith("55")) return d;
    // 10 dígitos (DDD + 8) ou 11 (DDD + 9) → é número BR sem DDI.
    if (d.length === 10 || d.length === 11) return `55${d}`;
    return d;
}

/**
 * Envia texto por WhatsApp. Nunca lança — devolve {ok:false} para o chamador
 * decidir. Um erro de WhatsApp não pode derrubar o webhook da Hotmart, senão a
 * Hotmart marca a entrega como falha e reenvia o evento inteiro.
 */
export async function enviarWhatsApp(
    destino: string,
    texto: string,
    opts: { delayMs?: number } = {},
): Promise<EnvioResultado> {
    const apikey = process.env.EVOLUTION_API_KEY;
    if (!apikey) return { ok: false, erro: "EVOLUTION_API_KEY ausente" };

    const base = process.env.EVOLUTION_API_URL || URL_PADRAO;
    const instancia = process.env.EVOLUTION_INSTANCE || INSTANCIA_PADRAO;

    const numero = normalizarDestino(destino);
    if (!numero) return { ok: false, erro: "destino vazio ou inválido" };

    try {
        const res = await fetch(`${base}/message/sendText/${instancia}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", apikey },
            body: JSON.stringify({
                number: numero,
                text: texto,
                // delay simula digitação: parece humano e reduz risco de bloqueio.
                delay: opts.delayMs ?? 1200,
                linkPreview: false,
            }),
        });
        if (!res.ok) return { ok: false, erro: `${res.status} ${await res.text()}` };
        return { ok: true };
    } catch (e) {
        return { ok: false, erro: String(e) };
    }
}

/** Estado da instância — use para diagnosticar antes de culpar o disparo. */
export async function estadoInstancia(): Promise<{ ok: boolean; estado?: string; erro?: string }> {
    const apikey = process.env.EVOLUTION_API_KEY;
    if (!apikey) return { ok: false, erro: "EVOLUTION_API_KEY ausente" };

    const base = process.env.EVOLUTION_API_URL || URL_PADRAO;
    const instancia = process.env.EVOLUTION_INSTANCE || INSTANCIA_PADRAO;

    try {
        const res = await fetch(`${base}/instance/connectionState/${instancia}`, {
            headers: { apikey },
        });
        if (!res.ok) return { ok: false, erro: `${res.status}` };
        const j = await res.json();
        return { ok: true, estado: j?.instance?.state };
    } catch (e) {
        return { ok: false, erro: String(e) };
    }
}
