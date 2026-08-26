import { Resend } from "resend";
import { NextResponse } from "next/server";
import { limitarFormulario } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

// Audiência dedicada do RedVault. Se o ID não estiver no .env, o código cria a audiência
// "RedVault" na primeira chamada e segue. Definir RESEND_VAULT_AUDIENCE_ID depois pra fixar.
const VAULT_AUDIENCE_ID = process.env.RESEND_VAULT_AUDIENCE_ID || "";

export async function POST(req: Request) {
  const bloqueio = limitarFormulario(req);
  if (bloqueio) return bloqueio;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { email, resource } = await req.json();

  if (!email || typeof email !== "string" || !/.+@.+\..+/.test(email)) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  // resolve a audiência (usa a do .env, senão cria uma vez)
  let audienceId = VAULT_AUDIENCE_ID;
  if (!audienceId) {
    const criada = await resend.audiences.create({ name: "RedVault" }).catch(() => null);
    audienceId = criada?.data?.id || "";
  }

  await Promise.allSettled([
    // notifica o Red
    resend.emails.send({
      from: "RedPro Site <noreply@redpro.com.br>",
      to: "contato@redpro.com.br",
      subject: `[REDVAULT] Novo acesso — ${email}`,
      html: `<p>Novo acesso ao RedVault.</p><p><strong>Email:</strong> ${email}</p><p><strong>Veio do resource:</strong> ${resource || "(direto)"}</p><p><em>${new Date().toLocaleString("pt-BR")}</em></p>`,
    }),
    // welcome pro lead
    resend.emails.send({
      from: "Red — RedPro AI Academy <noreply@redpro.com.br>",
      to: email,
      subject: "Seu acesso ao RedVault tá liberado.",
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#161617">
          <p>Boa! Seu acesso ao RedVault tá liberado.</p>
          <p>É onde eu solto tudo que uso pra operar com IA — prompts, skills, guias, clones de mentores. Tá tudo copy-paste, nada pra baixar.</p>
          <p><a href="https://redpro.com.br/vault" style="display:inline-block;background:#f97316;color:#0a0a0a;font-weight:700;padding:12px 22px;border-radius:100px;text-decoration:none">Abrir o Vault →</a></p>
          <p style="color:#726f69;font-size:13px">O vault cresce toda semana. Você vai receber por aqui quando entra coisa nova.</p>
        </div>`,
    }),
  ]);

  if (audienceId) {
    await resend.contacts.create({ audienceId, email, unsubscribed: false }).catch(() => null);
  }

  return NextResponse.json({ success: true });
}
