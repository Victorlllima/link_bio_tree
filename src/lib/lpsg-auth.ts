import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Senha mestre do painel (/lpsg e /dashboard). Vem SOMENTE da variável de ambiente LPSG_PASSWORD:
 * não existe senha padrão no código (Red, 13/10/2026). Sem a variável, ninguém entra.
 *
 * O cookie de sessão NÃO guarda a senha: guarda um hash dela (sha256 com sal). Assim a senha não
 * viaja em cookie, e caracteres como "@" não quebram a comparação.
 */
const SENHA = process.env.LPSG_PASSWORD || "";

export const lpsgToken = (): string =>
  SENHA ? createHash("sha256").update(`lpsg-sessao:${SENHA}`).digest("hex") : "";

/** A senha digitada confere com a mestre? (comparação em tempo constante) */
export function senhaConfere(digitada: unknown): boolean {
  if (!SENHA || typeof digitada !== "string") return false;
  const a = createHash("sha256").update(digitada).digest();
  const b = createHash("sha256").update(SENHA).digest();
  return timingSafeEqual(a, b);
}

/** A requisição traz o cookie de sessão válido? */
export function lpsgAutorizado(req: Request): boolean {
  const token = lpsgToken();
  if (!token) return false;
  const cookie = req.headers.get("cookie") || "";
  return cookie.split(/;\s*/).some((c) => c === `lpsg_auth=${token}`);
}
