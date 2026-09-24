"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BeamCard } from "@/components/ui/beam-card";
import { MODULOS } from "./modulos";

/**
 * A trilha dos sete módulos. Cada card é uma semana: clica, abre, mostra as aulas.
 * Vertical de propósito — a leitura é de cima para baixo, como uma jornada,
 * e não uma grade de produtos.
 */
export function TrilhaModulos() {
    const [aberto, setAberto] = useState<number | null>(1);

    return (
        <ol className="mx-auto flex w-full max-w-3xl flex-col gap-5">
            {MODULOS.map((m) => {
                const ativo = aberto === m.n;
                return (
                    <li key={m.n}>
                        <BeamCard ativo={ativo} variant={ativo ? "colorful" : "ocean"}>
                            <button
                                type="button"
                                onClick={() => setAberto(ativo ? null : m.n)}
                                aria-expanded={ativo}
                                className="flex w-full items-start gap-5 p-6 text-left sm:p-7"
                            >
                                <span className="shrink-0 select-none">
                                    <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] font-mono text-lg font-bold text-white/90">
                                        {m.n}
                                    </span>
                                    <span className="mt-2 block text-center font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                                        sem {m.n}
                                    </span>
                                </span>

                                <span className="min-w-0 flex-1">
                                    <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-orange-400/90">
                                        {m.teto}
                                    </span>
                                    <span className="block text-xl font-semibold leading-tight tracking-tight text-white sm:text-2xl">
                                        {m.titulo}
                                    </span>
                                    <span className="mt-2 block text-[15px] leading-relaxed text-white/55">
                                        {m.resumo}
                                    </span>
                                    <span className="mt-3 flex items-center gap-3 font-mono text-[11px] text-white/35">
                                        <span>{m.aulas.length} aulas</span>
                                        <span aria-hidden>·</span>
                                        <span>{m.duracao}</span>
                                    </span>
                                </span>

                                <span
                                    aria-hidden
                                    className="mt-1 shrink-0 text-white/30 transition-transform duration-300"
                                    style={{ transform: ativo ? "rotate(45deg)" : "none" }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </span>
                            </button>

                            <AnimatePresence initial={false}>
                                {ativo && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                                        className="overflow-hidden"
                                    >
                                        <ul className="border-t border-white/[0.07] px-6 pb-7 pt-5 sm:px-7">
                                            {m.aulas.map((a, i) => (
                                                <li
                                                    key={a}
                                                    className="flex items-center gap-4 border-b border-white/[0.04] py-3 last:border-0"
                                                >
                                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 font-mono text-[11px] text-white/40">
                                                        {m.n}.{i + 1}
                                                    </span>
                                                    <span className="text-[15px] text-white/75">{a}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </BeamCard>
                    </li>
                );
            })}
        </ol>
    );
}
