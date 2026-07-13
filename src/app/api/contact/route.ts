import { Resend } from "resend";
import { NextResponse } from "next/server";
import { emailContato } from "@/lib/email-templates";

export const dynamic = "force-dynamic";

const AUDIENCE_ID = "772bf76a-410e-49c0-8737-76f1c1279114";

export async function POST(req: Request) {
    // Instanciado dentro do handler (runtime), não no build — evita quebrar o build quando RESEND_API_KEY não está no ambiente de build.
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { name, email, topic, message } = await req.json();

    if (!name || !email || !message) {
        return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
    }

    const [notify, confirm] = await Promise.allSettled([
        resend.emails.send({
            from: "RedPro Site <noreply@redpro.com.br>",
            to: "contato@redpro.com.br",
            replyTo: email,
            subject: `[Contato] ${topic || "Mensagem"} — ${name}`,
            html: `
                <h2>Nova mensagem via Fale com o RedPro</h2>
                <p><strong>Nome:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Assunto:</strong> ${topic || "Não informado"}</p>
                <hr/>
                <p><strong>Mensagem:</strong></p>
                <p>${message.replace(/\n/g, "<br/>")}</p>
            `
        }),
        resend.emails.send({
            from: "Red — RedPro AI Academy <noreply@redpro.com.br>",
            to: email,
            subject: "Mensagem recebida.",
            html: emailContato(name)
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
