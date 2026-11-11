import { NextRequest, NextResponse } from "next/server";
import { limitarFormulario } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/* PRÉ-CHECKOUT da Imersão (LP /imersao): nome, e-mail e WhatsApp antes de ir para a Hotmart.
   Grava em imersao_pre_checkout (imersao_lote_extra_pre_checkout.sql) com a service key.
   Nunca segura a compra: a página redireciona para o checkout mesmo se isto falhar. */

const SUPABASE_URL = "https://supabase.redpro.com.br";

const txt = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const opc = (v: unknown, max = 200) => txt(v, max) || null;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
    const limitado = limitarFormulario(req);
    if (limitado) return limitado;

    let d: Record<string, unknown>;
    try {
        d = await req.json();
    } catch {
        return NextResponse.json({ ok: false }, { status: 400 });
    }

    const nome = txt(d.nome, 120);
    const email = txt(d.email, 160).toLowerCase();
    const whatsapp = txt(d.whatsapp, 30).replace(/\D/g, "");
    if (!nome || !EMAIL.test(email) || whatsapp.length < 10 || whatsapp.length > 13 || d.consentimento !== true) {
        return NextResponse.json({ ok: false }, { status: 400 });
    }

    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!key) {
        console.error("imersao-pre-checkout: SUPABASE_SERVICE_KEY ausente");
        return NextResponse.json({ ok: false }, { status: 500 });
    }

    const lote = Number(d.lote);
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/imersao_pre_checkout`, {
            method: "POST",
            headers: {
                apikey: key,
                Authorization: `Bearer ${key}`,
                "Content-Type": "application/json",
                Prefer: "return=minimal",
            },
            body: JSON.stringify({
                nome,
                email,
                whatsapp,
                lote: Number.isInteger(lote) && lote >= 1 && lote <= 4 ? lote : null,
                oferta: opc(d.oferta, 40),
                sck: opc(d.sck),
                src: opc(d.src),
                utm_source: opc(d.utm_source),
                utm_medium: opc(d.utm_medium),
                utm_campaign: opc(d.utm_campaign),
                utm_content: opc(d.utm_content),
                utm_term: opc(d.utm_term),
                consentimento: true,
                user_agent: (req.headers.get("user-agent") ?? "").slice(0, 300) || null,
            }),
        });
        if (!res.ok) {
            console.error("imersao-pre-checkout: falha ao gravar", res.status, await res.text());
            return NextResponse.json({ ok: false }, { status: 502 });
        }
        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error("imersao-pre-checkout:", e);
        return NextResponse.json({ ok: false }, { status: 502 });
    }
}
