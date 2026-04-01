import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    const { name, email, topic, message } = await req.json();

    if (!name || !email || !message) {
        return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
    }

    const { error } = await resend.emails.send({
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
    });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
