import { Resend } from "resend";
import { NextResponse } from "next/server";
import { emailNewsletter } from "@/lib/email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    const { email } = await req.json();

    if (!email) {
        return NextResponse.json({ error: "Email obrigatório" }, { status: 400 });
    }

    // Envia em paralelo: notificação para Red + boas-vindas para o lead
    const [notify, welcome] = await Promise.allSettled([
        resend.emails.send({
            from: "RedPro Site <noreply@redpro.com.br>",
            to: "contato@redpro.com.br",
            subject: `[REDSHIFT] Nova inscrição — ${email}`,
            html: `<p>Nova inscrição na newsletter REDSHIFT.</p><p><strong>Email:</strong> ${email}</p><p><em>${new Date().toLocaleString("pt-BR")}</em></p>`
        }),
        resend.emails.send({
            from: "Red — RedPro AI Academy <noreply@redpro.com.br>",
            to: email,
            subject: "Bem-vindo à Newsletter REDSHIFT.",
            html: emailNewsletter()
        })
    ]);

    if (notify.status === "rejected" && welcome.status === "rejected") {
        return NextResponse.json({ error: "Erro ao processar inscrição" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
