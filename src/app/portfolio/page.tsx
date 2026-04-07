"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "@/components/footer";
import Link from "next/link";

const PROJECTS = [
    {
        id: "nossocrm",
        name: "NossoCRM",
        tagline: "CRM inteligente com assistente de IA integrado",
        description: "CRM SaaS completo com pipeline Kanban, inbox inteligente e briefing diário gerado por IA. Inclui webhooks para automações, gestão de contatos e atividades. Pronto para produção com wizard de instalação automática.",
        stack: ["Next.js 16", "React 19", "Supabase", "AI SDK", "Google Gemini", "Claude", "TypeScript"],
        category: "SaaS",
        color: "from-blue-500 to-cyan-500",
        accent: "#3b82f6",
    },
    {
        id: "bioete",
        name: "Bioete",
        tagline: "Automação comercial para tratamento de esgoto",
        description: "Plataforma de automação comercial para Grupo MPF. Agente de IA no WhatsApp que qualifica leads, gera orçamentos em PDF e faz follow-up automatizado. Integração com ERP PDVX para notas fiscais automáticas.",
        stack: ["Supabase Self-Hosted", "Evolution API", "PostgreSQL", "Redis", "Traefik", "Hetzner"],
        category: "Automação",
        color: "from-green-500 to-emerald-500",
        accent: "#22c55e",
    },
    {
        id: "openclaw",
        name: "OpenClaw Swarm",
        tagline: "Constelação de 10 agentes de IA autônomos 24/7",
        description: "Sistema multi-agente rodando em VPS Hetzner. O agente Constellation coordena pesquisa, conteúdo, SEO e análise via Mission Control. Pipelines diários de geração de conteúdo e debates estratégicos entre agentes.",
        stack: ["Next.js 14", "Convex Cloud", "Claude Sonnet/Haiku", "Ollama", "Tailscale", "Hetzner VPS"],
        category: "P&D — RedPro AI Academy",
        color: "from-purple-500 to-violet-500",
        accent: "#a855f7",
    },
    {
        id: "livelo",
        name: "Pontos Livelo Monitor",
        tagline: "Monitor automatizado de promoções de pontos",
        description: "Rastreia promoções de pontos Livelo em centenas de parceiros diariamente. Classifica Top 10, destaca favoritos e envia relatório visual por email com design responsivo.",
        stack: ["Python 3.11", "Playwright", "BeautifulSoup4", "Gmail API OAuth 2.0", "GitHub Actions"],
        category: "Automação",
        color: "from-yellow-500 to-orange-500",
        accent: "#f59e0b",
    },
    {
        id: "redmeetpro",
        name: "Red Meet Pro",
        tagline: "Gravação e resumo de reuniões com IA local",
        description: "App desktop que grava, transcreve e resume reuniões com total privacidade — processamento 100% local. Transcrição via Whisper, resumo via Ollama, envio automático por email. Histórico em SQLite.",
        stack: ["Tauri v2 (Rust)", "Next.js 14", "FastAPI", "Whisper.cpp", "Ollama", "SQLite"],
        category: "Desktop",
        color: "from-red-500 to-rose-500",
        accent: "#ef4444",
    },
    {
        id: "vibevoice",
        name: "VibeVoice",
        tagline: "Automação de desktop por comando de voz",
        description: "Captura áudio do sistema e microfone, processa comandos de voz e executa automações de desktop com IA. Cria workflows por voz, integrado com OpenAI, Groq e Supabase.",
        stack: ["Python 3.11", "PyQt6", "pyautogui", "sounddevice", "OpenAI", "Groq", "Supabase"],
        category: "Automação",
        color: "from-pink-500 to-fuchsia-500",
        accent: "#ec4899",
    },
    {
        id: "cbf",
        name: "CBF Manager",
        tagline: "Gestão de base de dados para a CBF",
        description: "Sistema de gerenciamento de estruturas de dados de futebol para a Confederação Brasileira de Futebol. Interface responsiva com design system completo e componentes reutilizáveis.",
        stack: ["Vite", "React 18", "TypeScript", "shadcn/ui", "TailwindCSS", "Radix UI"],
        category: "Enterprise",
        color: "from-emerald-500 to-teal-500",
        accent: "#10b981",
    },
    {
        id: "familycare",
        name: "Family Care",
        tagline: "SaaS de gestão operacional familiar",
        description: "Plataforma completa com finanças, lista de compras colaborativa, agenda familiar, saúde infantil, sistema de pontos para crianças, documentos, refeições e integração Alexa. Arquitetura multi-tenant escalável.",
        stack: ["Next.js 14", "NestJS", "Prisma", "PostgreSQL", "Socket.io", "NextAuth v5", "Cloudflare R2", "Alexa Skills Kit"],
        category: "SaaS",
        color: "from-sky-500 to-blue-500",
        accent: "#0ea5e9",
    },
    {
        id: "youtubedigest",
        name: "Youtube Digest",
        tagline: "Curador inteligente de conteúdo diário",
        description: "Coleta conteúdo relevante do Reddit e YouTube, filtra por relevância com LLM e envia digest com Top 10 via Telegram. Integrado ao OpenClaw Swarm (agentes Voyager, Zenith e Mercury).",
        stack: ["Node.js", "Reddit API", "YouTube Data API v3", "Telegram Bot", "Convex", "OpenClaw Gateway"],
        category: "Automação",
        color: "from-orange-500 to-amber-500",
        accent: "#f97316",
    },
    {
        id: "nexus",
        name: "Nexus AI Agent",
        tagline: "Agente IA multifuncional para processamento de dados",
        description: "Processa documentos (PDF, Word), vídeos do YouTube, transcrições e arquivos em batch. Interface drag-and-drop para workflows com síntese de voz ElevenLabs e integração de pagamentos Stripe.",
        stack: ["Next.js 16", "React 19", "Mastra", "Claude", "ElevenLabs", "Supabase", "Stripe", "FFmpeg"],
        category: "IA",
        color: "from-indigo-500 to-purple-500",
        accent: "#6366f1",
    },
    {
        id: "adminpanel",
        name: "Admin Panel — RedPro",
        tagline: "Painel operacional interno da RedPro AI Solutions",
        description: "Painel administrativo da RedPro AI Solutions para gestão de clientes, precificação com IA, geração de propostas e contratos via streaming (Claude), biblioteca de conteúdo para Instagram e calendário editorial.",
        stack: ["Next.js 16", "TypeScript", "Tailwind CSS", "NextAuth v5", "Prisma v5", "PostgreSQL", "Claude (streaming)", "Docker Swarm", "Hetzner"],
        category: "Internal Tool",
        color: "from-neutral-500 to-zinc-600",
        accent: "#f97316",
    },
];

