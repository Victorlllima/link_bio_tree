import { createHmac, timingSafeEqual } from "node:crypto";

/* /demo/cotacoes · login de TESTE da noite 1 (Rigel/Red, 23/11/2026).
   Usuário e senha só desta demo, nas variáveis DEMO_COTACOES_EMAIL e DEMO_COTACOES_SENHA.
   O cookie guarda um HMAC dos dois e vale só até fechar o navegador (sem "lembrar de mim").
   Trocar a senha na Vercel derruba todas as sessões. Sem variável = ninguém entra. */

export const COOKIE = "demo_cot";
export const CAMINHO = "/demo/cotacoes";

const email = () => (process.env.DEMO_COTACOES_EMAIL ?? "").trim().toLowerCase();
const senha = () => (process.env.DEMO_COTACOES_SENHA ?? "").trim();

export function loginConfigurado(): boolean {
  return email().length > 0 && senha().length > 0;
}

export function tokenSessao(): string {
  return createHmac("sha256", senha()).update(`demo-cotacoes:v1:${email()}`).digest("hex");
}

function iguais(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function loginConfere(e: string, s: string): boolean {
  if (!loginConfigurado()) return false;
  const okEmail = iguais(e.trim().toLowerCase(), email());
  const okSenha = iguais(s, senha()); // senha exata: quem digita é o agente, pelo cofre
  return okEmail && okSenha;
}

export function sessaoValida(valor: string | undefined): boolean {
  if (!valor || !loginConfigurado()) return false;
  return iguais(valor, tokenSessao());
}
