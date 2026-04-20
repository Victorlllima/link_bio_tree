"use client";

import { SharkCarousel, iShark } from "@/components/ui/shark-carousel";
import { SharkCard } from "@/components/ui/shark-card";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "@/components/footer";

const sharks: iShark[] = [
    {
        id: "1",
        name: "Ana Silva",
        role: "Fullstack AI Engineer",
        skills: ["React", "Python", "LangChain", "Supabase"],
        description: "Especialista em construir aplicações completas de IA generativa. Já entregou mais de 10 projetos usando o Método S.H.A.R.K. Focada em performance e escalabilidade.",
        profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
        available: true,
        tags: ["vendas", "produto"],
        lastProject: { title: "Plataforma SaaS de Vendas", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=500&auto=format&fit=crop" }
    },
    {
        id: "2",
        name: "Pedro Costa",
        role: "Automation Expert",
        skills: ["n8n", "Zapier", "OpenAI API", "Webhook"],
        description: "Mestre das automações invisíveis. Se você faz algo repetitivo, o Pedro automatiza. Certificado em arquitetura de fluxos complexos e integração de CRMs.",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
        available: true,
        tags: ["automatizar", "custos"],
        lastProject: { title: "Bot de Atendimento 24/7", image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=500&auto=format&fit=crop" }
    },
    {
        id: "3",
        name: "Lucas Oliveira",
        role: "Frontend Creative",
        skills: ["Three.js", "Tailwind", "Framer Motion", "Next.js"],
        description: "Traz o fator UAU para qualquer interface. Especialista em animações, micro-interações e design systems que convertem.",
        profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
        available: false,
        tags: ["vendas", "produto"],
        lastProject: { title: "Landing Page Imersiva 3D", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop" }
    },
    {
        id: "4",
        name: "Mariana Santos",
        role: "Prompt Engineer",
        skills: ["GPT-4", "Claude", "Fine-tuning", "RAG"],
        description: "Fala a língua dos modelos como ninguém. Cria personas, refina outputs e garante que a IA entregue exatamente o que o negócio precisa.",
        profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
        available: true,
        tags: ["automatizar", "custos"],
        lastProject: { title: "Auditoria de Conteúdo AI", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=500&auto=format&fit=crop" }
    },
    {
        id: "5",
        name: "Carlos Dev",
        role: "Backend Architect",
        skills: ["PostgreSQL", "Node.js", "Redis", "Docker"],
        description: "Constrói a fundação que aguenta o tranco. Segurança, velocidade e arquitetura robusta para sistemas que não podem cair.",
        profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
        available: true,
        tags: ["custos", "produto"],
        lastProject: { title: "Otimização de Cloud AWS", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=500&auto=format&fit=crop" }
    },
    {
        id: "6",
        name: "Julia Tech",
        role: "AI Product Manager",
        skills: ["Scrum", "Product Discovery", "Jira", "Growth"],
        description: "Traduz necessidades de negócio em requisitos técnicos. Garante que o produto resolva dores reais e chegue ao mercado rápido.",
        profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
        available: true,
        tags: ["produto", "vendas"],
        lastProject: { title: "Lançamento de App Global", image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=500&auto=format&fit=crop" }
    },
];

const FILTERS = [
    { id: "all", label: "Todos os Sharks" },
    { id: "vendas", label: "Quero vender mais" },
    { id: "automatizar", label: "Quero automatizar" },
    { id: "custos", label: "Reduzir custos" },
];

const HOW_IT_WORKS = [
    { num: "01", title: "Escolha o perfil", desc: "Filtre por objetivo de negócio e veja os Sharks disponíveis." },
    { num: "02", title: "Envie o briefing", desc: "Descreva o projeto em 2 minutos. Sem formulário longo, sem burocracia." },
    { num: "03", title: "Receba proposta em 48h", desc: "O Shark entra em contato com escopo, prazo e valor." },
];

export default function ContratePage() {
    const [activeFilter, setActiveFilter] = useState("all");

    const filteredSharks = activeFilter === "all"
        ? sharks
        : sharks.filter(s => s.tags.includes(activeFilter));

    const items = filteredSharks.map((shark, index) => (
        <SharkCard key={shark.id} shark={shark} index={index} />
    ));

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200;12..96,400;12..96,800;12..96,900&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;700&display=swap');
                body { font-family: 'DM Sans', sans-serif; }
            `}</style>

            <main className="min-h-screen bg-[#09090b] text-white relative overflow-x-hidden">

                {/* Background */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div style={{ background: "radial-gradient(ellipse 70% 40% at 50% -5%, rgba(249,115,22,0.10) 0%, transparent 55%)" }} className="absolute inset-0" />
                    <div style={{ background: "radial-gradient(ellipse 50% 40% at 90% 80%, rgba(249,115,22,0.04) 0%, transparent 50%)" }} className="absolute inset-0" />
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
                <section className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-16 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <p className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-6">Contrate um Shark</p>
                        <h1
                            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 900, lineHeight: 0.93, letterSpacing: "-0.03em", fontSize: "clamp(44px, 7vw, 88px)" }}
                            className="text-white mb-6"
                        >
                            Devs certificados pelo<br />
                            <span style={{ color: "#f97316" }}>Método S.H.A.R.K.</span>
                        </h1>
                        <p className="text-[#a1a1aa] text-base max-w-xl mx-auto mb-4 leading-relaxed" style={{ fontWeight: 300 }}>
                            Cada Shark foi treinado e certificado pela RedPro AI Academy. Eles constroem com IA do jeito certo — rápido, escalável e sem enrolação.
                        </p>
                        <p className="text-[#71717a] text-sm">Proposta em 48h · Sem intermediários · Direto com o dev</p>
                    </motion.div>
                </section>

                {/* COMO FUNCIONA */}
                <section className="relative z-10 max-w-4xl mx-auto px-6 pb-16">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {HOW_IT_WORKS.map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                                className="p-5 rounded-2xl border border-[#1f1f23] bg-[#111113] flex gap-4"
                            >
                                <span className="font-mono text-orange-500 text-xs font-bold mt-0.5 shrink-0">{h.num}</span>
                                <div>
                                    <p className="text-white font-semibold text-sm mb-1">{h.title}</p>
                                    <p className="text-[#71717a] text-xs leading-relaxed">{h.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* SHARKS */}
                <section className="relative z-10 max-w-6xl mx-auto px-6 pb-20">

                    {/* Filtros */}
                    <div className="flex flex-wrap gap-2 mb-10 justify-center">
                        {FILTERS.map((f) => (
                            <button
                                key={f.id}
                                onClick={() => setActiveFilter(f.id)}
                                className={cn(
                                    "px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all border",
                                    activeFilter === f.id
                                        ? "bg-orange-500 border-orange-500 text-black font-bold"
                                        : "bg-white/5 border-[#1f1f23] text-[#71717a] hover:border-orange-500/30 hover:text-white"
                                )}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {/* Carrossel */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeFilter}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.3 }}
                        >
                            {filteredSharks.length > 0 ? (
                                <SharkCarousel items={items} />
                            ) : (
                                <div className="text-center py-20">
                                    <p className="text-[#71717a] font-mono text-sm">Nenhum Shark disponível nessa área.</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </section>

                {/* CTA — SEJA UM SHARK */}
                <section className="relative z-10 max-w-5xl mx-auto px-6 py-16 border-t border-white/5">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-2xl border border-[#1f1f23] bg-[#111113]"
                        style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.06) 0%, #111113 100%)" }}
                    >
                        <div>
                            <p className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-2">Para desenvolvedores</p>
                            <h3
                                className="text-white font-bold text-xl mb-1"
                                style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800 }}
                            >
                                Quer se tornar um Shark certificado?
                            </h3>
                            <p className="text-[#71717a] text-sm">Conheça o Método S.H.A.R.K. e entre para o ecossistema RedPro.</p>
                        </div>
                        <a
                            href="https://vibecoding.redpro.com.br"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 px-8 py-3 bg-orange-500 hover:bg-orange-400 text-black font-bold rounded-xl text-sm transition-colors"
                        >
                            Ver o Método
                        </a>
                    </motion.div>
                </section>

                <Footer />
            </main>
        </>
    );
}
