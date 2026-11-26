"use client";
import { useEffect, useRef, useState } from "react";
import s from "./jornada.module.css";

// Assinatura visual da oferta: o painel do dono ganhando uma área por mês.
// Acende uma linha a cada 1,4 s quando entra na tela, segura o painel cheio e recomeça.
// Com movimento reduzido, mostra o painel cheio parado.
export default function PainelMeses({ areas }: { areas: { mes: number; curto: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [aceso, setAceso] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAceso(areas.length);
      return;
    }
    let t: ReturnType<typeof setInterval> | undefined;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !t) {
        let i = 0;
        t = setInterval(() => {
          i = i >= areas.length + 3 ? 0 : i + 1;
          setAceso(Math.min(i, areas.length));
        }, 1400);
      } else if (!e.isIntersecting && t) {
        clearInterval(t);
        t = undefined;
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); if (t) clearInterval(t); };
  }, [areas.length]);
  return (
    <div ref={ref} className={s.painel} aria-label="Painel da sua empresa: uma área nova com agentes a cada mês">
      <div className={s.painelTopo}>
        <span>Painel do dono</span>
        <span className={s.painelMes}>{aceso === 0 ? "Hoje" : `Mês ${aceso}`}</span>
      </div>
      <ul className={s.painelLinhas}>
        {areas.map((a, i) => {
          const on = i < aceso;
          return (
            <li key={a.mes} className={on ? s.on : undefined}>
              <span className={s.painelArea}>{a.curto}</span>
              <span className={s.painelBarra}><i /></span>
              <span className={s.painelStatus}>{on ? "com agentes" : `mês ${a.mes}`}</span>
            </li>
          );
        })}
      </ul>
      <div className={s.painelRodape}>
        <span>{aceso} de {areas.length} áreas rodando</span>
      </div>
    </div>
  );
}
