"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { GlowingShadow } from "@/components/ui/glowing-shadow";

export interface CardData {
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
    active?: boolean; // Optional property to enable the button
}


export const cardsData: CardData[] = [
    {
        id: "metodo",
        title: "Método S.H.A.R.K. de VibeCoding",
        subtitle: "Aprenda a desenvolver Apps e soluções com IA",
        description: "O curso que está revolucionando o mercado. Aprenda a criar aplicações completas usando Inteligência Artificial, mesmo sem saber programar.",
        image: "/images/shark-team-robots2.png",
        badge: "",
        icon: "⏳",
        url: "https://vibecoding.redpro.com.br",
        color: "from-purple-500 to-pink-500",
        active: true
    },
    {
        id: "mentoria",
        title: "Mentoria RedPro",
        subtitle: "Aceleração individual para sua transformação digital",
        description: "Mentoria personalizada para implementar IA e automação no seu negócio. Sessões individuais focadas nos seus desafios específicos e resultados práticos.",
        image: "/images/mentoria-redpro.jpg",
        badge: "EM BREVE",
        icon: "⏳",
        url: "#",
        color: "from-yellow-500 to-amber-500"
    },
    {
        id: "incompany",
        title: (
            <>
                REDPRO <em className="italic">IN COMPANY</em>
            </>
        ) as any,
        subtitle: "Evolua seu time com o poder da IA",
        description: "Capacitação técnica e estratégica para empresas que buscam liderar a nova era digital.",
        image: "/images/redpro-in-company.jpg",
        badge: "EM BREVE",
        icon: "⏳",
        url: "#",
        color: "from-indigo-500 to-purple-500"
    },
    {
        id: "eventos",
        title: "Eventos e Palestras",
        subtitle: "O futuro em cena",
        description: "Conectando tecnologia e pessoas através de experiências imersivas.",
        image: "/images/eventos-palestras.jpg",
        badge: "EM BREVE",
        icon: "⏳",
        url: "#",
        color: "from-orange-500 to-red-500"
    },
    {
        id: "redflix",
        title: "RedFlix",
        subtitle: "Vitrine de soluções criadas por nossos alunos",
        description: "Explore aplicações e automações desenvolvidas pelos alunos do Método SHARK. Contrate soluções prontas ou customize para o seu negócio.",
        image: "/images/redflix.jpg",
        badge: "EM BREVE",
        icon: "⏳",
        url: "https://redflix.redpro.com.br",
        color: "from-red-500 to-orange-500"
    },
    {
        id: "contrate",
        title: "Contrate um SHARK",
        subtitle: "Vibecoders certificados prontos para o seu projeto",
        description: "Contrate vibecoders certificados pelo Método S.H.A.R.K. Profissionais treinados e prontos para criar soluções com IA para o seu negócio.",
        image: "/images/contrate-shark.jpg",
        badge: "EM BREVE",
        icon: "⏳",
        url: "https://contrateumshark.redpro.com.br",
        color: "from-blue-500 to-cyan-500",
        objectPosition: "center 20%"
    },
    {
        id: "newsletter",
        title: "Newsletter",
        subtitle: "Insights semanais direto na sua caixa de entrada",
        description: "Receba conteúdos exclusivos, tendências de IA, cases de sucesso e dicas práticas. O essencial do mundo da IA e automação, sem enrolação.",
        image: "/images/card-news.webp",
        badge: "EM BREVE",
        icon: "⏳",
        url: "https://news.redpro.com.br",
        color: "from-green-500 to-emerald-500"
    },
    {
        id: "contato",
        title: "Fale com o RedPro",
        subtitle: "Vamos conversar sobre o seu projeto",
        description: "Agende uma conversa direta para tirar dúvidas, entender qual solução se encaixa melhor no seu negócio e descobrir como a IA pode transformar seus resultados.",
        image: "/images/fale-com-redpro.jpg",
        badge: "EM BREVE",
        icon: "⏳",
        url: "#",
        color: "from-cyan-500 to-blue-500"
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

                    {/* Cards Container - Maximized size, side-by-side, no scroll */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 pt-10 pb-12 pl-4 md:pl-32 pr-8 gap-6 w-full">
                        {cardsData.map((card, index) => (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.05, zIndex: 10 }}
                                className="group relative cursor-pointer w-full"
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
                                {selectedCard.active ? (
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
                                ) : (
                                    <div
                                        className={`inline-flex items-center gap-2 px-6 py-3 bg-neutral-800 text-neutral-500 font-semibold rounded-lg shadow-lg cursor-not-allowed opacity-50`}
                                    >
                                        Acessar
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
