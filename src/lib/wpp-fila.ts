/**
 * Fila de disparo 1:1 em massa — a peça anti-ban de verdade.
 *
 * Existe para o cenário: avisar N compradores no privado ("a aula começou",
 * "o carrinho abriu"). Disparo em massa é o que queima número — e o que queima
 * NÃO é o volume, é o PADRÃO. A fonte (pesquisa 22/07): "300 mensagens em 4
 * minutos parece bot; 300 ao longo de horas, com intervalos variados, parece
 * humano ocupado."
 *
 * Guardrails aplicados aqui:
 *  1. Intervalo ALEATÓRIO entre pessoas (não fixo)      → não parece cron
 *  2. Lotes com pausa longa entre eles                  → "ondas controladas"
 *  3. Janela de horário (só 8h-21h GMT-3)               → denúncia = causa nº 1
 *  4. Texto VARIADO por pessoa (via wpp-humanizar)      → idêntico em massa = ban
 *  5. Circuit breaker: 3 falhas seguidas → PARA         → protege o número
 *  6. Teto de envios por execução                       → nunca uma rajada gigante
 *
 * ⚠️ Vercel Hobby: função morre em ~60s e cron só roda 1x/dia. Por isso a fila
 * NÃO processa um lote grande de uma vez. Cada chamada envia UMA mensagem, espera
 * o intervalo aleatório e reaciona a próxima (a rota do cron se auto-chama). O
 * estado de progresso vive no banco (wpp_fila), então parar/retomar é seguro.
 */

import { enviarMensagem } from "./whatsapp";

// ── Parâmetros (todos ajustáveis por env, com padrão seguro) ────────────────
const INTERVALO_MIN_MS = num("WPP_INTERVALO_MIN_MS", 45_000); // 45s
const INTERVALO_MAX_MS = num("WPP_INTERVALO_MAX_MS", 90_000); // 90s
const JANELA_INICIO = num("WPP_JANELA_INICIO", 8); // hora GMT-3
const JANELA_FIM = num("WPP_JANELA_FIM", 21);
const MAX_FALHAS_SEGUIDAS = num("WPP_MAX_FALHAS", 3);

function num(k: string, padrao: number): number {
    const v = Number(process.env[k]);
    return Number.isFinite(v) && v > 0 ? v : padrao;
}

const SUPABASE_URL = "https://supabase.redpro.com.br";

export type ItemFila = {
    id: number;
    telefone: string;
    nome: string;
    campanha: string;
    status: "pendente" | "enviado" | "falhou";
};

/** Hora atual em GMT-3 (Brasil fixo, sem horário de verão). */
function horaBrasil(): number {
    // UTC - 3. getUTCHours evita depender do fuso do runtime da Vercel.
    return (new Date().getUTCHours() + 24 - 3) % 24;
}

export function dentroDaJanela(): boolean {
    const h = horaBrasil();
    return h >= JANELA_INICIO && h < JANELA_FIM;
}

function intervaloAleatorio(): number {
    return INTERVALO_MIN_MS + Math.floor(Math.random() * (INTERVALO_MAX_MS - INTERVALO_MIN_MS));
}

const dormir = (ms: number) => new Promise((r) => setTimeout(r, ms));

