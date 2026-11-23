"use client";

import Script from "next/script";
import { useEffect, useRef, useState, type ReactNode } from "react";

// Widget de 1 clique da Hotmart (funis 294829 e 294831, MIRA 22/11).
// O widget lê a query string que a Hotmart manda no redirect. Sem ela (visita direta) fica em branco,
// então só monta com query string; sem ela, ou se não montar em 6 s, aparecem os botões normais (children).
declare global {
  interface Window {
    checkoutElements?: { init: (t: string) => { mount: (sel: string) => void } };
  }
}

export default function FunilHotmart({ children }: { children: ReactNode }) {
  const alvo = useRef<HTMLDivElement>(null);
  const [reserva, setReserva] = useState(false);
  const [usar, setUsar] = useState(false);

  useEffect(() => {
    if (window.location.search.length <= 1) {
      setReserva(true);
      return;
    }
    setUsar(true);
    const t = setTimeout(() => {
      if (!alvo.current || alvo.current.childElementCount === 0) setReserva(true);
    }, 6000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <div id="hotmart-sales-funnel" ref={alvo} />
      {usar && <Script
        src="https://checkout.hotmart.com/lib/hotmart-checkout-elements.js"
        strategy="afterInteractive"
        onLoad={() => {
          try {
            window.checkoutElements?.init("salesFunnel").mount("#hotmart-sales-funnel");
          } catch {
            setReserva(true);
          }
        }}
        onError={() => setReserva(true)}
      />}
      {reserva && children}
    </>
  );
}
