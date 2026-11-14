import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

/**
 * Webhook da Cloud API (Meta): status de entrega (sent/delivered/read/failed) e opt-out ("SAIR").
 * GET = handshake (hub.verify_token = WHATSAPP_OFICIAL_VERIFY_TOKEN). POST = confere X-Hub-Signature-256 com o app secret.
 * NÃO configurado na Meta ainda (aguarda ok do Red). Não envia nada.
 */
export const dynamic = "force-dynamic";
const URL_ = "https://supabase.redpro.com.br";
const H = () => { const k = process.env.SUPABASE_SERVICE_KEY!; return { apikey: k, Authorization: `Bearer ${k}`, "Content-Type": "application/json" }; };

export async function GET(req: NextRequest) {
    const q = req.nextUrl.searchParams;
    if (q.get("hub.mode") === "subscribe" && process.env.WHATSAPP_OFICIAL_VERIFY_TOKEN && q.get("hub.verify_token") === process.env.WHATSAPP_OFICIAL_VERIFY_TOKEN)
        return new NextResponse(q.get("hub.challenge") || "", { status: 200 });
    return new NextResponse("forbidden", { status: 403 });
}

export async function POST(req: NextRequest) {
    const raw = await req.text();
    const segredo = process.env.WHATSAPP_OFICIAL_APP_SECRET;
    const sig = req.headers.get("x-hub-signature-256") || "";
    if (!segredo) return new NextResponse("sem app secret", { status: 503 });
    const esperado = "sha256=" + crypto.createHmac("sha256", segredo).update(raw).digest("hex");
    if (sig.length !== esperado.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(esperado))) return new NextResponse("assinatura inválida", { status: 401 });

    const corpo = JSON.parse(raw);
    for (const e of corpo.entry || []) for (const c of e.changes || []) {
        const v = c.value || {};
        for (const s of v.statuses || []) {
            const mapa: Record<string, string> = { sent: "enviado", delivered: "entregue", read: "lido", failed: "falhou" };
            const st = mapa[s.status]; if (!st) continue;
            await fetch(`${URL_}/rest/v1/wpp_oficial_envios?wamid=eq.${encodeURIComponent(s.id)}`, {
                method: "PATCH", headers: H(),
                body: JSON.stringify({ status: st, ...(st === "falhou" ? { erro: JSON.stringify(s.errors || []).slice(0, 300) } : {}), atualizado_em: new Date().toISOString() }),
            });
        }
        for (const m of v.messages || []) {
            const texto = (m.text?.body || m.button?.text || "").trim().toUpperCase();
            if (texto === "SAIR") await fetch(`${URL_}/rest/v1/wpp_oficial_optout?on_conflict=telefone`, {
                method: "POST", headers: { ...H(), Prefer: "resolution=ignore-duplicates" }, body: JSON.stringify({ telefone: String(m.from), motivo: "SAIR" }),
            });
        }
    }
    return new NextResponse("ok", { status: 200 });
}
