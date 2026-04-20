"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "@/components/footer";

const TOPICS = [
    { num: "01", title: "IA para negócios reais", desc: "Casos práticos, não teoria. O que está funcionando agora em empresas brasileiras." },
    { num: "02", title: "Bastidores do Método S.H.A.R.K.", desc: "Red compartilha o que está construindo — agentes, automações, decisões de arquitetura." },
    { num: "03", title: "Ferramentas que valem o tempo", desc: "Curadoria semanal de ferramentas testadas. Sem hype, com contexto de uso real." },
    { num: "04", title: "Oportunidades antes do mercado", desc: "Vagas, parcerias e lançamentos do ecossistema RedPro antes de todo mundo." }
];

export default function NewsletterPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setStatus("loading");
        const res = await fetch("/api/newsletter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });
        setStatus(res.ok ? "done" : "error");
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200;12..96,400;12..96,800;12..96,900&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;700&display=swap');
                body { font-family: 'DM Sans', sans-serif; }
            `}</style>

            <main className="min-h-screen bg-[#09090b] text-white relative overflow-x-hidden flex flex-col">

                {/* Background */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div style={{ background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(249,115,22,0.14) 0%, transparent 55%)" }} className="absolute inset-0" />
                    <div style={{ background: "radial-gradient(ellipse 50% 40% at 10% 80%, rgba(59,130,246,0.05) 0%, transparent 50%)" }} className="absolute inset-0" />
                </div>

                {/* NAV */}
                <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-5xl mx-auto w-full">
                    <a href="/" className="flex items-center gap-2 text-[#71717a] hover:text-white transition-colors text-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Voltar
                    </a>
                    <span className="font-mono text-xs tracking-widest text-[#71717a] uppercase">RedPro AI Academy</span>
                </nav>

                {/* HERO — CTA principal */}
                <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16 text-center max-w-3xl mx-auto w-full">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full">
                        <p className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-6">Newsletter RedPro</p>

                        <h1
                            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 900, lineHeight: 0.92, letterSpacing: "-0.04em", fontSize: "clamp(56px, 10vw, 120px)" }}
                            className="text-white mb-8"
                        >
                            RED<br />
                            <span style={{ color: "#f97316" }}>SHI</span><br />
                            FT
                        </h1>

                        <p className="text-[#a1a1aa] text-base max-w-md mx-auto mb-3 leading-relaxed" style={{ fontWeight: 300 }}>
                            Conteúdos sobre IA que não parecem ter sido escritos por uma IA. Porque não foram.<br />
                            Toda semana. Sem spam. Sem hype.
                        </p>
                        <p className="text-[#71717a] text-xs mb-10 font-mono">Gratuita · 1× por semana · Cancele quando quiser</p>

                        {/* Form */}
                        <AnimatePresence mode="wait">
                            {status === "idle" && (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onSubmit={handleSubmit}
                                    className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                                >
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="seu@email.com"
                                        className="flex-1 bg-[#111113] border border-[#1f1f23] rounded-xl px-4 py-3.5 text-white text-sm focus:border-orange-500/50 outline-none transition-colors placeholder:text-[#71717a] font-mono text-center sm:text-left"
                                    />
                                    <button
                                        type="submit"
                                        className="px-8 py-3.5 bg-orange-500 hover:bg-orange-400 text-black font-bold rounded-xl text-sm transition-colors whitespace-nowrap"
                                    >
                                        Quero assinar
                                    </button>
                                </motion.form>
                            )}

                            {status === "loading" && (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center justify-center gap-3 h-14"
                                >
                                    <div className="flex gap-1">
                                        {[0, 1, 2].map((i) => (
                                            <motion.div
                                                key={i}
                                                className="w-2 h-2 rounded-full bg-orange-500"
                                                animate={{ opacity: [0.3, 1, 0.3] }}
                                                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                                            />
                                        ))}
                                    </div>
                                    <span className="font-mono text-xs text-[#71717a] uppercase tracking-widest">Processando</span>
                                </motion.div>
                            )}

                            {status === "error" && (
                                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-14 flex items-center justify-center">
                                    <p className="text-red-400 text-sm font-mono">Erro ao cadastrar. Tente novamente.</p>
                                </motion.div>
                            )}

                            {status === "done" && (
                                <motion.div
                                    key="done"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center"
                                >
                                    <div className="w-12 h-12 rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-5 h-5 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-white font-bold mb-1" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800 }}>Bem-vindo à Singularidade.</p>
                                    <p className="text-[#71717a] text-sm">Primeira edição chega em breve.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </section>

                {/* O QUE VOCÊ RECEBE */}
                <section className="relative z-10 max-w-5xl mx-auto w-full px-6 py-16 border-t border-white/5">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                        <p className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-4 text-center">O que você recebe</p>
                        <h2
                            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, letterSpacing: "-0.02em", fontSize: "clamp(24px, 3.5vw, 36px)" }}
                            className="text-white mb-10 text-center"
                        >
                            Cada edição cobre 4 pilares.
                        </h2>
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {TOPICS.map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.08 }}
                                className="p-6 rounded-2xl border border-[#1f1f23] bg-[#111113] flex gap-5"
                            >
                                <span className="font-mono text-orange-500 text-xs font-bold mt-0.5 shrink-0">{t.num}</span>
                                <div>
                                    <h3 className="text-white font-semibold text-sm mb-1.5">{t.title}</h3>
                                    <p className="text-[#71717a] text-sm leading-relaxed">{t.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* SOCIAL PROOF simples */}
                <section className="relative z-10 max-w-5xl mx-auto w-full px-6 py-12 border-t border-white/5">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-wrap justify-center gap-6 text-center"
                    >
                        {[
                            { val: "Semanal", label: "Frequência" },
                            { val: "100%", label: "Gratuita" },
                            { val: "0", label: "Spam" },
                            { val: "1 clique", label: "Para cancelar" }
                        ].map((s, i) => (
                            <div key={i} className="px-6 py-3 rounded-xl border border-[#1f1f23] bg-[#111113]">
                                <p className="text-orange-500 font-bold text-lg" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800 }}>{s.val}</p>
                                <p className="text-[#71717a] text-xs font-mono mt-0.5">{s.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </section>

                <Footer />
            </main>
        </>
    );
}
