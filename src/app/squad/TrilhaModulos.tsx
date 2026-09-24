"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BeamCard } from "@/components/ui/beam-card";
import { MODULOS } from "./modulos";

/**
 * Os sete módulos lado a lado, no formato de pôster da área de membros.
 *
 * Revisão de 24/09 (Red: "ficaram horríveis, nada premium"). O que mudou e por quê:
 *  - a arte deixou de ser uma tarja de 132px e passou a ocupar a proporção 4:5,
 *    que é o que faz o card ler como capa e não como banner;
 *  - as bordas coloridas saíram: azul e ciano sobre arte dourada derrubavam a página;
 *  - o número do módulo virou elemento gráfico grande sobre a arte, em vez de legenda;
 *  - o nome vai em serifa itálica, a mesma das capas, criando hierarquia de verdade
 *    contra o subtítulo em mono minúsculo;
 *  - fio dourado na borda de baixo, que é a assinatura visual da referência.
 */
export function TrilhaModulos() {
    const [aberto, setAberto] = useState<number | null>(null);
    const modulo = MODULOS.find((m) => m.n === aberto) ?? null;

    return (
        <div>
            <ol className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
                {MODULOS.map((m) => {
                    const ativo = aberto === m.n;
                    return (
                        <li key={m.n} className="h-full">
                            <BeamCard ativo={ativo} variant={ativo ? "brasa" : "ouro"} className="h-full">
                                <button
                                    type="button"
                                    onClick={() => setAberto(ativo ? null : m.n)}
                                    aria-expanded={ativo}
                                    aria-label={`Módulo ${m.n}: ${m.titulo}`}
                                    className="group/card relative flex h-full w-full flex-col overflow-hidden rounded-2xl text-left"
                                >
                                    {/* arte em proporção de pôster */}
                                    <span className="relative block aspect-[4/5] w-full overflow-hidden">
                                        <span
                                            aria-hidden
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-[900ms] ease-out group-hover/card:scale-[1.07]"
                                            style={{ backgroundImage: `url(/squad/modulo-${m.n}.jpg)` }}
                                        />
                                        <span
                                            aria-hidden
                                            className="absolute inset-0"
                                            style={{
                                                background:
                                                    "linear-gradient(to bottom, rgba(8,8,10,.15) 0%, rgba(8,8,10,.05) 38%, rgba(8,8,10,.82) 78%, #08080A 100%)",
                                            }}
                                        />
                                        {/* o número como elemento gráfico, não como legenda */}
                                        <span
                                            aria-hidden
                                            className="squad-serif absolute left-3 top-1 select-none text-[62px] leading-none"
                                            style={{
                                                WebkitTextStroke: "1px rgba(214,168,90,.55)",
                                                color: "transparent",
                                            }}
                                        >
                                            {m.n}
                                        </span>
                                    </span>

                                    <span className="flex flex-1 flex-col px-4 pb-4 pt-1">
                                        <span className="squad-mono mb-2 text-[9.5px] uppercase tracking-[0.26em] text-[#D6A85A]">
                                            Módulo {m.n}
                                        </span>

                                        <span className="squad-serif block text-[22px] italic leading-[1.12] text-[#F3D698]">
                                            {m.titulo}
                                        </span>

                                        <span className="mt-2 block text-[12.5px] leading-snug text-white/40">
                                            {m.subtitulo}
                                        </span>

                                        <span className="squad-mono mt-auto flex w-full items-center justify-between whitespace-nowrap pt-5 text-[9.5px] tracking-wider text-white/25">
                                            <span>{m.aulas.length} aulas</span>
                                            <span
                                                aria-hidden
                                                className="text-[#D6A85A]/70 transition-all duration-300 group-hover/card:text-[#F3D698]"
                                                style={{ transform: ativo ? "rotate(45deg)" : "none" }}
                                            >
                                                <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                                                    <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                            </span>
                                        </span>
                                    </span>

                                    {/* fio dourado na borda de baixo — a assinatura da referência */}
                                    <span
                                        aria-hidden
                                        className="absolute inset-x-0 bottom-0 h-[3px] transition-opacity duration-500"
                                        style={{
                                            opacity: ativo ? 1 : 0.55,
                                            background:
                                                "linear-gradient(to right, transparent, #B8863C 18%, #F3D698 50%, #B8863C 82%, transparent)",
                                        }}
                                    />
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
                        <div
                            className="mt-4 rounded-2xl border border-[#D6A85A]/15 p-7 sm:p-9"
                            style={{
                                background:
                                    "radial-gradient(ellipse 80% 140% at 8% 0%, rgba(214,168,90,.07), transparent 60%), #0B0B0C",
                            }}
                        >
                            <div className="mb-7 flex flex-wrap items-end gap-x-5 gap-y-2 border-b border-[#D6A85A]/12 pb-6">
                                <span className="squad-mono text-[10px] uppercase tracking-[0.3em] text-[#D6A85A]">
                                    Módulo {modulo.n} · semana {modulo.n}
                                </span>
                                <h3 className="squad-serif text-[34px] italic leading-none text-[#F3D698]">
                                    {modulo.titulo}
                                </h3>
                                <span className="squad-mono ml-auto text-[10px] tracking-wider text-white/30">
                                    {modulo.aulas.length} aulas · {modulo.duracao}
                                </span>
                            </div>

                            <p className="mb-8 max-w-3xl text-[15.5px] leading-relaxed text-white/55">
                                {modulo.resumo}
                            </p>

                            <ul className="grid gap-x-12 sm:grid-cols-2">
                                {modulo.aulas.map((a, i) => (
                                    <li
                                        key={a}
                                        className="flex items-baseline gap-4 border-b border-white/[0.05] py-3.5 last:border-0 sm:last:border-b"
                                    >
                                        <span className="squad-mono w-9 shrink-0 text-[10.5px] text-[#D6A85A]/55">
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
