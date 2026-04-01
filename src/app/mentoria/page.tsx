"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "@/components/footer";
import { QualificationFlow } from "@/components/mentoria/qualification-flow";

const BENEFITS = [
    {
        icon: "01",
        title: "Diagnóstico real do seu negócio",
        desc: "Mapeamos onde a IA pode gerar mais impacto imediato — sem teoria, sem hype."
    },
    {
        icon: "02",
        title: "Implementação assistida",
        desc: "Você não aprende sobre IA. Você constrói com IA, ao vivo, com Red do seu lado."
    },
    {
        icon: "03",
        title: "Primeiro agente no ar em 30 dias",
        desc: "Saída concreta: um processo automatizado rodando no seu negócio."
    },
    {
        icon: "04",
        title: "Framework de decisão",
        desc: "Você sai sabendo como identificar, priorizar e implementar IA continuamente."
    }
];

const PROFILES = [
    {
        tag: "Para você se...",
        headline: "Paga caro para terceiros fazerem o que a IA poderia fazer",
        sub: "Dev, agência, freelancer. O custo cresce, a dependência também. Existe uma saída."
    },
    {
        tag: "Para você se...",
        headline: "Quer IA no negócio mas não sabe por onde começar",
        sub: "Você vê os concorrentes evoluindo. Tentou algumas ferramentas mas nada virou sistema."
    },
    {
        tag: "Para você se...",
        headline: "Já usa IA mas quer escalar para o negócio inteiro",
        sub: "Sabe que o potencial é maior. Precisa de método para não ficar só no básico."
    }
];

const TIMELINE = [
    { week: "Semana 1", title: "Diagnóstico", desc: "Mapa completo do negócio + identificação das 3 maiores oportunidades de automação." },
    { week: "Semana 2–3", title: "Construção", desc: "Implementação assistida do primeiro agente ou automação no seu contexto real." },
    { week: "Semana 4", title: "Validação", desc: "Ajustes, documentação do processo e plano de expansão para os próximos 90 dias." }
];

const PLANS = [
    {
        name: "Mentoria em Grupo",
        label: "ATÉ 6 PESSOAS",
        price: "2.997",
        sessions: "4 sessões",
        duration: "30 dias",
        features: ["4 sessões ao vivo em grupo", "Diagnóstico individual pré-sessão", "Acesso à comunidade S.H.A.R.K.", "Gravações das sessões"],
        highlight: false
    },
    {
        name: "Mentoria Individual",
        label: "1:1 COM RED",
        price: "4.997",
        sessions: "8 sessões",
        duration: "30 dias",
        features: ["8 sessões individuais com Red", "Diagnóstico completo do negócio", "Implementação assistida ao vivo", "Suporte por WhatsApp 30 dias"],
        highlight: true
    },
    {
        name: "Intensiva",
        label: "TRANSFORMAÇÃO TOTAL",
        price: "9.997",
        sessions: "12 sessões",
        duration: "60 dias",
        features: ["12 sessões individuais", "Dedicação exclusiva de Red", "3 agentes implementados garantidos", "Suporte 60 dias + revisão 90 dias"],
        highlight: false
    }
];

