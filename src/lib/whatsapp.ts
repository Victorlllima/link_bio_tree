/**
 * WhatsApp — camada única de envio, com failover entre dois provedores.
 *
 * ┌─ INTERRUPTOR ────────────────────────────────────────────────────────────┐
 * │ Env var  WHATSAPP_PROVIDER                                               │
 * │   "evolution" (padrão) → Evolution API, número 61 3686-6405 (Baileys)    │
 * │   "oficial"            → Cloud API da Meta, número 61 9108-9602          │
 * │                                                                          │
 * │ Trocar o valor na Vercel + redeploy = toda a mensageria muda de canal.   │
 * │ Nenhuma linha de código precisa mudar.                                   │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * Por que existe: a Evolution roda sobre Baileys (não-oficial), que tem risco
 * real de banimento do número. Se isso acontecer no meio de um ciclo — com
 * gente que já pagou o ingresso esperando o link da aula — o prejuízo é o
 * evento inteiro. Este módulo garante que a virada seja de minutos, não de dias.
 *
 * Quem chama o envio (webhook da Hotmart, respostas, mensageria do evento) usa
 * SEMPRE `enviarMensagem`. Ninguém importa `evolution.ts` ou
 * `whatsapp-oficial.ts` direto — senão o interruptor deixa de valer.
 */

import { enviarWhatsApp as enviarViaEvolution } from "./evolution";
import { enviarTextoOficial, enviarTemplateOficial } from "./whatsapp-oficial";

export type Provedor = "evolution" | "oficial";

export type ResultadoEnvio = {
    ok: boolean;
    provedor: Provedor;
    erro?: string;
    /** true quando a Cloud API recusou por estar fora da janela de 24h. */
    precisaTemplate?: boolean;
};

export function provedorAtivo(): Provedor {
    return process.env.WHATSAPP_PROVIDER === "oficial" ? "oficial" : "evolution";
}

/**
 * Envia texto pelo provedor ativo.
 *
 * `template` é o plano B do plano B: no canal oficial, fora da janela de 24h a
 * Meta só entrega template aprovado. Quem envia primeiro contato (ex.: a
 * confirmação de e-mail logo após a compra) deve passar o template equivalente
 * — sem ele, o envio simplesmente não chega e a pessoa some do funil.
 */
export async function enviarMensagem(
    destino: string,
    texto: string,
    opts: { template?: { nome: string; variaveis?: string[]; idioma?: string } } = {},
): Promise<ResultadoEnvio> {
    const provedor = provedorAtivo();

    if (provedor === "evolution") {
        const r = await enviarViaEvolution(destino, texto);
        return { ok: r.ok, provedor, erro: r.ok ? undefined : r.erro };
    }

    const r = await enviarTextoOficial(destino, texto);
    if (r.ok) return { ok: true, provedor };

    // Fora da janela de 24h: tenta o template equivalente, se houver.
    if (r.foraDaJanela && opts.template) {
        const t = await enviarTemplateOficial(
            destino,
            opts.template.nome,
            opts.template.variaveis ?? [],
            opts.template.idioma,
        );
        if (t.ok) return { ok: true, provedor };
        return { ok: false, provedor, erro: `template falhou: ${t.erro}`, precisaTemplate: true };
    }

    return { ok: false, provedor, erro: r.erro, precisaTemplate: r.foraDaJanela };
}
