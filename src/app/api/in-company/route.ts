import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    const { company, name, role, email, size, context } = await req.json();

    if (!company || !name || !email) {
        return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
    }

    const { error } = await resend.emails.send({
        from: "RedPro Site <noreply@redpro.com.br>",
        to: "solutions@redpro.com.br",
        replyTo: email,
        subject: `[In Company] ${company} — ${name} (${role})`,
        html: `
            <h2>Nova solicitação In Company</h2>
            <p><strong>Empresa:</strong> ${company}</p>
            <p><strong>Responsável:</strong> ${name}</p>
            <p><strong>Cargo:</strong> ${role || "Não informado"}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Tamanho do time:</strong> ${size || "Não informado"}</p>
            <hr/>
            <p><strong>Contexto:</strong></p>
            <p>${(context || "Não informado").replace(/\n/g, "<br/>")}</p>
        `
    });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