export default function MentoriaPage() {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            {/* FONTS */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200;12..96,400;12..96,800;12..96,900&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;700&display=swap');
                body { font-family: 'DM Sans', sans-serif; }
            `}</style>

            <main className="min-h-screen bg-[#09090b] text-white relative overflow-x-hidden">

                {/* Background glow */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div style={{ background: "radial-gradient(ellipse 70% 40% at 50% -5%, rgba(249,115,22,0.12) 0%, transparent 60%)" }} className="absolute inset-0" />
                    <div style={{ background: "radial-gradient(ellipse 40% 30% at 85% 85%, rgba(59,130,246,0.06) 0%, transparent 50%)" }} className="absolute inset-0" />
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

                {/* HERO */}
                <section className="relative z-10 max-w-4xl mx-auto px-6 pt-16 pb-24 text-center">
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <p className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-6">Mentoria RedPro</p>
                        <h1
                            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 900, lineHeight: 0.95, letterSpacing: "-0.03em", fontSize: "clamp(44px, 7vw, 88px)" }}
                            className="text-white mb-6"
                        >
                            Você tem o negócio.<br />
                            <span style={{ color: "#f97316" }}>Falta a IA</span><br />
                            trabalhando por você.
                        </h1>
                        <p className="text-[#a1a1aa] text-lg max-w-xl mx-auto mb-4 leading-relaxed" style={{ fontWeight: 300 }}>
                            Individual e em grupo · A partir de R$ 2.997
                        </p>
                        <p className="text-[#71717a] text-sm mb-10">
                            Construído por um engenheiro que nunca escreveu uma linha de código profissional<br />e hoje tem 10 agentes de IA rodando 24/7 no próprio negócio.
                        </p>
                        <motion.button
                            onClick={() => setModalOpen(true)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-10 py-4 bg-orange-500 hover:bg-orange-400 text-black font-bold rounded-xl text-sm transition-colors"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                            Quero me candidatar
                        </motion.button>
                        <p className="text-xs text-[#71717a] mt-3">Vagas limitadas · Aplicação gratuita</p>
                    </motion.div>
                </section>

                {/* PARA QUEM */}
                <section className="relative z-10 max-w-5xl mx-auto px-6 py-20 border-t border-white/5">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                        <p className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-4">Para quem é</p>
                        <h2
                            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, letterSpacing: "-0.02em", fontSize: "clamp(24px, 3.5vw, 40px)" }}
                            className="text-white mb-12"
                        >
                            Reconhece alguma dessas situações?
                        </h2>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {PROFILES.map((p, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                className="p-6 rounded-2xl border border-[#1f1f23] bg-[#111113]"
                            >
                                <p className="font-mono text-xs text-orange-500 uppercase tracking-widest mb-3">{p.tag}</p>
                                <h3 className="text-white font-semibold text-base mb-3 leading-snug" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800 }}>
                                    {p.headline}
                                </h3>
                                <p className="text-[#71717a] text-sm leading-relaxed">{p.sub}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* O QUE VOCÊ CONSTRÓI */}
                <section className="relative z-10 max-w-5xl mx-auto px-6 py-20 border-t border-white/5">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                        <p className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-4">O que você constrói</p>
                        <h2
                            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, letterSpacing: "-0.02em", fontSize: "clamp(24px, 3.5vw, 40px)" }}
                            className="text-white mb-12"
                        >
                            Não é curso. É construção.
                        </h2>
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {BENEFITS.map((b, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.08 }}
                                className="p-6 rounded-2xl border border-[#1f1f23] bg-[#111113] flex gap-5"
                            >
                                <span className="font-mono text-orange-500 text-xs font-bold mt-1 shrink-0">{b.icon}</span>
                                <div>
                                    <h3 className="text-white font-semibold text-sm mb-1.5">{b.title}</h3>
                                    <p className="text-[#71717a] text-sm leading-relaxed">{b.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* COMO FUNCIONA */}
                <section className="relative z-10 max-w-5xl mx-auto px-6 py-20 border-t border-white/5">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                        <p className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-4">Processo</p>
                        <h2
                            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, letterSpacing: "-0.02em", fontSize: "clamp(24px, 3.5vw, 40px)" }}
                            className="text-white mb-12"
                        >
                            30 dias. Resultado concreto.
                        </h2>
                    </motion.div>
                    <div className="relative">
                        <div className="absolute left-[11px] top-0 bottom-0 w-px bg-gradient-to-b from-orange-500/40 via-orange-500/20 to-transparent hidden sm:block" />
                        <div className="space-y-8">
                            {TIMELINE.map((t, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: i * 0.1 }}
                                    className="flex gap-6 items-start"
                                >
                                    <div className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center shrink-0 mt-0.5">
                                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                                    </div>
                                    <div>
                                        <p className="font-mono text-xs text-orange-500 uppercase tracking-widest mb-1">{t.week}</p>
                                        <h3 className="text-white font-semibold text-base mb-1" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800 }}>{t.title}</h3>
                                        <p className="text-[#71717a] text-sm leading-relaxed">{t.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* PLANOS */}
                <section className="relative z-10 max-w-5xl mx-auto px-6 py-20 border-t border-white/5">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                        <p className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-4">Modalidades</p>
                        <h2
                            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, letterSpacing: "-0.02em", fontSize: "clamp(24px, 3.5vw, 40px)" }}
                            className="text-white mb-12"
                        >
                            Escolha sua intensidade.
                        </h2>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {PLANS.map((plan, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                className={`p-6 rounded-2xl border flex flex-col ${plan.highlight
                                    ? "border-orange-500/40 bg-gradient-to-b from-orange-500/8 to-[#111113]"
                                    : "border-[#1f1f23] bg-[#111113]"
                                    }`}
                            >
                                {plan.highlight && (
                                    <p className="font-mono text-xs text-orange-500 uppercase tracking-widest mb-4">Mais escolhido</p>
                                )}
                                <p className="font-mono text-xs text-[#71717a] uppercase tracking-widest mb-2">{plan.label}</p>
                                <h3 className="text-white font-bold text-lg mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800 }}>{plan.name}</h3>
                                <div className="mb-6">
                                    <span className="text-[#71717a] text-sm">R$ </span>
                                    <span className="text-3xl font-bold text-white" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{plan.price}</span>
                                    <p className="text-[#71717a] text-xs mt-1">{plan.sessions} · {plan.duration}</p>
                                </div>
                                <ul className="space-y-2.5 mb-8 flex-1">
                                    {plan.features.map((f, j) => (
                                        <li key={j} className="flex items-start gap-2.5 text-sm text-[#a1a1aa]">
                                            <svg className="w-4 h-4 text-[#22c55e] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => setModalOpen(true)}
                                    className={`w-full py-3 rounded-xl text-sm font-bold transition-colors ${plan.highlight
                                        ? "bg-orange-500 hover:bg-orange-400 text-black"
                                        : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                                        }`}
                                >
                                    Aplicar agora
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* CREDENCIAIS */}
                <section className="relative z-10 max-w-5xl mx-auto px-6 py-20 border-t border-white/5">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <p className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-6">Quem está por trás</p>
                        <h2
                            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, letterSpacing: "-0.02em", fontSize: "clamp(20px, 3vw, 36px)" }}
                            className="text-white mb-4"
                        >
                            Engenheiro. Não programador.<br />10 agentes de IA em produção.
                        </h2>
                        <p className="text-[#71717a] text-sm max-w-lg mx-auto leading-relaxed mb-10">
                            Red construiu o Método S.H.A.R.K. sem escrever uma linha de código profissional.
                            Hoje ensina empresários a fazerem o mesmo — com resultados mensuráveis.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            {["27+ alunos formados", "10 agentes em produção", "3+ casos documentados", "Engenheiro de Telecom"].map((stat, i) => (
                                <div key={i} className="px-4 py-2 rounded-full border border-[#1f1f23] bg-[#111113]">
                                    <span className="font-mono text-xs text-[#a1a1aa] tracking-wide">{stat}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* CTA FINAL */}
                <section className="relative z-10 max-w-3xl mx-auto px-6 py-20 text-center border-t border-white/5">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                        <h2
                            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 900, letterSpacing: "-0.03em", fontSize: "clamp(32px, 5vw, 56px)" }}
                            className="text-white mb-4"
                        >
                            Pronto para a IA trabalhar<br />
                            <span style={{ color: "#f97316" }}>pelo seu negócio?</span>
                        </h2>
                        <p className="text-[#a1a1aa] text-sm mb-8">Vagas limitadas por ciclo. Aplicação gratuita e sem compromisso.</p>
                        <motion.button
                            onClick={() => setModalOpen(true)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-12 py-4 bg-orange-500 hover:bg-orange-400 text-black font-bold rounded-xl text-sm transition-colors"
                        >
                            Quero me candidatar
                        </motion.button>
                    </motion.div>
                </section>

                <Footer />

                {/* MODAL */}
                <AnimatePresence>
                    {modalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
                            onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0, y: 16 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 16 }}
                                transition={{ duration: 0.25 }}
                                className="w-full max-w-lg bg-[#09090b] border border-[#1f1f23] rounded-2xl p-8 relative"
                            >
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="absolute top-4 right-4 text-[#71717a] hover:text-white transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <div className="mb-6">
                                    <p className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-2">Aplicação</p>
                                    <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800 }}>
                                        Vamos entender seu momento
                                    </h3>
                                </div>
                                <QualificationFlow onClose={() => setModalOpen(false)} />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </main>
        </>
    );
}
