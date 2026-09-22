/**
 * Confirmação de disparo em grupo por LINK ASSINADO.
 *
 * ⚠️ INVERSÃO DA TRAVA (Red, 22/09/2026). Antes: nada saía sem clique.
 * Resultado: o ciclo de agosto inteiro expirou sem um único envio, porque
 * ninguém clicou. Agora o padrão é SAIR. O Red recebe o aviso 30 min antes e
 * só precisa tocar se quiser SEGURAR. Silêncio = aprovado.
 *
 * O link carrega o id do disparo + um token HMAC(id, APROVACAO_SECRET). Sem o
 * segredo ninguém forja um link — então um veto não pode ser disparado por
 * acidente nem por terceiros. Não guarda segredo por linha no banco: o token é
 * derivado.
 *
 * Fluxo:
 *   cron detecta 30 min pra hora → linkVeto(id) → manda no Telegram
 *   Red NÃO toca em nada → na hora, o cron posta
 *   Red toca o link → /api/vetar-disparo valida o token → status='vetado'
 *   → o cron pula, e nada sai. O Red então manda o texto novo pro Alfred.
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

/** URL absoluta de VETO, para o botão do Telegram. */
export function linkVeto(id: number, origin: string): string {
    return `${origin}/api/vetar-disparo?id=${id}&t=${tokenDisparo(id)}`;
}

/**
 * URL de aprovação explícita. Mantida para o caso de o Red querer ANTECIPAR um
 * disparo que ele mesmo vetou, ou liberar algo preso. Não é mais o caminho
 * normal — o caminho normal é o silêncio.
 */
export function linkAprovacao(id: number, origin: string): string {
    return `${origin}/api/aprovar-disparo?id=${id}&t=${tokenDisparo(id)}`;
}
