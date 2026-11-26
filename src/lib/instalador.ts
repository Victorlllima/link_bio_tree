import crypto from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

/* ------------------------------------------------------------------
 * INSTALADOR DA IMERSÃO, ROTA PROTEGIDA (Red, 23/11/2026, via Rigel; ION + IRIS)
 * O repositório do instalador é privado e o comando só aparece em /configurar-vps, depois da senha:
 *   curl -fsSL "https://redpro.com.br/instalar?k=CHAVE" -o configurar-vps.sh && bash configurar-vps.sh
 * CHAVE = HMAC da senha da aula: trocar a senha na Vercel troca a chave.
 * Este repositório é PÚBLICO: o configurar-vps.sh e o pacote ficam em privado/instalador CIFRADOS
 * (AES-256-GCM: iv 12 + tag 16 + dados, igual aos guias do EA²) com INSTALADOR_CIFRA_KEY
 * (env da Vercel; hex de 32 bytes). Para atualizar: scripts/cifrar-instalador.sh. Nunca commitar aberto.
 * ---------------------------------------------------------------- */

export const ARQUIVOS_INSTALADOR = ["configurar-vps.sh", "configurar-vps.tar.gz"] as const;
export type ArquivoInstalador = (typeof ARQUIVOS_INSTALADOR)[number];
export const MARCADOR_CHAVE = "__IMERSAO_CHAVE__";

function senhaDaAula(): string {
    return process.env.CONFIGURAR_VPS_SENHA ?? "";
}

/** Chave que vai no comando do aluno. Chame só no servidor, depois de conferir a senha. */
export function chaveInstalador(): string {
    const senha = senhaDaAula();
    if (!senha) throw new Error("CONFIGURAR_VPS_SENHA ausente");
    // Igual a chaveInstalar() de src/lib/configurar-vps/auth.ts (IRIS): mesmo HMAC e mesmo rótulo.
    return crypto.createHmac("sha256", senha).update("instalar:v1").digest("hex").slice(0, 24);
}

export function chaveValida(k: string | null): boolean {
    if (!k || !senhaDaAula()) return false;
    const a = Buffer.from(k);
    const b = Buffer.from(chaveInstalador());
    return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function ehArquivoInstalador(nome: string): nome is ArquivoInstalador {
    return (ARQUIVOS_INSTALADOR as readonly string[]).includes(nome);
}

export async function abrirArquivoInstalador(nome: ArquivoInstalador): Promise<Buffer> {
    const hex = process.env.INSTALADOR_CIFRA_KEY ?? "";
    if (hex.length !== 64) throw new Error("INSTALADOR_CIFRA_KEY ausente ou inválida");
    const buf = await readFile(path.join(process.cwd(), "privado", "instalador", `${nome}.enc`));
    const d = crypto.createDecipheriv("aes-256-gcm", Buffer.from(hex, "hex"), buf.subarray(0, 12));
    d.setAuthTag(buf.subarray(12, 28));
    return Buffer.concat([d.update(buf.subarray(28)), d.final()]);
}

export const CABECALHOS_INSTALADOR = {
    "Cache-Control": "no-store, max-age=0",
    "X-Robots-Tag": "noindex, nofollow",
    "Referrer-Policy": "no-referrer",
};
