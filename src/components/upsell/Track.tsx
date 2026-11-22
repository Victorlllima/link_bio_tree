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
