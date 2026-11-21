import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// QUERO SABER (Imersão, slide 39, ponte do fim da noite 1). Grava na tabela `quero_saber`
// (lida pela Amanda na VPS com a service key). Upsert por e-mail: quem manda duas vezes não duplica.
const SUPABASE_URL = "https://supabase.redpro.com.br";
const INTERESSES = new Set(["squad", "video", "outro"]);
const clip = (v: unknown, n: number) => String(v ?? "").trim().slice(0, n);

export async function POST(req: NextRequest) {
    let d: Record<string, unknown>;
    try {
        d = await req.json();
    } catch {
        return NextResponse.json({ ok: false }, { status: 400 });
    }
    // Campo-isca: robô preenche, gente não. Responde ok sem gravar.
    if (clip(d.site, 50)) return NextResponse.json({ ok: true });

    const nome = clip(d.nome, 120);
    const email = clip(d.email, 160).toLowerCase();
    const whatsapp = clip(d.whatsapp, 40);
    const interesse = INTERESSES.has(String(d.interesse)) ? String(d.interesse) : null;
    const origem = clip(d.origem, 200) || null;

    if (nome.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || whatsapp.replace(/\D/g, "").length < 10) {
        return NextResponse.json({ ok: false, erro: "dados inválidos" }, { status: 422 });
    }

    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!key) {
        console.error("quero-saber: SUPABASE_SERVICE_KEY ausente");
        return NextResponse.json({ ok: false }, { status: 500 });
    }
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/quero_saber?on_conflict=email`, {
            method: "POST",
            headers: {
                apikey: key,
                Authorization: `Bearer ${key}`,
                "Content-Type": "application/json",
                Prefer: "resolution=merge-duplicates,return=minimal",
            },
            body: JSON.stringify({ nome, email, whatsapp, interesse, origem }),
        });
        if (!res.ok) {
            console.error("quero-saber: falha ao gravar —", res.status, await res.text());
            return NextResponse.json({ ok: false }, { status: 502 });
        }
        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error("quero-saber: erro —", e);
        return NextResponse.json({ ok: false }, { status: 502 });
    }
}
