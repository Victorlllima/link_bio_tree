"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface CardData {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    image: string;
    badge: string;
    badgeIcon: string;
    url: string;
    color: string;
}

const cardsData: CardData[] = [
    {
        id: "metodo",
        title: "Método S.H.A.R.K.",
        subtitle: "Desenvolva sites e apps com IA",
        description: "O curso que está revolucionando o mercado. Aprenda a criar aplicações completas usando Inteligência Artificial, mesmo sem saber programar.",
        image: "/images/card-metodo.webp",
        badge: "🚀 CURSO",
        badgeIcon: "🚀",
        url: "https://metodoshark.redpro.com.br",
        color: "from-purple-500 to-pink-500"
    },
    {
        id: "redflix",
        title: "REDFLIX",
        subtitle: "Projetos Prontos",
        description: "Projetos prontos criados por mim e meus alunos. Escolha o seu e comece a faturar. São templates, automações e sistemas completos testados e aprovados pelo mercado.",
        image: "/images/card-redflix.webp",
        badge: "🔥 POPULAR",
        badgeIcon: "🔥",
        url: "https://redflix.redpro.com.br",
        color: "from-red-500 to-orange-500"
    },
    {
        id: "contrate",
        title: "Contrate um SHARK",
        subtitle: "VibeCoders certificados pela Redpro AI Academy",
        description: "Precisa de um desenvolvedor de confiança? Aqui você encontra VibeCoders certificados pela Redpro AI Academy, prontos para executar seu projeto com qualidade.",
        image: "/images/card-contrate.webp",
        badge: "⭐ DESTAQUE",
        badgeIcon: "⭐",
        url: "https://contrateumshark.redpro.com.br",
        color: "from-blue-500 to-cyan-500"
    },
    {
        id: "newsletter",
        title: "Newsletter",
        subtitle: "Fique por dentro de todas as novidades em IA",
        description: "Fique por dentro de todas as novidades em IA. Novos projetos, atualizações de cursos e conteúdos exclusivos do ecossistema RedPro.",
        image: "/images/card-news.webp",
        badge: "📰 GRÁTIS",
        badgeIcon: "📰",
        url: "https://news.redpro.com.br",
        color: "from-green-500 to-emerald-500"
    }
];

export function CardsSection() {
    const [selectedCard, setSelectedCard] = useState<CardData | null>(null);

    return (
        <>
            <section id="destaques" className="relative py-20 px-4 bg-black">
                <div className="max-w-7xl mx-auto">
                    {/* Section Title */}
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-1 h-8 bg-red-500 rounded-full"></div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white">Destaques</h2>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {cardsData.map((card, index) => (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.05, zIndex: 10 }}
                                className="group relative cursor-pointer"
                                onClick={() => setSelectedCard(card)}
                            >
                                <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-900 border border-white/5 shadow-xl transition-all duration-300 group-hover:border-red-500/50 group-hover:shadow-red-500/20 group-hover:shadow-2xl">
                                    {/* Badge */}
                                    <div className="absolute top-3 right-3 z-10">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r ${card.color} text-white shadow-lg`}>
                                            {card.badge}
                                        </span>
                                    </div>

                                    {/* Image */}
                                    <Image
                                        src={card.image}
                                        alt={card.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80"></div>

                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h3 className="text-lg font-bold text-white mb-1">{card.title}</h3>
                                        <p className="text-sm text-neutral-400 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                            {card.subtitle}
                                        </p>
                                    </div>

                                    {/* Hover Glow Border */}
                                    <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-red-500/50 transition-colors duration-300 pointer-events-none"></div>
                                </div>
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
