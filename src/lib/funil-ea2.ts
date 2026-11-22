import { readFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

// Funil de upsell EA² (Red, 22/11/2026). Classifica a compra pela oferta, registra no Supabase
// e diz se é o upsell 2 (consultoria), que avisa NETO e Rigel e marca o aluno para a Amanda não responder sozinha.
export type EtapaEa2 = "ea2_oferta1" | "ea2_oferta2" | "upsell1_fa2" | "upsell2_consultoria" | "fa2_avulsa" | "fa2_renovacao" | "ea2_ingresso";

export const OFERTAS_EA2: Record<string, { etapa: EtapaEa2; valor: number }> = {
    "4vj21bfg": { etapa: "ea2_oferta1", valor: 1250 },
    "24mnfz2e": { etapa: "ea2_oferta2", valor: 1500 },
    "ioehae1s": { etapa: "upsell1_fa2", valor: 4750 }, // Purchase de R$4.750 (diferença paga no upsell 1)
    "gig2ersp": { etapa: "upsell2_consultoria", valor: 12500 },
    "fo6p6zkb": { etapa: "fa2_avulsa", valor: 8000 },
    "l23ajx77": { etapa: "fa2_renovacao", valor: 5000 },
};
export const PRODUTOS_FUNIL_EA2 = new Set(["8660306", "9039408", "9039445"]);

export function classificarEa2(produtoId: string, oferta: string) {
    if (!PRODUTOS_FUNIL_EA2.has(produtoId)) return null;
    const o = OFERTAS_EA2[oferta];
    return o ? { ...o, conhecida: true } : { etapa: "oferta_desconhecida" as const, valor: 0, conhecida: false };
}

export async function registrarFunilEa2(supabaseUrl: string, row: Record<string, unknown>) {
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!key) return { ok: false, erro: "SUPABASE_SERVICE_KEY ausente" };
    try {
        const r = await fetch(`${supabaseUrl}/rest/v1/funil_ea2_eventos?on_conflict=transacao,evento`, {
            method: "POST",
            headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "resolution=ignore-duplicates,return=representation" },
            body: JSON.stringify(row),
        });
        if (!r.ok) return { ok: false, erro: `${r.status} ${await r.text()}` };
        // novo=false: a Hotmart reentregou o mesmo evento; nada de aviso ou e-mail de novo.
        return { ok: true, novo: ((await r.json()) as unknown[]).length > 0 };
    } catch (e) {
        return { ok: false, erro: String(e) };
    }
}

/* ------------------------------------------------------------------
 * GUIAS DE BÔNUS DO EA² (Red, 22/11/2026)
 * Os 3 guias do Hermes saíram da área de membros do EA² e vão por e-mail
 * só para quem comprou a oferta ao vivo 4vj21bfg. Uma vez por transação
 * (marca GUIAS_ENVIADOS em funil_ea2_eventos). O repositório é PÚBLICO: os PDFs ficam
 * em privado/guias-ea2 CIFRADOS (AES-256-GCM: iv 12 bytes + tag 16 + dados) e só são
 * abertos aqui com GUIAS_EA2_KEY (env da Vercel; hex de 32 bytes). Nunca commitar o PDF aberto.
 * ---------------------------------------------------------------- */

export const OFERTA_COM_GUIAS = "4vj21bfg";
const GUIAS = [
    { arquivo: "100-plugins-do-hermes.pdf", titulo: "100 plugins do Hermes" },
    { arquivo: "50-casos-de-uso-do-hermes.pdf", titulo: "50 casos de uso do Hermes" },
    { arquivo: "segundo-cerebro-com-o-hermes.pdf", titulo: "Segundo cérebro com o Hermes" },
];

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export function emailGuiasEa2(nome: string) {
    const primeiro = esc((nome || "").trim().split(/\s+/)[0] || "");
    const itens = GUIAS.map((g) => `<li style="margin:0 0 6px;">${g.titulo}</li>`).join("");
    return {
        subject: "Seus 3 guias de bônus do EA²",
        html: `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#09090b;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:40px 16px;"><tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#111113;border:1px solid #1f1f23;border-radius:16px;"><tr><td style="padding:36px;">
<p style="font-weight:900;font-size:18px;color:#fff;margin:0 0 24px;">RedPro AI Academy</p>
<p style="font-size:15px;line-height:1.7;color:#d4d4d8;margin:0 0 16px;">Oi${primeiro ? " " + primeiro : ""},</p>
<p style="font-size:15px;line-height:1.7;color:#d4d4d8;margin:0 0 16px;">Você garantiu o EA² na oferta ao vivo, e os 3 guias de bônus estão anexados a este e-mail:</p>
<ul style="font-size:15px;line-height:1.7;color:#d4d4d8;margin:0 0 16px;padding-left:20px;">${itens}</ul>
<p style="font-size:15px;line-height:1.7;color:#d4d4d8;margin:0 0 16px;">Guarde este e-mail. Se algum anexo não abrir, responda aqui que a equipe reenvia.</p>
<p style="font-size:15px;line-height:1.7;color:#d4d4d8;margin:24px 0 0;">Red</p>
</td></tr></table></td></tr></table></body></html>`,
    };
}

export async function guiasJaEnviados(supabaseUrl: string, transacao: string): Promise<boolean> {
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!key) return true; // sem como checar: não arrisca mandar duas vezes
    try {
        const r = await fetch(`${supabaseUrl}/rest/v1/funil_ea2_eventos?transacao=eq.${encodeURIComponent(transacao)}&evento=eq.GUIAS_ENVIADOS&select=id`, {
            headers: { apikey: key, Authorization: `Bearer ${key}` },
        });
        if (!r.ok) return true;
        return ((await r.json()) as unknown[]).length > 0;
    } catch {
        return true;
    }
}

function abrir(buf: Buffer): Buffer {
    const hex = process.env.GUIAS_EA2_KEY ?? "";
    if (hex.length !== 64) throw new Error("GUIAS_EA2_KEY ausente ou inválida");
    const d = crypto.createDecipheriv("aes-256-gcm", Buffer.from(hex, "hex"), buf.subarray(0, 12));
    d.setAuthTag(buf.subarray(12, 28));
    return Buffer.concat([d.update(buf.subarray(28)), d.final()]);
}

export async function enviarGuiasEa2(email: string, nome: string, remetente: string) {
    const key = process.env.RESEND_API_KEY;
    if (!key || !email) return { ok: false, erro: "sem RESEND_API_KEY ou email" };
    try {
        const dir = path.join(process.cwd(), "privado", "guias-ea2");
        const attachments = await Promise.all(
            GUIAS.map(async (g) => ({ filename: g.arquivo, content: abrir(await readFile(path.join(dir, `${g.arquivo}.enc`))).toString("base64") })),
        );
        const mail = emailGuiasEa2(nome);
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify({ from: remetente, to: [email], subject: mail.subject, html: mail.html, attachments }),
        });
        if (!res.ok) return { ok: false, erro: `${res.status} ${await res.text()}` };
        return { ok: true };
    } catch (e) {
        return { ok: false, erro: String(e) };
    }
}
