import { Resend } from "resend";
import { NextResponse } from "next/server";
import { emailSharkListaEspera } from "@/lib/email-templates";

export const dynamic = "force-dynamic";


// TODO: Criar audience "lista-espera-formacao-shark" no Resend dashboard
// e substituir o valor da env var RESEND_SHARK_AUDIENCE_ID pelo ID real
// Dashboard: https://resend.com/audiences
const SHARK_AUDIENCE_ID = process.env.RESEND_SHARK_AUDIENCE_ID ?? "";

export async function POST(req: Request) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { nome, email } = await req.json();
    const eventId = `lead_shark_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    if (!email) {
        return NextResponse.json({ error: "Email obrigatório" }, { status: 400 });
    }

    if (!nome) {
        return NextResponse.json({ error: "Nome obrigatório" }, { status: 400 });
    }

    const primeiroNome = nome.split(" ")[0];
    const agora = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

    const [notify, welcome] = await Promise.allSettled([
        // Notificação interna
        resend.emails.send({
            from: "RedPro Site <noreply@redpro.com.br>",
            to: "contato@redpro.com.br",
            subject: `[SHARK] Novo lead — ${email}`,
            html: `<p><strong>Nome:</strong> ${nome}</p><p><strong>Email:</strong> ${email}</p><p><em>${agora}</em></p>`
        }),
        // E-mail de boas-vindas D0 para o lead
        resend.emails.send({
            from: "Red — RedPro AI Academy <noreply@redpro.com.br>",
            to: email,
            subject: "[Formação S.H.A.R.K.] Você está na lista — carrinho abre 23/jul",
            html: emailSharkListaEspera(primeiroNome)
        })
    ]);

    // Adicionar à Audience de lista de espera S.H.A.R.K.
    if (SHARK_AUDIENCE_ID) {
        await resend.contacts.create({
            audienceId: SHARK_AUDIENCE_ID,
            email,
            firstName: primeiroNome,
            lastName: nome.split(" ").slice(1).join(" ") || undefined,
            unsubscribed: false,
        }).catch(() => null);
    }

    if (notify.status === "rejected" && welcome.status === "rejected") {
        return NextResponse.json({ error: "Erro ao processar inscrição" }, { status: 500 });
    }

    // CAPI — evento Lead para deduplicação com o fbq client-side
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? "https://redpro.com.br"}/api/meta-capi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            event_name: "Lead",
            event_id: eventId,
            user_data: { em: email },
            custom_data: { content_name: "SHARK Lista de Espera" },
        }),
    }).catch(() => null);

    return NextResponse.json({ success: true, event_id: eventId });
}
