"use client";

/* ============================================================================
 *  MOVIMENTO  ·  duas primitivas, zero biblioteca
 * ----------------------------------------------------------------------------
 *  As técnicas vieram dos plugins do arsenal (gsap-scrolltrigger,
 *  scroll-reveal-libraries, locomotive-scroll, lottie-animations). O que NÃO
 *  veio foi o runtime deles, e a razão é o tráfego: estas páginas recebem
 *  anúncio pago em celular, e AOS (13 KB) + GSAP/ScrollTrigger (27 KB+) +
 *  Locomotive + player de Lottie custariam mais de 100 KB de JS para entregar
 *  um reveal, um stagger e um parallax que cabem em 60 linhas de
 *  IntersectionObserver e transform. Os próprios plugins dizem isso: o AOS "é
 *  IO + classe + transition", e o motor do Locomotive "é lerp + translate3d".
 *
 *  Os números vieram deles e estão respeitados:
 *    reveal 600-800ms · stagger 100ms · ease cubic-bezier(.4,0,.2,1)
 *    gatilho equivalente a "top 80%"  → rootMargin 0 0 -18% 0
 *    once: true (desconecta ao disparar)
 *    parallax desligado abaixo de 768px e sob prefers-reduced-motion
 *
 *  🔑 REGRA QUE VALE PARA AS DUAS: o estado inicial escondido só é aplicado
 *  DEPOIS que o componente monta. Sem JS, sem observer ou com movimento
 *  reduzido, a página fica completa e visível. É por isso que o preview
 *  estático mostra tudo: lá não roda script nenhum.
 * ==========================================================================*/

import { useEffect, useRef, type ReactNode } from "react";

function paradoPorPreferencia(): boolean {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/* ---------------------------------------------------------------------------
 *  REVELA  ·  o "AOS" da casa
 *  Marca o próprio elemento com data-rv="arm" ao montar e data-rv="on" quando
 *  entra na tela. Cada página decide no CSS o que arm/on significam: em A é o
 *  log imprimindo linha a linha, em B é a grade acendendo célula a célula, em
 *  D é o degrau entrando pela esquerda. A primitiva é a mesma, a leitura não.
 * ------------------------------------------------------------------------*/

export function Revela({
  children,
  className,
  limiar = 0.2,
  como = "bloco",
}: {
  children: ReactNode;
  className?: string;
  limiar?: number;
  /** vira data-rv-modo, para o CSS diferenciar dois usos na mesma página */
  como?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Classe aplicada direto no DOM em vez de virar estado do React: isto é
  // sincronizar com a pintura do navegador, não estado de aplicação. Com
  // setState o React re-renderiza a árvore inteira duas vezes de graça.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (paradoPorPreferencia() || typeof IntersectionObserver === "undefined") return;

    el.setAttribute("data-rv", "arm");

    const obs = new IntersectionObserver(
      (entradas) => {
        if (!entradas[0]?.isIntersecting) return;
        obs.disconnect(); // once: true
        el.setAttribute("data-rv", "on");
      },
      { threshold: limiar, rootMargin: "0px 0px -18% 0px" },
    );

    obs.observe(el);
    return () => {
      obs.disconnect();
      el.removeAttribute("data-rv");
    };
  }, [limiar]);

  return (
    <div ref={ref} className={className} data-rv-modo={como}>
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 *  PARALAXE  ·  o motor do Locomotive sem o Locomotive
 *  Um rAF só, agendado apenas enquanto o elemento está visível, escrevendo
 *  translate3d. `velocidade` segue a escala do data-scroll-speed: abaixo de 1
 *  a camada anda mais devagar que a página. 0.5 é o valor de fundo do próprio
 *  plugin. Nada de scroll hijacking: a rolagem continua sendo a do navegador.
 * ------------------------------------------------------------------------*/

export function Paralaxe({
  children,
  className,
  velocidade = 0.5,
}: {
  children: ReactNode;
  className?: string;
  velocidade?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // O plugin manda desligar smooth/parallax no smartphone (breakpoint 768) e
    // sob movimento reduzido. Aqui o desligado é o estado natural: sem
    // transform, o elemento fica exatamente onde o layout o colocou.
    if (paradoPorPreferencia()) return;
    if (window.matchMedia("(max-width: 767px)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    let visivel = false;
    let pedido = 0;
    let atual = 0;

    const pintar = () => {
      pedido = 0;
      const r = el.getBoundingClientRect();
      const centro = r.top + r.height / 2 - window.innerHeight / 2;
      const alvo = -centro * (1 - velocidade) * 0.32;
      // lerp 0.1, o default do Locomotive: suaviza sem descolar do dedo
      atual += (alvo - atual) * 0.1;
      el.style.transform = `translate3d(0, ${atual.toFixed(2)}px, 0)`;
      if (visivel && Math.abs(alvo - atual) > 0.2) pedido = requestAnimationFrame(pintar);
    };

    const agendar = () => {
      if (!pedido && visivel) pedido = requestAnimationFrame(pintar);
    };

    const obs = new IntersectionObserver((e) => {
      visivel = Boolean(e[0]?.isIntersecting);
      if (visivel) agendar();
    });

    obs.observe(el);
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);

    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
      if (pedido) cancelAnimationFrame(pedido);
      el.style.transform = "";
    };
  }, [velocidade]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
