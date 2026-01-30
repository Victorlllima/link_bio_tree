"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { GlowingShadow } from "@/components/ui/glowing-shadow";

interface CardData {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    image: string;
    badge: string;
    icon: string; // Changed from badgeIcon just to be cleaner
    url: string;
    color: string;
    objectPosition?: string; // Optional property for image positioning
}

const cardsData: CardData[] = [
    {
        id: "metodo",
        title: "Método S.H.A.R.K. de VibeCoding",
        subtitle: "Aprenda a desenvolver apps e soluções com IA",
        description: "O curso que está revolucionando o mercado. Aprenda a criar aplicações completas usando Inteligência Artificial, mesmo sem saber programar.",
        image: "/images/shark-team-robots2.png",
        badge: "EM BREVE",
        icon: "⏳",
        url: "https://vibecoding.redpro.com.br",
        color: "from-purple-500 to-pink-500"
    },
    {
        id: "mentoria",
        title: "Mentoria RedPro",
        subtitle: "Acelere sua carreira",
        description: "Programa de mentoria exclusiva para quem quer atingir o próximo nível na carreira de desenvolvimento e IA.",
        image: "/images/mentoria-head-pro.png",
        badge: "EM BREVE",
        icon: "⏳",
        url: "#",
        color: "from-yellow-500 to-amber-500"
    },
    {
        id: "redflix",
        title: "REDFLIX",
        subtitle: "Projetos desenvolvidos por alunos",
        description: "Projetos prontos criados por mim e meus alunos. Escolha o seu e comece a faturar. São templates, automações e sistemas completos testados e aprovados pelo mercado.",
        image: "/images/card-redflix.webp",
        badge: "EM BREVE",
        icon: "⏳",
        url: "https://redflix.redpro.com.br",
        color: "from-red-500 to-orange-500"
    },
    {
        id: "contrate",
        title: "Contrate um SHARK",
        subtitle: "VibeCoders certificados pela Redpro AI Academy",
        description: "Precisa de um desenvolvedor de confiança? Aqui você encontra VibeCoders certificados pela Redpro AI Academy, prontos para executar seu projeto com qualidade.",
        image: "/images/contrate.png",
        badge: "EM BREVE",
        icon: "⏳",
        url: "https://contrateumshark.redpro.com.br",
        color: "from-blue-500 to-cyan-500",
        objectPosition: "center 20%"
    },
    {
        id: "newsletter",
        title: "Newsletter",
        subtitle: "Fique por dentro de todas as novidades em IA",
        description: "Fique por dentro de todas as novidades em IA. Novos projetos, atualizações de cursos e conteúdos exclusivos do ecossistema RedPro.",
        image: "/images/card-news.webp",
        badge: "EM BREVE",
        icon: "⏳",
        url: "https://news.redpro.com.br",
        color: "from-green-500 to-emerald-500"
    }
];

export function CardsSection() {
    const [selectedCard, setSelectedCard] = useState<CardData | null>(null);

    return (
        <>
            <section id="destaques" className="relative py-20 bg-black overflow-hidden">
                {/* Removed max-w-7xl mx-auto to allow full width expansion to the right */}
                <div className="w-full">
                    {/* Section Title - Aligned with Hero content (approx. ml-4 md:ml-32 depending on Hero) */}
                    <div className="flex items-center gap-3 mb-8 pl-4 md:pl-32">
                        <div className="w-1 h-8 bg-red-500 rounded-full"></div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white">Destaques</h2>
                    </div>

                    {/* Cards Container (Horizontal Scroll - Side by Side - Expanded Left) */}
                    {/* Added pl-4 md:pl-32 to align start with title/Hero button */}
                    <div className="flex overflow-x-auto pt-10 pb-12 pl-4 md:pl-32 pr-4 gap-5 snap-x snap-mandatory scrollbar-hide w-full">
                        {cardsData.map((card, index) => (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.02, zIndex: 10 }}
                                className="group relative cursor-pointer min-w-[240px] w-[240px] md:min-w-[260px] md:w-[260px] snap-center flex-shrink-0"
                            // onClick is now handled by GlowingShadow or bubbling
                            >
                                <GlowingShadow borderRadius="0.75rem" onClick={() => setSelectedCard(card)}>
                                    <div className="relative w-full h-full aspect-video rounded-xl overflow-hidden bg-neutral-900 border border-white/5 shadow-xl transition-all duration-300">
                                        {/* Badge - Render ONLY IF badge string is not empty */}
                                        {card.badge && card.badge.trim() !== "" && (
                                            <div className="absolute top-3 right-3 z-10">
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r ${card.color} text-white shadow-lg`}>
                                                    {card.badge}
                                                </span>
                                            </div>
                                        )}

                                        {/* Image */}
                                        <Image
                                            src={card.image}
                                            alt={card.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            style={{ objectPosition: card.objectPosition || 'center' }}
                                        />

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80"></div>

                                        {/* Content Container */}
                                        <div className="absolute inset-0 p-6 flex flex-col justify-end z-20">
                                            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                                <h3 className="text-lg font-bold text-white mb-0 uppercase tracking-wide leading-tight">
                                                    {card.title}
                                                </h3>

                                                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-out opacity-0 group-hover:opacity-100">
                                                    <div className="overflow-hidden">
                                                        <p className="text-sm text-neutral-400 mt-2 border-t border-white/10 pt-2 transition-all">
                                                            {card.subtitle}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </GlowingShadow>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modal */}
            <AnimatePresence>
                {selectedCard && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                        onClick={() => setSelectedCard(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-neutral-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedCard(null)}
                                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                            >
                                ✕
                            </button>

                            {/* Modal Image */}
                            <div className="relative aspect-video">
                                <Image
                                    src={selectedCard.image}
                                    alt={selectedCard.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent"></div>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6">
                                <h3 className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${selectedCard.color} mb-2`}>
                                    {selectedCard.title}
                                </h3>
                                <p className="text-neutral-400 text-lg leading-relaxed mb-6">
                                    {selectedCard.description}
                                </p>
                                <a
                                    href={selectedCard.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${selectedCard.color} text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform`}
                                >
                                    Acessar
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
