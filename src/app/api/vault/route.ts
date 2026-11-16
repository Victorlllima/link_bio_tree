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
  const { email, whatsapp, resource, consentimento } = await req.json();
  const fone = typeof whatsapp === "string" ? whatsapp.replace(/\D/g, "") : "";

  if (!email || typeof email !== "string" || !/.+@.+\..+/.test(email)) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }
  if (fone.length < 10 || fone.length > 13 || consentimento !== true) {
    return NextResponse.json({ error: "WhatsApp inválido" }, { status: 400 });
  }

  // lead com WhatsApp para a venda pelo WhatsApp (Red, 16/11/2026): tabela vault_leads no Supabase.
  // Não segura o acesso: se a gravação falhar, o lead entra mesmo assim e o erro vai pro log.
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (key) {
    await fetch("https://supabase.redpro.com.br/rest/v1/vault_leads", {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({
        email: email.trim().toLowerCase().slice(0, 160),
        whatsapp: fone,
        recurso: typeof resource === "string" ? resource.slice(0, 120) || null : null,
        consentimento: true,
        user_agent: (req.headers.get("user-agent") ?? "").slice(0, 300) || null,
      }),
    }).then(async (r) => { if (!r.ok) console.error("vault_leads: falha ao gravar", r.status, await r.text()); })
      .catch((e) => console.error("vault_leads:", e));
  } else {
    console.error("vault_leads: SUPABASE_SERVICE_KEY ausente");
  }

  // resolve a audiência (usa a do .env, senão cria uma vez)
  let audienceId = VAULT_AUDIENCE_ID;
  if (!audienceId) {
    const criada = await resend.audiences.create({ name: "RedVault" }).catch(() => null);
    audienceId = criada?.data?.id || "";
  }

  await Promise.allSettled([
    // sem aviso por acesso (Red, 22/10/2026): o resumo das 23h do RedReply (/api/cron/resumo) conta os novos acessos
    // welcome pro lead
    resend.emails.send({
      from: "RedPro AI Academy <suporte@redpro.com.br>",
      to: email,
      subject: "Seu acesso ao RedVault tá liberado.",
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#161617">
          <p>Boa! Seu acesso ao RedVault tá liberado.</p>
          <p>É onde eu solto as skills que uso pra operar com IA. Baixa o .md, joga na pasta do teu projeto e roda.</p>
          <p><a href="https://redpro.com.br/vault" style="display:inline-block;background:#f97316;color:#0a0a0a;font-weight:700;padding:12px 22px;border-radius:100px;text-decoration:none">Abrir o RedVault →</a></p>
          <p style="color:#726f69;font-size:13px">O vault cresce toda semana. Você vai receber por aqui quando entra coisa nova.</p>
        </div>`,
    }),
  ]);

  if (audienceId) {
    await resend.contacts.create({ audienceId, email, unsubscribed: false }).catch(() => null);
  }

  return NextResponse.json({ success: true });
}
