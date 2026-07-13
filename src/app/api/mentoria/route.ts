import { Resend } from "resend";
import { NextResponse } from "next/server";
import { emailMentoria } from "@/lib/email-templates";

export const dynamic = "force-dynamic";

const AUDIENCE_ID = "772bf76a-410e-49c0-8737-76f1c1279114";

export async function POST(req: Request) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { name, email, area, level, challenge } = await req.json();

    if (!name || !email) {
        return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
    }

    const [notify, confirm] = await Promise.allSettled([
        resend.emails.send({
            from: "RedPro Site <noreply@redpro.com.br>",
            to: "contato@redpro.com.br",
            replyTo: email,
            subject: `[Mentoria] Aplicação — ${name}`,
            html: `
                <h2>Nova aplicação à Mentoria RedPro</h2>
                <p><strong>Nome:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Área:</strong> ${area || "Não informado"}</p>
                <p><strong>Nível:</strong> ${level || "Não informado"}</p>
                <hr/>
                <p><strong>Maior obstáculo:</strong></p>
                <p>${(challenge || "Não informado").replace(/\n/g, "<br/>")}</p>
            `
        }),
        resend.emails.send({
            from: "Red — RedPro AI Academy <noreply@redpro.com.br>",
            to: email,
            subject: "Aplicação recebida — próximos passos.",
            html: emailMentoria(name)
        })
    ]);

    // Adicionar à Audience com nome
    await resend.contacts.create({
        audienceId: AUDIENCE_ID,
        email,
        firstName: name.split(" ")[0],
        lastName: name.split(" ").slice(1).join(" ") || undefined,
        unsubscribed: false,
    }).catch(() => null);

    if (notify.status === "rejected" && confirm.status === "rejected") {
        return NextResponse.json({ error: "Erro ao enviar" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
