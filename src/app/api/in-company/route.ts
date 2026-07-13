import { Resend } from "resend";
import { NextResponse } from "next/server";
import { emailInCompany } from "@/lib/email-templates";

export const dynamic = "force-dynamic";

const AUDIENCE_ID = "772bf76a-410e-49c0-8737-76f1c1279114";

export async function POST(req: Request) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { company, name, role, email, size, context } = await req.json();

    if (!company || !name || !email) {
        return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
    }

    const [notify, confirm] = await Promise.allSettled([
        resend.emails.send({
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
        }),
        resend.emails.send({
            from: "Equipe RedPro <noreply@redpro.com.br>",
            to: email,
            subject: "Solicitação In Company recebida.",
            html: emailInCompany(name, company)
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
