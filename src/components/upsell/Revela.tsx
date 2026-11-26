"use client";
import { useEffect, useRef, type ReactNode } from "react";
import s from "./jornada.module.css";

// Revela os meses da jornada conforme a pessoa rola. Sem JS ou com movimento reduzido, tudo fica visível.
export default function Revela({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const itens = Array.from(root.querySelectorAll<HTMLElement>("[data-revela]"));
    itens.forEach((el) => { if (el.getBoundingClientRect().top > window.innerHeight) el.classList.add(s.escondido); });
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { e.target.classList.remove(s.escondido); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -12% 0px" });
    itens.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return <div ref={ref}>{children}</div>;
}
