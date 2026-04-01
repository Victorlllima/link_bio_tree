"use client";

import { motion } from "framer-motion";
import { Footer } from "@/components/footer";
import { InCompanyForm } from "@/components/in-company/contact-form";

const MODULES = [
    {
        num: "01",
        title: "Diagnóstico de Maturidade IA",
        desc: "Mapeamos onde o time está hoje e onde a IA pode gerar impacto imediato — sem buzzword, sem teoria."
    },
    {
        num: "02",
        title: "Método S.H.A.R.K. Aplicado",
        desc: "O mesmo framework que Red usa nos próprios negócios, adaptado para o contexto e setor da sua empresa."
    },
    {
        num: "03",
        title: "Hands-on com ferramentas reais",
        desc: "Nada de slide. O time sai do treinamento com automações rodando no próprio ambiente de trabalho."
    },
    {
        num: "04",
        title: "Plano de expansão 90 dias",
        desc: "Entregamos um roadmap de implementação para que o time continue evoluindo sem depender de Red."
    }
];

const RESULTS = [
    { metric: "10×", label: "mais velocidade em tarefas repetitivas" },
    { metric: "−40%", label: "custo com processos manuais" },
    { metric: "48h", label: "para o primeiro processo automatizado" },
    { metric: "100%", label: "aplicado ao contexto real da empresa" }
];

const FORMATS = [
    {
        name: "Workshop",
        duration: "1 dia",
        size: "Até 20 pessoas",
        desc: "Imersão introdutória. O time sai com clareza sobre onde aplicar IA e um processo piloto no ar.",
        highlight: false
    },
    {
        name: "Programa",
        duration: "4 semanas",
        size: "Até 15 pessoas",
        desc: "Treinamento completo com implementação assistida. Cada semana foca em um pilar do Método S.H.A.R.K.",
        highlight: true
    },
    {
        name: "Consultoria",
        duration: "3 meses",
        size: "Time de liderança",
        desc: "Transformação profunda. Red trabalha junto ao time de gestão para redesenhar processos com IA.",
        highlight: false
    }
];

const FOR_WHO = [
    "Empresas que terceirizam tudo para devs e querem independência",
    "Times que já usam IA no básico e querem criar sistemas reais",
    "Líderes que precisam preparar a equipe para o mercado de 2025",
    "Organizações que querem reduzir custo operacional sem demitir"
];

export default function InCompanyPage() {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200;12..96,400;12..96,800;12..96,900&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;700&display=swap');
                body { font-family: 'DM Sans', sans-serif; }
            `}</style>

            <main className="min-h-screen bg-[#09090b] text-white relative overflow-x-hidden">

                {/* Background */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div style={{ background: "radial-gradient(ellipse 70% 40% at 50% -5%, rgba(249,115,22,0.10) 0%, transparent 60%)" }} className="absolute inset-0" />
                    <div style={{ background: "radial-gradient(ellipse 40% 30% at 90% 90%, rgba(59,130,246,0.05) 0%, transparent 50%)" }} className="absolute inset-0" />
                </div>

                {/* NAV */}
                <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
                    <a href="/" className="flex items-center gap-2 text-[#71717a] hover:text-white transition-colors text-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Voltar
                    </a>
                    <span className="font-mono text-xs tracking-widest text-[#71717a] uppercase">RedPro AI Academy</span>
                </nav>

                {/* HERO + FORM */}
                <section className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                        {/* Left */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <p className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-6">RedPro In Company</p>
                            <h1
                                style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 900, lineHeight: 0.95, letterSpacing: "-0.03em", fontSize: "clamp(40px, 6vw, 72px)" }}
                                className="text-white mb-6"
                            >
                                Instale uma mentalidade de IA no DNA da sua empresa.
                            </h1>
                            <p className="text-[#a1a1aa] text-base leading-relaxed mb-8" style={{ fontWeight: 300 }}>
                                Não é palestra. Não é curso gravado. É Red dentro da sua empresa, com o time, implementando IA no contexto real do negócio — e saindo com processos funcionando.
                            </p>

                            {/* Para quem */}
                            <div className="space-y-3 mb-10">
                                {FOR_WHO.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -12 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: 0.2 + i * 0.07 }}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="w-4 h-4 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center shrink-0 mt-0.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                        </div>
                                        <p className="text-[#a1a1aa] text-sm">{item}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Metrics */}
                            <div className="grid grid-cols-2 gap-3">
                                {RESULTS.map((r, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.4 + i * 0.07 }}
                                        className="p-4 rounded-xl border border-[#1f1f23] bg-[#111113]"
                                    >
                                        <p className="text-2xl font-bold text-orange-500 mb-1" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 900 }}>{r.metric}</p>
                                        <p className="text-[#71717a] text-xs leading-tight">{r.label}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right — Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.15 }}
                            className="sticky top-8"
                        >
                            <div className="p-8 rounded-2xl border border-[#1f1f23] bg-[#111113]" style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.05) 0%, #111113 100%)" }}>
                                <p className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-2">Proposta personalizada</p>
                                <h2 className="text-xl font-bold text-white mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800 }}>
                                    Fale com a equipe RedPro
                                </h2>
                                <InCompanyForm />
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* O QUE ACONTECE */}
                <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 border-t border-white/5">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                        <p className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-4">O que acontece</p>
                        <h2
                            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, letterSpacing: "-0.02em", fontSize: "clamp(24px, 3.5vw, 40px)" }}
                            className="text-white mb-12"
                        >
                            Cada módulo do treinamento.
                        </h2>
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {MODULES.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.08 }}
                                className="p-6 rounded-2xl border border-[#1f1f23] bg-[#111113] flex gap-5"
                            >
                                <span className="font-mono text-orange-500 text-xs font-bold mt-0.5 shrink-0">{m.num}</span>
                                <div>
                                    <h3 className="text-white font-semibold text-sm mb-1.5">{m.title}</h3>
                                    <p className="text-[#71717a] text-sm leading-relaxed">{m.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* FORMATOS */}
                <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 border-t border-white/5">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                        <p className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-4">Formatos</p>
                        <h2
                            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, letterSpacing: "-0.02em", fontSize: "clamp(24px, 3.5vw, 40px)" }}
                            className="text-white mb-12"
                        >
                            Escolha o formato ideal.
                        </h2>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {FORMATS.map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                className={`p-6 rounded-2xl border flex flex-col ${f.highlight
                                    ? "border-orange-500/40 bg-gradient-to-b from-orange-500/8 to-[#111113]"
                                    : "border-[#1f1f23] bg-[#111113]"
                                    }`}
                            >
                                {f.highlight && <p className="font-mono text-xs text-orange-500 uppercase tracking-widest mb-3">Mais solicitado</p>}
                                <h3 className="text-white font-bold text-xl mb-1" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800 }}>{f.name}</h3>
                                <div className="flex gap-3 mb-4">
                                    <span className="font-mono text-xs text-[#71717a] bg-white/5 px-2 py-1 rounded">{f.duration}</span>
                                    <span className="font-mono text-xs text-[#71717a] bg-white/5 px-2 py-1 rounded">{f.size}</span>
                                </div>
                                <p className="text-[#a1a1aa] text-sm leading-relaxed flex-1">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                        className="mt-8 text-center"
                    >
                        <p className="text-[#71717a] text-sm">Todos os formatos são presenciais ou remotos · Proposta personalizada por tamanho e setor</p>
                    </motion.div>
                </section>

                <Footer />
            </main>
        </>
    );
}
