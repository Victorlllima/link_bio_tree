/**
 * Entrada no grupo da Imersão só por link nosso (QG 2.6, Pedido 9, Red 06/11/2026).
 * Cada comprador tem um token (tabela imersao_tokens); /grupo/<token> confere e leva ao convite.
 * FALHA FECHADA: qualquer dúvida (banco fora, token inválido, reembolsado, grupos lotados, link torto)
 * devolve { ok:false } e a rota manda para /grupo/nao-encontrado, sem o convite.
 *
 * Contador por grupo: o primeiro clique do token fixa o grupo (principal ou reserva) pelo número de
 * tokens já atribuídos àquele grupo (limite_grupo / limite da reserva, padrão 900). Cliques seguintes
 * do mesmo token voltam ao mesmo grupo.
 */
import crypto from "node:crypto";

const SUPABASE_URL = "https://supabase.redpro.com.br";
export const TOKEN_RE = /^[A-Za-z0-9_-]{16,64}$/;
const CONVITE_RE = /^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]{10,40}$/;

export type Fetcher = typeof fetch;
export type ResultadoGrupo = { ok: true; link: string; grupo: string } | { ok: false; motivo: string };

export const novoToken = () => crypto.randomBytes(16).toString("base64url");

const hdr = (key: string, extra: Record<string, string> = {}) => ({
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...extra,
});

export async function resolverGrupo(token: string, f: Fetcher = fetch, key = process.env.SUPABASE_SERVICE_KEY ?? ""): Promise<ResultadoGrupo> {
    try {
        if (!key) return { ok: false, motivo: "sem chave do banco" };
        if (!TOKEN_RE.test(token)) return { ok: false, motivo: "token malformado" };
        const get = async (path: string, extra: Record<string, string> = {}) => {
            const r = await f(`${SUPABASE_URL}/rest/v1/${path}`, { headers: hdr(key, extra), cache: "no-store" });
            if (!r.ok) throw new Error(`${path.split("?")[0]} ${r.status}`);
            return r;
        };

        const tk = (await (await get(`imersao_tokens_validos?token=eq.${token}&select=token,grupo&limit=1`)).json()) as { grupo: string | null }[];
        if (!tk.length) return { ok: false, motivo: "token inexistente, reembolsado ou cancelado" };

        const cfg = ((await (await get("imersao_config?select=link_grupo,limite_grupo&limit=1")).json()) as { link_grupo: string | null; limite_grupo: number | null }[])[0];
        const reservas = (await (await get("imersao_grupos_reserva?ativo=eq.true&select=id,link,limite&order=ordem.asc")).json()) as { id: string; link: string; limite: number }[];
        const candidatos = [
            { id: "principal", link: cfg?.link_grupo ?? "", limite: cfg?.limite_grupo ?? 900 },
            ...reservas.map((r) => ({ id: r.id, link: r.link, limite: r.limite })),
        ];

        let escolhido = tk[0].grupo ? candidatos.find((c) => c.id === tk[0].grupo) : undefined;
        if (!escolhido) {
            for (const c of candidatos) {
                if (!CONVITE_RE.test(c.link)) continue;
                const r = await get(`imersao_tokens?grupo=eq.${encodeURIComponent(c.id)}&select=token`, { Prefer: "count=exact", Range: "0-0" });
                const n = Number(r.headers.get("content-range")?.split("/")[1]);
                if (!Number.isFinite(n)) throw new Error("contagem ilegível");
                if (n < c.limite) { escolhido = c; break; }
            }
            if (!escolhido) return { ok: false, motivo: "todos os grupos lotados ou sem link" };
            const p = await f(`${SUPABASE_URL}/rest/v1/imersao_tokens?token=eq.${token}&grupo=is.null`, {
                method: "PATCH",
                headers: hdr(key, { Prefer: "return=minimal" }),
                body: JSON.stringify({ grupo: escolhido.id, usado_em: new Date().toISOString() }),
                cache: "no-store",
            });
            if (!p.ok) throw new Error(`atribuir grupo ${p.status}`);
        }
        if (!CONVITE_RE.test(escolhido.link)) return { ok: false, motivo: "link do grupo inválido" };
        return { ok: true, link: escolhido.link, grupo: escolhido.id };
    } catch (e) {
        return { ok: false, motivo: `erro: ${e instanceof Error ? e.message : String(e)}` };
    }
}

/** Token já existente da transação, ou cria um (idempotente: reentrega do webhook devolve o mesmo). Null se falhar. */
export async function garantirToken(transacao: string, f: Fetcher = fetch, key = process.env.SUPABASE_SERVICE_KEY ?? ""): Promise<string | null> {
    try {
        if (!key || !transacao) return null;
        const ler = async () => {
            const r = await f(`${SUPABASE_URL}/rest/v1/imersao_tokens?transacao=eq.${encodeURIComponent(transacao)}&select=token&limit=1`, { headers: hdr(key), cache: "no-store" });
            if (!r.ok) throw new Error(`ler ${r.status}`);
            return ((await r.json()) as { token: string }[])[0]?.token ?? null;
        };
        const ja = await ler();
        if (ja) return ja;
        const c = await f(`${SUPABASE_URL}/rest/v1/imersao_tokens?on_conflict=transacao`, {
            method: "POST",
            headers: hdr(key, { Prefer: "resolution=ignore-duplicates,return=minimal" }),
            body: JSON.stringify({ token: novoToken(), transacao }),
            cache: "no-store",
        });
        if (!c.ok) return null;
        return await ler();
    } catch {
        return null;
    }
}

export const URL_GRUPO = "https://www.redpro.com.br/grupo/";
export const urlDoGrupo = (token: string) => `${URL_GRUPO}${token}`;
