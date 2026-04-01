import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    const { email } = await req.json();

    if (!email) {
        return NextResponse.json({ error: "Email obrigatório" }, { status: 400 });
    }

    const { error } = await resend.emails.send({
        from: "RedPro Site <noreply@redpro.com.br>",
        to: "contato@redpro.com.br",
        subject: `[Newsletter] Nova inscrição — ${email}`,
        html: `
            <h2>Nova inscrição na Newsletter RedPro</h2>
            <p><strong>Email:</strong> ${email}</p>
            <p><em>Cadastrado em ${new Date().toLocaleString("pt-BR")}</em></p>
        `
    });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