function headers() {
    const key = process.env.SUPABASE_SERVICE_KEY!;
    return { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

/** Puxa o próximo pendente de uma campanha (o mais antigo). */
async function proximoItem(campanha: string): Promise<ItemFila | null> {
    const res = await fetch(
        `${SUPABASE_URL}/rest/v1/wpp_fila` +
        `?campanha=eq.${encodeURIComponent(campanha)}&status=eq.pendente` +
        `&select=id,telefone,nome,campanha,status&order=id.asc&limit=1`,
        { headers: headers() },
    );
    if (!res.ok) return null;
    const arr = await res.json();
    return Array.isArray(arr) && arr[0] ? arr[0] : null;
}

async function marcar(id: number, status: "enviado" | "falhou", erro?: string) {
    await fetch(`${SUPABASE_URL}/rest/v1/wpp_fila?id=eq.${id}`, {
        method: "PATCH",
        headers: { ...headers(), Prefer: "return=minimal" },
        body: JSON.stringify({ status, erro: erro?.slice(0, 300) ?? null, processado_em: "now()" }),
    }).catch(() => { /* não trava a cadeia */ });
}

/**
 * Conta falhas nos últimos N itens processados de uma campanha (circuit breaker
 * persistente — no modelo auto-encadeado o contador não pode viver em memória,
 * cada request é isolada).
 */
async function falhasRecentesSeguidas(campanha: string): Promise<number> {
    const res = await fetch(
        `${SUPABASE_URL}/rest/v1/wpp_fila` +
        `?campanha=eq.${encodeURIComponent(campanha)}&status=in.(enviado,falhou)` +
        `&select=status&order=processado_em.desc&limit=${MAX_FALHAS_SEGUIDAS}`,
        { headers: headers() },
    );
    if (!res.ok) return 0;
    const arr: Array<{ status: string }> = await res.json();
    let seguidas = 0;
    for (const r of arr) {
        if (r.status === "falhou") seguidas++;
        else break;
    }
    return seguidas;
}

export type ResultadoTick = {
    enviou: boolean;
    parou: "enviado" | "fora_da_janela" | "circuit_breaker" | "fila_vazia";
    restam: number;
    proximoEmMs?: number; // quanto esperar antes de reacionar
};

/**
 * Processa UM item da campanha e diz quanto esperar até o próximo.
 *
 * O chamador (rota do cron) usa `proximoEmMs` para agendar a auto-chamada. Um
 * envio por request mantém cada função curta (cabe no teto do Hobby) e o
 * intervalo aleatório vive ENTRE as requests, não dentro de um loop.
 *
 * `render(item)` devolve o texto já humanizado — a fila não conhece o conteúdo.
 */
export async function processarProximo(
    campanha: string,
    render: (item: ItemFila) => string,
): Promise<ResultadoTick> {
    if (!dentroDaJanela()) {
        return { enviou: false, parou: "fora_da_janela", restam: await contarPendentes(campanha) };
    }

    // Circuit breaker: se as últimas N tentativas falharam, para.
    if ((await falhasRecentesSeguidas(campanha)) >= MAX_FALHAS_SEGUIDAS) {
        return { enviou: false, parou: "circuit_breaker", restam: await contarPendentes(campanha) };
    }

    const item = await proximoItem(campanha);
    if (!item) return { enviou: false, parou: "fila_vazia", restam: 0 };

    const r = await enviarMensagem(item.telefone, render(item));
    await marcar(item.id, r.ok ? "enviado" : "falhou", r.ok ? undefined : (r as { erro?: string }).erro);

    const restam = await contarPendentes(campanha);
    return {
        enviou: r.ok,
        parou: "enviado",
        restam,
        proximoEmMs: restam > 0 ? intervaloAleatorio() : undefined,
    };
}

// dormir é usado pela rota do cron ao encadear (mantido exportável).
export { dormir };

export async function contarPendentes(campanha: string): Promise<number> {
    const res = await fetch(
        `${SUPABASE_URL}/rest/v1/wpp_fila?campanha=eq.${encodeURIComponent(campanha)}&status=eq.pendente&select=id`,
        { headers: { ...headers(), Prefer: "count=exact" } },
    );
    const range = res.headers.get("content-range") || "";
    const total = range.split("/")[1];
    return total ? Number(total) : 0;
}

/** Enfileira uma lista de destinatários numa campanha (idempotente por telefone+campanha). */
export async function enfileirar(
    campanha: string,
    destinatarios: Array<{ telefone: string; nome: string }>,
): Promise<{ ok: boolean; inseridos: number; erro?: string }> {
    if (!destinatarios.length) return { ok: true, inseridos: 0 };
    const linhas = destinatarios.map((d) => ({
        campanha, telefone: d.telefone, nome: d.nome, status: "pendente",
    }));
    const res = await fetch(
        `${SUPABASE_URL}/rest/v1/wpp_fila?on_conflict=campanha,telefone`,
        {
            method: "POST",
            headers: { ...headers(), Prefer: "resolution=ignore-duplicates,return=minimal" },
            body: JSON.stringify(linhas),
        },
    );
    if (!res.ok) return { ok: false, inseridos: 0, erro: `${res.status} ${await res.text()}` };
    return { ok: true, inseridos: linhas.length };
}
