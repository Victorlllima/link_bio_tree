"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BeamCard } from "@/components/ui/beam-card";
import { MODULOS } from "./modulos";

/**
 * Os sete módulos lado a lado, todos do mesmo tamanho (Red, 24/09/2026).
 * Nada abre sozinho: o painel de aulas só aparece depois do clique, e ocupa a largura
 * inteira abaixo da fileira, para o conteúdo respirar sem quebrar o alinhamento dos cards.
 */
export function TrilhaModulos() {
    const [aberto, setAberto] = useState<number | null>(null);
    const modulo = MODULOS.find((m) => m.n === aberto) ?? null;

    return (
        <div>
            <ol className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                {MODULOS.map((m) => {
                    const ativo = aberto === m.n;
                    return (
                        <li key={m.n} className="h-full">
                            <BeamCard
                                ativo={ativo}
                                variant={ativo ? "colorful" : "ocean"}
                                className="h-full"
                            >
                                <button
                                    type="button"
                                    onClick={() => setAberto(ativo ? null : m.n)}
                                    aria-expanded={ativo}
                                    className="group/card relative flex h-full w-full flex-col items-start overflow-hidden rounded-2xl text-left"
                                >
                                    {/* a arte do módulo, a mesma das capas da área de membros */}
                                    <span
                                        aria-hidden
                                        className="block h-[132px] w-full bg-cover bg-center transition-transform duration-700 group-hover/card:scale-[1.06]"
                                        style={{ backgroundImage: `url(/squad/modulo-${m.n}.jpg)` }}
                                    />
                                    <span
                                        aria-hidden
                                        className="pointer-events-none absolute inset-x-0 top-0 h-[150px]"
                                        style={{
                                            background:
                                                "linear-gradient(to bottom, rgba(11,11,12,0) 30%, rgba(11,11,12,.75) 72%, #0B0B0C 100%)",
                                        }}
                                    />

                                    <span className="flex w-full flex-1 flex-col items-start p-4">
                                    <span className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-orange-400">
                                        Módulo {m.n}
                                    </span>

                                    <span className="mb-2 block text-[15px] font-semibold leading-snug tracking-tight text-white">
                                        {m.titulo}
                                    </span>

                                    <span className="block text-[12.5px] leading-snug text-white/45">
                                        {m.subtitulo}
                                    </span>

                                    <span className="mt-auto flex w-full items-center justify-between pt-4 font-mono text-[10px] text-white/30">
                                        <span>{m.aulas.length} aulas · {m.duracao}</span>
                                        <span
                                            aria-hidden
                                            className="transition-transform duration-300"
                                            style={{ transform: ativo ? "rotate(45deg)" : "none" }}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                                                <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                            </svg>
                                        </span>
                                    </span>
                                    </span>
                                </button>
                            </BeamCard>
                        </li>
                    );
                })}
            </ol>

            <AnimatePresence initial={false} mode="wait">
                {modulo && (
                    <motion.div
                        key={modulo.n}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="mt-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8">
                            <div className="mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-2 border-b border-white/[0.07] pb-5">
                                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-orange-400">
                                    Módulo {modulo.n} · semana {modulo.n}
                                </span>
                                <h3 className="text-2xl font-semibold tracking-tight text-white">
                                    {modulo.titulo}
                                </h3>
                                <span className="font-mono text-[11px] text-white/35">
                                    {modulo.aulas.length} aulas · {modulo.duracao}
                                </span>
                            </div>

                            <p className="mb-7 max-w-3xl text-[15px] leading-relaxed text-white/60">
                                {modulo.resumo}
                            </p>

                            <ul className="grid gap-x-10 gap-y-0 sm:grid-cols-2">
                                {modulo.aulas.map((a, i) => (
                                    <li
                                        key={a}
                                        className="flex items-center gap-4 border-b border-white/[0.05] py-3 last:border-0 sm:last:border-b"
                                    >
                                        <span className="w-9 shrink-0 font-mono text-[11px] text-white/30">
                                            {modulo.n}.{i + 1}
                                        </span>
                                        <span className="text-[14.5px] leading-snug text-white/75">{a}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
