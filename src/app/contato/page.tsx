"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Footer } from "@/components/footer";

const CHANNELS = [
    {
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
        ),
        label: "WhatsApp",
        value: "Resposta em até 4 horas",
        action: "Abrir conversa",
        href: "https://wa.me/5561992978796"
    },
    {
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
        ),
        label: "Email",
        value: "contato@redpro.com.br",
        action: "Enviar email",
        href: "mailto:contato@redpro.com.br"
    },
    {
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
        ),
        label: "Instagram",
        value: "@redpro.ai",
        action: "Ver perfil",
        href: "https://instagram.com/redpro.ai"
    }
];

const TOPICS = [
    "Mentoria individual",
    "Treinamento In Company",
    "Parceria / Collab",
    "Imprensa / Mídia",
    "Outro assunto"
];

export default function ContatoPage() {
    const [submitted, setSubmitted] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({ name: "", email: "", topic: "", message: "" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) return;
        setSending(true);
        setError("");
        const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });
        setSending(false);
        if (res.ok) {
            setSubmitted(true);
        } else {
            setError("Erro ao enviar. Tente novamente.");
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200;12..96,400;12..96,800;12..96,900&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;700&display=swap');
                body { font-family: 'DM Sans', sans-serif; }
            `}</style>

            <main className="min-h-screen bg-[#09090b] text-white relative overflow-x-hidden">

                {/* Background */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div style={{ background: "radial-gradient(ellipse 60% 35% at 50% -5%, rgba(249,115,22,0.10) 0%, transparent 60%)" }} className="absolute inset-0" />
                </div>

                {/* NAV */}
                <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
                    <a href="/" className="flex items-center gap-2 text-[#71717a] hover:text-white transition-colors text-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Voltar
                    </a>
                    <span className="font-mono text-xs tracking-widest text-[#71717a] uppercase">RedPro AI Academy</span>
                </nav>

                {/* HERO */}
                <section className="relative z-10 max-w-5xl mx-auto px-6 pt-12 pb-6">
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <p className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-4">Fale com o RedPro</p>
                        <h1
                            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 900, lineHeight: 0.95, letterSpacing: "-0.03em", fontSize: "clamp(40px, 6vw, 72px)" }}
                            className="text-white mb-4"
                        >
                            A conversa certa<br />no momento certo.
                        </h1>
                        <p className="text-[#a1a1aa] text-base max-w-lg leading-relaxed" style={{ fontWeight: 300 }}>
                            Mentoria, parceria, treinamento ou apenas uma dúvida. Escolha o canal e fale diretamente com a equipe RedPro.
                        </p>
                    </motion.div>
                </section>

                {/* CONTENT */}
                <section className="relative z-10 max-w-5xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                        {/* Form — 3 cols */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="lg:col-span-3"
                        >
                            <div className="p-8 rounded-2xl border border-[#1f1f23] bg-[#111113]">
                                {!submitted ? (
                                    <>
                                        <p className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-5">Formulário</p>
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block font-mono text-xs text-[#71717a] uppercase tracking-widest mb-1.5">Nome</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-3 text-white text-sm focus:border-orange-500/50 outline-none transition-colors placeholder:text-[#71717a]"
                                                        placeholder="Seu nome"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block font-mono text-xs text-[#71717a] uppercase tracking-widest mb-1.5">Email</label>
                                                    <input
                                                        type="email"
                                                        required
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-3 text-white text-sm focus:border-orange-500/50 outline-none transition-colors placeholder:text-[#71717a]"
                                                        placeholder="seu@email.com"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block font-mono text-xs text-[#71717a] uppercase tracking-widest mb-1.5">Assunto</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {TOPICS.map((t) => (
                                                        <button
                                                            key={t}
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, topic: t })}
                                                            className={`px-3 py-1.5 rounded-full text-xs border transition-colors font-mono ${formData.topic === t
                                                                ? "border-orange-500/60 bg-orange-500/10 text-orange-400"
                                                                : "border-[#1f1f23] bg-[#09090b] text-[#71717a] hover:border-orange-500/30"
                                                                }`}
                                                        >
                                                            {t}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block font-mono text-xs text-[#71717a] uppercase tracking-widest mb-1.5">Mensagem</label>
                                                <textarea
                                                    required
                                                    value={formData.message}
                                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                    className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-3 text-white text-sm focus:border-orange-500/50 outline-none transition-colors resize-none placeholder:text-[#71717a] h-28"
                                                    placeholder="Conte o contexto do seu projeto ou dúvida..."
                                                />
                                            </div>
                                            {error && <p className="text-xs text-red-400">{error}</p>}
                                            <button
                                                type="submit"
                                                disabled={sending}
                                                className="w-full py-3.5 bg-orange-500 hover:bg-orange-400 text-black font-bold rounded-xl text-sm transition-colors disabled:opacity-50"
                                            >
                                                {sending ? "Enviando..." : "Enviar mensagem"}
                                            </button>
                                        </form>
                                    </>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-10"
                                    >
                                        <div className="w-12 h-12 rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-5 h-5 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800 }}>
                                            Mensagem enviada
                                        </h3>
                                        <p className="text-[#71717a] text-sm">
                                            Retornamos em até 24 horas, {formData.name}.
                                        </p>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>

                        {/* Channels — 2 cols */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="lg:col-span-2 space-y-3"
                        >
                            <p className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-4">Canais diretos</p>
                            {CHANNELS.map((ch, i) => (
                                <a
                                    key={i}
                                    href={ch.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 p-5 rounded-2xl border border-[#1f1f23] bg-[#111113] hover:border-orange-500/30 hover:bg-orange-500/5 transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shrink-0">
                                        {ch.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-semibold text-sm">{ch.label}</p>
                                        <p className="text-[#71717a] text-xs truncate">{ch.value}</p>
                                    </div>
                                    <svg className="w-4 h-4 text-[#71717a] group-hover:text-orange-500 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </a>
                            ))}

                            {/* Response time */}
                            <div className="mt-6 p-5 rounded-2xl border border-[#1f1f23] bg-[#111113]">
                                <p className="font-mono text-xs tracking-widest text-[#71717a] uppercase mb-3">Tempo de resposta</p>
                                <div className="space-y-2.5">
                                    {[
                                        { channel: "WhatsApp", time: "Até 4 horas", dot: "bg-[#22c55e]" },
                                        { channel: "Email", time: "Até 24 horas", dot: "bg-orange-500" },
                                        { channel: "Instagram", time: "Até 48 horas", dot: "bg-[#3b82f6]" }
                                    ].map((r, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${r.dot}`} />
                                                <span className="text-[#a1a1aa] text-xs">{r.channel}</span>
                                            </div>
                                            <span className="font-mono text-xs text-[#71717a]">{r.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <Footer />
            </main>
        </>
    );
}
