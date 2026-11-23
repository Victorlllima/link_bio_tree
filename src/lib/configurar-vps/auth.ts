import { createHmac, timingSafeEqual } from "node:crypto";

/* /configurar-vps · senha da aula (Rigel, 23/11/2026).
   A senha mora só na variável de ambiente; o cookie guarda um HMAC dela.
   Trocar a senha na Vercel derruba todos os cookies antigos. Sem variável = ninguém entra. */

export const COOKIE = "cvps";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 60; // 60 dias

function senha(): string {
  return (process.env.CONFIGURAR_VPS_SENHA ?? "").trim();
}

export function senhaConfigurada(): boolean {
  return senha().length > 0;
}

export function tokenDaSenha(): string {
  return createHmac("sha256", senha()).update("configurar-vps:v1").digest("hex");
}

function iguais(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function senhaConfere(tentativa: string): boolean {
  if (!senhaConfigurada()) return false;
  // normaliza espaços e caixa: a senha é ditada em aula
  const norm = (s: string) => s.trim().toLowerCase();
  return iguais(norm(tentativa), norm(senha()));
}

export function cookieValido(valor: string | undefined): boolean {
  if (!valor || !senhaConfigurada()) return false;
  return iguais(valor, tokenDaSenha());
}

// Chave do comando de instalação (vai na URL do curl). Deriva da senha: trocar a senha troca a chave.
export function chaveInstalar(): string {
  return createHmac("sha256", senha()).update("instalar:v1").digest("hex").slice(0, 24);
}

export function chaveInstalarConfere(k: string | null): boolean {
  if (!k || !senhaConfigurada()) return false;
  return iguais(k, chaveInstalar());
}
