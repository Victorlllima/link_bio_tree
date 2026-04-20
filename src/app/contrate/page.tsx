"use client";

import { SharkCarousel, iShark } from "@/components/ui/shark-carousel";
import { SharkCard } from "@/components/ui/shark-card";
import { SharkTankBackground } from "@/components/ui/shark-tank-background";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Mock Data de Sharks (Elite Red Pro)
const sharks: iShark[] = [
    {
        id: "1",
        name: "Ana Silva",
        role: "Fullstack AI Engineer",
        skills: ["React", "Python", "LangChain", "Supabase"],
        description: "Especialista em construir aplicações completas de IA generativa. Já entregou mais de 10 projetos complexos usando o Método S.H.A.R.K. Focada em performance e escalabilidade.",
        profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
        available: true,
        tags: ["vendas", "produto"],
        lastProject: {
            title: "Plataforma SaaS de Vendas",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=500&auto=format&fit=crop"
        }
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
        lastProject: {
            title: "Bot de Atendimento 24/7",
            image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=500&auto=format&fit=crop"
        }
    },
    {
        id: "3",
        name: "Lucas Oliveira",
        role: "Frontend Creative",
        skills: ["Three.js", "Tailwind", "Framer Motion", "Next.js"],
        description: "Traz o fator UAU para qualquer interface. Especialista em animações, micro-interações e design systems que convertem. Um artista do código.",
        profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
        available: false,
        tags: ["vendas", "produto"],
        lastProject: {
            title: "Landing Page Imersiva 3D",
            image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop"
        }
    },
    {
        id: "4",
        name: "Mariana Santos",
        role: "Prompt Engineer",
        skills: ["GPT-4", "Claude", "Fine-tuning", "RAG"],
        description: "Fala a língua dos modelos como ninguém. Cria personas, refina outputs e garante que a IA entregue exatamente o que o negócio precisa. A domadora de LLMs.",
        profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
        available: true,
        tags: ["automatizar", "custos"],
        lastProject: {
            title: "Auditoria de Conteúdo AI",
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=500&auto=format&fit=crop"
        }
    },
    {
        id: "5",
        name: "Carlos Dev",
        role: "Backend Architect",
        skills: ["PostgreSQL", "Node.js", "Redis", "Docker"],
        description: "Constrói a fundação que aguenta o tranco. Segurança, velocidade e arquitetura robusta para sistemas que não podem cair. O guardião do servidor.",
        profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
        available: true,
        tags: ["custos", "produto"],
        lastProject: {
            title: "Otimização de Cloud AWS",
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=500&auto=format&fit=crop"
        }
    },
    {
        id: "6",
        name: "Julia Tech",
        role: "AI Product Manager",
        skills: ["Scrum", "Product Discovery", "Jira", "Growth"],
        description: "Traduz necessidades de negócio em requisitos técnicos. Garante que o produto resolva dores reais e chegue ao mercado rápido. Visão estratégica.",
        profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
        available: true,
        tags: ["produto", "vendas"],
        lastProject: {
            title: "Lançamento de App Global",
            image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=500&auto=format&fit=crop"
        }
    },
];

const FILTERS = [
    { id: "all", label: "Mostrar Todos" },
    { id: "vendas", label: "Quero Vender Mais" },
    { id: "automatizar", label: "Quero Automatizar" },
    { id: "custos", label: "Reduzir Custos" },
];

export default function ContratePage() {
    const [activeFilter, setActiveFilter] = useState("all");

    // Filtragem Lógica
    const filteredSharks = activeFilter === "all"
        ? sharks
        : sharks.filter(shark => shark.tags.includes(activeFilter));

    // Preparar cards para o carrossel
    const items = filteredSharks.map((shark, index) => (
        <SharkCard
            key={shark.id}
            shark={shark}
            index={index}
        />
    ));

    return (
        <main className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
            {/* Background Imersivo (Dynamic Shark Tank) */}
            <SharkTankBackground />

            {/* Navbar Flutuante */}
            <div className="absolute top-6 left-6 z-50">
                <a href="/" className="text-white/60 hover:text-white flex items-center gap-2 transition-colors bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:border-blue-500/50 group">
                    <span className="group-hover:-translate-x-1 transition-transform">←</span> Voltar para Superfície
                </a>
            </div>

            {/* Conteúdo Principal */}
            <div className="relative z-20 container mx-auto px-4 py-16 min-h-screen flex flex-col justify-center">

                {/* Header */}
                <div className="text-center mb-12">
                    <span className="inline-block py-1.5 px-4 rounded-full bg-blue-950/40 border border-blue-500/30 text-blue-300 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-6 backdrop-blur-xl shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                        RedPro Certified Elite
                    </span>

                    <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-[0.9]">
                        <span className="block text-2xl md:text-3xl font-light tracking-[0.5em] mb-2 font-mono uppercase">
                            <span className="text-red-600 font-bold">Red</span>
                            <span className="text-white">Pro</span>
                            <span className="text-white font-normal">'s</span>
                        </span>
                        SHARK <span className="text-transparent bg-clip-text bg-gradient-to-br from-red-500 to-red-800 italic pr-2">TANK</span>
                    </h1>

                    <p className="text-lg md:text-xl text-blue-100/60 max-w-2xl mx-auto font-light leading-relaxed">
                        Mergulhe no ecossistema da elite da <span className="text-blue-200 font-medium">RedPro AI Academy</span>.
                        Escolha um talento certificado pelo <span className="text-white font-medium border-b border-blue-500/50 pb-0.5">Método S.H.A.R.K.</span> para escalar seu projeto.
                    </p>
                </div>

                {/* Intelligent Filters */}
                <div className="flex flex-wrap gap-3 mb-10 max-w-4xl mx-auto items-center justify-center">
                    {FILTERS.map((filter) => (
                        <button
                            key={filter.id}
                            onClick={() => setActiveFilter(filter.id)}
                            className={cn(
                                "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border backdrop-blur-md whitespace-nowrap",
                                activeFilter === filter.id
                                    ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-105"
                                    : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:border-white/20 hover:text-white"
                            )}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                {/* O Tanque (Carrossel) */}
                <div className="w-full relative min-h-[500px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeFilter}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full"
                        >
                            {filteredSharks.length > 0 ? (
                                <SharkCarousel items={items} />
                            ) : (
                                <div className="text-center py-20 text-white/30">
                                    <p>Nenhum Shark encontrado nessa área de atuação.</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer Discreto */}
                <div className="text-center mt-12 opacity-30 text-xs font-mono">
                    <p>METODOLOGIA EXCLUSIVA REDPRO • © 2024</p>
                </div>
            </div>
        </main>
    );
}
