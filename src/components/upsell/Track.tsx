"use client";
import { useEffect } from "react";
import Link from "next/link";

declare global {
  interface Window {
    fbq?: (...a: unknown[]) => void;
  }
}

type Nome = "formacao" | "implementacao";

// ViewContent no carregamento da oferta. PageView já sai do layout; Purchase vem do webhook da Hotmart.
export function ViewOferta({ nome }: { nome: Nome }) {
  useEffect(() => {
    window.fbq?.("track", "ViewContent", { content_name: "ea2_oferta_" + nome, content_category: "upsell" });
  }, [nome]);
  return null;
}

export function trackRecusa(nome: Nome) {
  window.fbq?.("trackCustom", "UpsellRecusado", { oferta: "ea2_" + nome });
}

export function Recusar({ nome, href, className, children }: { nome: Nome; href: string; className?: string; children: React.ReactNode }) {
  return (
    <Link className={className} href={href} onClick={() => trackRecusa(nome)}>
      {children}
    </Link>
  );
}

// Parâmetros do redirect da Hotmart (nome ainda não confirmado pela ION):
// aceita "transaction" ou "transaction_id", e "email" se vier. Só leitura, só no cliente:
// nunca gravado, nunca enviado ao pixel e nunca repassado em URL de saída.
export type ParamsHotmart = { transacao: string | null; email: string | null };

export function lerParamsHotmart(search?: string): ParamsHotmart {
  try {
    const q = new URLSearchParams(search ?? (typeof window !== "undefined" ? window.location.search : ""));
    const limpa = (v: string | null) => {
      const t = (v ?? "").trim().slice(0, 200);
      return t ? t : null;
    };
    const transacao = limpa(q.get("transaction")) ?? limpa(q.get("transaction_id"));
    const e = limpa(q.get("email"));
    const email = e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) ? e : null;
    return { transacao, email };
  } catch {
    return { transacao: null, email: null };
  }
}