const CATEGORIES = ["Todos", "SaaS", "Automação", "IA", "Desktop", "Enterprise", "Internal Tool", "P&D — RedPro AI Academy"];

const WHATSAPP_URL = "https://wa.me/5561992978796";

function PlaceholderThumb({ project }: { project: typeof PROJECTS[0] }) {
    return (
        <div className={`w-full h-full bg-gradient-to-br ${project.color} opacity-20 flex items-center justify-center`}>
            <span className="font-mono text-xs text-white/40 uppercase tracking-widest">{project.category}</span>
        </div>
    );
}

export default function PortfolioPage() {
    const [activeCategory, setActiveCategory] = useState("Todos");
    const [selected, setSelected] = useState<typeof PROJECTS[0] | null>(null);

    const filtered = activeCategory === "Todos"
        ? PROJECTS
        : PROJECTS.filter(p => p.category === activeCategory);

    return (
        <>
            <main className="min-h-screen bg-[#09090b] text-white">
                {/* Header */}
                <div className="border-b border-[#1f1f23] px-6 py-4 flex items-center gap-4">
                    <Link href="/" className="font-mono text-xs tracking-widest text-[#71717a] uppercase hover:text-white transition-colors">
                        ← RedPro
                    </Link>
                    <span className="text-[#3f3f46]">/</span>
                    <span className="font-mono text-xs tracking-widest text-[#f97316] uppercase">Portfólio</span>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-20">
                    {/* Hero */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-16"
                    >
                        <p className="font-mono text-xs tracking-[0.2em] text-[#f97316] uppercase mb-4">Projetos Reais</p>
                        <h1
                            className="text-5xl md:text-7xl font-black text-white mb-6 leading-none tracking-tight"
                            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 900 }}
                        >
                            O que a IA<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f97316] to-[#fb923c]">
                                já construiu.
                            </span>
                        </h1>
                        <p className="text-[#71717a] text-lg max-w-xl" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
                            {PROJECTS.length} projetos em produção — automações, SaaS, agentes e ferramentas internas. Todos desenvolvidos com o Método S.H.A.R.K.
                        </p>
                    </motion.div>

                    {/* Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-wrap gap-2 mb-12"
                    >
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-lg font-mono text-xs tracking-widest uppercase transition-all duration-200 ${
                                    activeCategory === cat
                                        ? "bg-[#f97316] text-white"
                                        : "bg-[#111113] text-[#71717a] border border-[#1f1f23] hover:border-[#f97316]/40 hover:text-white"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </motion.div>

                    {/* Grid */}
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <AnimatePresence mode="popLayout">
                            {filtered.map((project, index) => (
                                <motion.div
                                    key={project.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3, delay: index * 0.04 }}
                                    onClick={() => setSelected(project)}
                                    className="group cursor-pointer bg-[#111113] border border-[#1f1f23] rounded-2xl overflow-hidden hover:border-[#f97316]/30 transition-all duration-300 hover:shadow-[0_0_40px_rgba(249,115,22,0.08)]"
                                >
                                    {/* Thumb */}
                                    <div className="relative aspect-video overflow-hidden">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-15 group-hover:opacity-25 transition-opacity duration-300`} />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                                            <div
                                                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                                                style={{ background: `${project.accent}18`, border: `1px solid ${project.accent}30` }}
                                            >
                                                <span className="text-2xl font-black" style={{ color: project.accent, fontFamily: "'JetBrains Mono', monospace" }}>
                                                    {project.name.slice(0, 2).toUpperCase()}
                                                </span>
                                            </div>
                                            <span
                                                className="font-mono text-[10px] tracking-[0.2em] uppercase"
                                                style={{ color: `${project.accent}80` }}
                                            >
                                                {project.category}
                                            </span>
                                        </div>
                                        {/* Placeholder label */}
                                        <div className="absolute bottom-2 right-2">
                                            <span className="font-mono text-[9px] text-[#3f3f46] tracking-widest uppercase">thumbnail</span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h3
                                                className="text-lg font-bold text-white leading-tight"
                                                style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800 }}
                                            >
                                                {project.name}
                                            </h3>
                                            <span
                                                className="shrink-0 px-2 py-0.5 rounded-md font-mono text-[9px] tracking-widest uppercase"
                                                style={{ background: `${project.accent}18`, color: project.accent }}
                                            >
                                                {project.category}
                                            </span>
                                        </div>
                                        <p className="text-[#71717a] text-sm leading-relaxed mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                            {project.tagline}
                                        </p>

                                        {/* Stack pills */}
                                        <div className="flex flex-wrap gap-1.5">
                                            {project.stack.slice(0, 4).map(tech => (
                                                <span
                                                    key={tech}
                                                    className="px-2 py-0.5 rounded-md bg-[#1f1f23] text-[#52525b] font-mono text-[10px] tracking-wide"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                            {project.stack.length > 4 && (
                                                <span className="px-2 py-0.5 rounded-md bg-[#1f1f23] text-[#52525b] font-mono text-[10px]">
                                                    +{project.stack.length - 4}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>

                <Footer />
            </main>

            {/* Modal */}
            <AnimatePresence>
                {selected && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                        onClick={() => setSelected(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.92, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.92, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="relative w-full max-w-xl bg-[#111113] rounded-2xl overflow-hidden border border-[#1f1f23] shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Close */}
                            <button
                                onClick={() => setSelected(null)}
                                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#1f1f23] text-[#71717a] flex items-center justify-center hover:bg-[#f97316] hover:text-white transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Thumb */}
                            <div className="relative aspect-video">
                                <div className={`absolute inset-0 bg-gradient-to-br ${selected.color} opacity-20`} />
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                    <div
                                        className="w-20 h-20 rounded-2xl flex items-center justify-center"
                                        style={{ background: `${selected.accent}18`, border: `1px solid ${selected.accent}40` }}
                                    >
                                        <span className="text-3xl font-black" style={{ color: selected.accent, fontFamily: "'JetBrains Mono', monospace" }}>
                                            {selected.name.slice(0, 2).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-transparent to-transparent" />
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-1">
                                    <span
                                        className="font-mono text-[10px] tracking-[0.2em] uppercase"
                                        style={{ color: selected.accent }}
                                    >
                                        {selected.category}
                                    </span>
                                </div>
                                <h3
                                    className="text-2xl font-black text-white mb-2"
                                    style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 900 }}
                                >
                                    {selected.name}
                                </h3>
                                <p className="text-[#a1a1aa] text-sm leading-relaxed mb-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    {selected.description}
                                </p>

                                {/* Full stack */}
                                <div className="mb-6">
                                    <p className="font-mono text-[10px] tracking-[0.15em] text-[#3f3f46] uppercase mb-2">Stack</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {selected.stack.map(tech => (
                                            <span
                                                key={tech}
                                                className="px-2.5 py-1 rounded-lg bg-[#1f1f23] border border-[#2a2a2e] text-[#71717a] font-mono text-[10px] tracking-wide"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* CTA */}
                                <a
                                    href={`${WHATSAPP_URL}?text=${encodeURIComponent(`Olá Red, quero falar sobre o projeto ${selected.name}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                    style={{
                                        background: "linear-gradient(135deg, #f97316, #fb923c)",
                                        fontFamily: "'DM Sans', sans-serif",
                                        fontWeight: 600,
                                        boxShadow: "0 0 30px rgba(249,115,22,0.3)"
                                    }}
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    Quero falar sobre esse projeto
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
