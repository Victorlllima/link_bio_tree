/**
 * Link da sala ao vivo da Imersão (redpro.com.br/sala/<noite>), usado no botão do template B3 e no grupo.
 * Fonte do link, nesta ordem: coluna imersao_config.links_sala (jsonb {"noite1": "...", ...}, se existir)
 * e depois as variáveis SALA_NOITE1 / SALA_NOITE2 / SALA_LIVE.
 * FALHA FECHADA: sem link válido (ou banco fora) a rota mostra /sala/aguarde ("o link sai no grupo").
 */
const SUPABASE_URL = "https://supabase.redpro.com.br";
export const NOITES = ["noite1", "noite2", "live"] as const;
export type Noite = (typeof NOITES)[number];
const LINK_RE = /^https:\/\/([a-z0-9-]+\.)*(zoom\.us|zoom\.com|youtube\.com|youtu\.be|meet\.google\.com|streamyard\.com)\/\S+$/i;

export const ehNoite = (n: string): n is Noite => (NOITES as readonly string[]).includes(n);
export const linkValido = (u: unknown): u is string => typeof u === "string" && LINK_RE.test(u.trim());

export async function linkDaSala(noite: Noite, f: typeof fetch = fetch, key = process.env.SUPABASE_SERVICE_KEY ?? ""): Promise<string | null> {
    if (key) {
        try {
            const r = await f(`${SUPABASE_URL}/rest/v1/imersao_config?select=*&limit=1`, {
                headers: { apikey: key, Authorization: `Bearer ${key}` },
                cache: "no-store",
                signal: AbortSignal.timeout(4000),
            });
            if (r.ok) {
                const [cfg] = (await r.json()) as Array<Record<string, unknown>>;
                const links = cfg?.links_sala as Record<string, unknown> | undefined;
                const u = links?.[noite];
                if (linkValido(u)) return u.trim();
            }
        } catch {
            /* cai para a variável de ambiente */
        }
    }
    const env = process.env[`SALA_${noite.toUpperCase()}`];
    return linkValido(env) ? env.trim() : null;
}
