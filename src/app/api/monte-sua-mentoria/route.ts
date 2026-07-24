import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const SUPABASE_URL = "https://supabase.redpro.com.br";

// Pedido do catálogo self-service "Monte sua mentoria": o visitante marcou N módulos avulsos,
// o total somou em tempo real e ele enviou o contato. Grava no banco, avisa o Red por
// e-mail (Resend) e Telegram. O Red entra em contato pra fechar.

type Pedido = {
    nome?: string;
    email?: string;
    whatsapp?: string;
    modulos?: string[];
    modulos_ids?: string[];
    total?: number;
    sugestao?: string;
};

// Grava no banco. Nunca derruba a resposta: se o Supabase falhar, as notificações ainda vão.
async function salvar(d: Pedido) {
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!key) return { ok: false, erro: "SUPABASE_SERVICE_KEY ausente" };
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/monte_sua_mentoria`, {
            method: "POST",
            headers: {
                apikey: key,
                Authorization: `Bearer ${key}`,
                "Content-Type": "application/json",
                Prefer: "resolution=merge-duplicates,return=minimal",
            },
            body: JSON.stringify({
                nome: (d.nome || "").trim(),
                email: (d.email || "").toLowerCase().trim(),
                whatsapp: (d.whatsapp || "").trim(),
                // modulos como texto JSON pra simplicidade (coluna text). Se a coluna for text[],
                // trocar por: modulos: d.modulos || []
                modulos: JSON.stringify(d.modulos || []),
                total: Number(d.total) || 0,
                sugestao: (d.sugestao || "").trim() || null,
            }),
        });
        if (!res.ok) return { ok: false, erro: `${res.status} ${await res.text()}` };
        return { ok: true };
    } catch (e) {
        return { ok: false, erro: String(e) };
    }
}

const fmt = (n: number) => (Number(n) || 0).toLocaleString("pt-BR");

export async function POST(req: NextRequest) {
    try {
        const d: Pedido = await req.json();

        const nome = (d.nome || "").trim() || "—";
        const email = (d.email || "").trim() || "—";
        const whatsapp = (d.whatsapp || "").trim() || "—";
        const modulos = Array.isArray(d.modulos) ? d.modulos : [];
        const total = Number(d.total) || 0;
        const sugestao = (d.sugestao || "").trim();

        // Persistir ANTES de notificar: o dado no banco é o que sobrevive.
        const gravou = await salvar(d);
        if (!gravou.ok) console.error("monte-sua-mentoria: falha ao gravar —", gravou.erro);

        // --- E-MAIL (Resend) ---
        try {
            const resend = new Resend(process.env.RESEND_API_KEY);
            const listaHtml = modulos.length
                ? `<ul style="margin:8px 0 0;padding-left:18px;color:#333">${modulos
                      .map((m) => `<li style="margin-bottom:6px">${m}</li>`)
                      .join("")}</ul>`
                : "<p>—</p>";

            await resend.emails.send({
                from: "Monte sua Mentoria <noreply@redpro.com.br>",
                to: "contato@redpro.com.br",
                subject: `🎯 Novo pedido — ${nome} — R$ ${fmt(total)}`,
                html: `
                    <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#222">
                        <h2 style="color:#F97316;margin:0 0 16px">Novo pedido — Monte sua mentoria</h2>
                        ${gravou.ok ? "" : '<p style="color:#b91c1c"><strong>⚠️ Não gravou no banco — ver logs.</strong></p>'}
                        <p><strong>Nome:</strong> ${nome}</p>
                        <p><strong>E-mail:</strong> ${email}</p>
                        <p><strong>WhatsApp:</strong> ${whatsapp}</p>
                        <p style="margin-top:18px"><strong>Módulos escolhidos (${modulos.length}):</strong></p>
                        ${listaHtml}
                        <p style="margin-top:18px;font-size:20px"><strong>Total: R$ ${fmt(total)}</strong></p>
                        ${sugestao ? `<div style="margin-top:18px;padding:12px 14px;background:#FFF7ED;border-left:3px solid #F97316;border-radius:6px"><strong style="color:#F97316">💡 Sugestão de tema (não estava na página):</strong><p style="margin:6px 0 0;color:#333">${sugestao.replace(/</g, "&lt;")}</p></div>` : ""}
                        <p style="color:#888;font-size:12px;margin-top:24px">${new Date().toLocaleString("pt-BR")}</p>
                    </div>
                `,
            });
        } catch (e) {
            console.error("monte-sua-mentoria: falha no Resend —", e);
        }

        // --- TELEGRAM ---
        const listaTg = modulos.length
            ? modulos.map((m) => `• ${m}`).join("\n")
            : "—";
        const msg = [
            "🎯 *Novo pedido — Monte sua mentoria*",
            gravou.ok ? "" : "⚠️ _não gravou no banco — ver logs_",
            "",
            `👤 *Nome:* ${nome}`,
            `📧 *Email:* ${email}`,
            `📱 *WhatsApp:* ${whatsapp}`,
            "",
            `📦 *Módulos (${modulos.length}):*`,
            listaTg,
            "",
            `💰 *Total:* R$ ${fmt(total)}`,
            sugestao ? "" : "",
            sugestao ? `💡 *Sugestão de tema:*\n${sugestao}` : "",
        ].filter(Boolean).join("\n");

        const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

        if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: msg, parse_mode: "Markdown" }),
            });
        }

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("monte-sua-mentoria route error:", err);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}
