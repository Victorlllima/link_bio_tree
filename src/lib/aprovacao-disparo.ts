/**
 * Aprovação de disparo em grupo por LINK ASSINADO (Red, 09/08/2026).
 *
 * O Red aprova cada disparo tocando um link que chega no Telegram. O link
 * carrega o id do disparo + um token HMAC(id, APROVACAO_SECRET). Sem o segredo
 * ninguém forja um link — então a aprovação não pode ser disparada por acidente
 * nem por terceiros. Não guarda segredo por linha no banco: o token é derivado.
 *
 * Fluxo:
 *   cron detecta hora do disparo → linkAprovacao(id) → manda no Telegram
 *   Red toca o link → /api/aprovar-disparo valida o token → marca aprovado=true
 *   próximo tick do cron vê aprovado=true → troca nome + posta no grupo
 */

import { createHmac, timingSafeEqual } from "crypto";

function segredo(): string {
    const s = process.env.APROVACAO_SECRET;
    if (!s) throw new Error("APROVACAO_SECRET ausente");
    return s;
}

/** Token curto e estável para um id de disparo. */
export function tokenDisparo(id: number): string {
    return createHmac("sha256", segredo()).update(`disparo:${id}`).digest("hex").slice(0, 24);
}

/** Confere o token em tempo constante (evita timing attack). */
export function tokenValido(id: number, token: string): boolean {
    if (!token) return false;
    const esperado = tokenDisparo(id);
    const a = Buffer.from(esperado);
    const b = Buffer.from(token);
    return a.length === b.length && timingSafeEqual(a, b);
}

/** URL absoluta de aprovação, para o botão do Telegram. */
export function linkAprovacao(id: number, origin: string): string {
    return `${origin}/api/aprovar-disparo?id=${id}&t=${tokenDisparo(id)}`;
}
