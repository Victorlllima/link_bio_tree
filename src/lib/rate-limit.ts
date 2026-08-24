/**
 * Rate limit em memória para rotas públicas de formulário.
 *
 * Por que existe: as rotas de formulário (/api/contact, /api/mentoria, etc.) aceitam POST sem
 * autenticação — o que está correto, são formulários públicos. Mas cada chamada dispara 2 e-mails
 * via Resend. Sem teto, um script em loop queima a cota do Resend e enche a caixa de entrada.
 *
 * Limitação conhecida: o estado vive na memória da instância. Em serverless com várias instâncias,
 * o teto real é `limit × nº de instâncias`. Isso segura script ingênuo e engano de clique duplo,
 * que é o caso real aqui. Para teto rígido seria preciso store compartilhado (Upstash/Redis) —
 * decisão adiada por não justificar a dependência neste volume.
 */

type Registro = { contagem: number; expiraEm: number };

const memoria = new Map<string, Registro>();

/** Remove entradas vencidas. Chamado a cada verificação; o mapa nunca cresce sem limite. */
function limpar(agora: number) {
    for (const [chave, reg] of memoria) {
        if (reg.expiraEm <= agora) memoria.delete(chave);
    }
}

/**
 * Identifica o cliente pelo IP. Em Vercel o IP real vem em `x-forwarded-for`
 * (o primeiro da lista; os demais são proxies).
 */
export function identificar(req: Request): string {
    const fwd = req.headers.get("x-forwarded-for");
    if (fwd) return fwd.split(",")[0].trim();
    return req.headers.get("x-real-ip") || "desconhecido";
}

/**
 * @param chave    identificador do cliente (use `identificar(req)`)
 * @param limite   quantas chamadas são permitidas na janela
 * @param janelaMs duração da janela em milissegundos
 * @returns        `ok: false` quando estourou, com `retryEm` em segundos
 */
export function verificarLimite(
    chave: string,
    limite = 3,
    janelaMs = 60_000,
): { ok: boolean; restante: number; retryEm: number } {
    const agora = Date.now();
    limpar(agora);

    const reg = memoria.get(chave);

    if (!reg || reg.expiraEm <= agora) {
        memoria.set(chave, { contagem: 1, expiraEm: agora + janelaMs });
        return { ok: true, restante: limite - 1, retryEm: 0 };
    }

    if (reg.contagem >= limite) {
        return {
            ok: false,
            restante: 0,
            retryEm: Math.ceil((reg.expiraEm - agora) / 1000),
        };
    }

    reg.contagem += 1;
    return { ok: true, restante: limite - reg.contagem, retryEm: 0 };
}

/**
 * Atalho para rotas de formulário: 3 envios por minuto por IP.
 * Retorna `null` quando pode seguir, ou a Response 429 pronta para devolver.
 */
export function limitarFormulario(req: Request): Response | null {
    const { ok, retryEm } = verificarLimite(identificar(req), 3, 60_000);
    if (ok) return null;

    return new Response(
        JSON.stringify({
            error: "Muitas tentativas seguidas. Aguarde um instante e envie de novo.",
        }),
        {
            status: 429,
            headers: {
                "Content-Type": "application/json",
                "Retry-After": String(retryEm),
            },
        },
    );
}
