import { NextResponse } from "next/server";
import { Resend } from "resend";
import { limitarFormulario } from "@/lib/rate-limit";
import { avisarRed } from "@/lib/notificar";

export const dynamic = "force-dynamic";

/* Lista de espera da Formação Arquiteto de Agentes (fora da janela do carrinho).
 *
 * Hoje cada inscrição chega no Telegram do Red. Se existir a env
 * RESEND_FORMACAO_ESPERA_AUDIENCE_ID, o contato também entra nessa audiência do
 * Resend, de onde o aviso de abertura pode ser disparado (BEACON). Sem a env,
 * a lista vive só no Telegram. */

const AUDIENCIA = process.env.RESEND_FORMACAO_ESPERA_AUDIENCE_ID ?? "";

export async function POST(req: Request) {
  const bloqueio = limitarFormulario(req);
  if (bloqueio) return bloqueio;

  const b = await req.json().catch(() => ({}));
  const nome = String(b.nome ?? "").trim().slice(0, 120);
  const email = String(b.email ?? "").trim().toLowerCase().slice(0, 200);
  const whatsapp = String(b.whatsapp ?? "").trim().slice(0, 40);
  const origem = String(b.origem ?? "").slice(0, 300);
  if (!nome || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Nome e e-mail válidos são obrigatórios" }, { status: 400 });
  }

  const aviso = await avisarRed("📋 Lista de espera · Formação Arquiteto de Agentes", {
    Nome: nome,
    Email: email,
    WhatsApp: whatsapp,
    Origem: origem,
  });

  let resend = false;
  if (AUDIENCIA && process.env.RESEND_API_KEY) {
    const r = await new Resend(process.env.RESEND_API_KEY).contacts
      .create({ audienceId: AUDIENCIA, email, firstName: nome.split(" ")[0], unsubscribed: false })
      .catch(() => null);
    resend = !!r && !("error" in r && r.error);
  }

  if (!aviso.ok && !resend) {
    return NextResponse.json({ error: "Não foi possível registrar" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
