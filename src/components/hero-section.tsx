"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { SplineScene } from "@/components/ui/spline";
import { ParticleTextEffect } from "@/components/ui/particle-text-effect";
import { EtherealShadow } from "@/components/ui/ethereal-shadow";
import { GlowingShadow } from "@/components/ui/glowing-shadow";
import { HeroFuturisticText } from "@/components/ui/hero-futuristic-text";
import { cardsData, CardData } from "./cards-section";

export function HeroSection() {
    const [selectedCard, setSelectedCard] = useState<CardData | null>(null);

    return (
        <section className="relative w-full min-h-screen bg-black overflow-x-hidden">

            {/* Background Spline - Fixed to cover screen for continuous interaction */}
            <div className="fixed inset-0 z-0 pointer-events-auto lg:translate-x-[35%]">
                {/* Robot positioned more to the right */}
                <SplineScene
                    scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                    className="w-full h-full"
                />
            </div>

            {/* Background Ethereal Shadow */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <EtherealShadow
                    color="rgba(229, 9, 20, 0.4)"
                    animation={{ scale: 80, speed: 40 }}
                    noise={{ opacity: 0.2, scale: 1 }}
                    sizing="fill"
                    className="w-full h-full"
                />
            </div>

            {/* Title Fade Overlay - Makes cards transition to transparent behind the title */}
            <div className="fixed top-0 left-0 w-full h-[350px] bg-gradient-to-b from-black via-black/80 to-transparent z-[50] pointer-events-none" />

            {/* 1. Header Title - Fixed Top - High Z-Index to stay above the fade overlay */}
            <header className="fixed top-0 left-0 w-full flex justify-center pt-20 pb-12 pointer-events-auto z-[70] text-center bg-transparent">
                <HeroFuturisticText
                    title="RedPro AI Academy"
                    subtitle="Você imagina, a IA constrói."
                    className="drop-shadow-2xl"
                />
            </header>

            {/* Main Content Container - Allows page scrolling */}
            <div className="relative z-10 container mx-auto px-4 min-h-screen flex flex-col pointer-events-none">

                {/* Grid Layout: 3 Columns (Text, Cards, Robot) */}
                {/* Added more top margin (mt-[400px]) to start the scrollable content below the fixed header */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-[400px] mb-20 pointer-events-none items-start">

                    {/* Left Column (Col 1-3) - Text Content - FIXED (NEVER SCROLLS) - Closer to cards and higher */}
                    <div className="lg:col-span-3 relative pointer-events-auto h-full">
                        <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:fixed lg:left-[8%] lg:top-[360px] lg:w-[25%] lg:max-w-md">                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-8 drop-shadow-2xl">
                            <span className="block text-white">Este é o seu</span>
                            <span className="block text-white">catálogo.</span>
                            <span className="block text-neutral-500 mt-2">Não de opções.</span>
                            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-red-400 to-orange-500 mt-2">
                                De decisões.
                            </span>
                        </h2>

                            <p className="text-neutral-300 text-lg md:text-xl max-w-lg mb-10 leading-relaxed drop-shadow-md">
                                Projetos prontos para faturar. Desenvolvedores certificados para contratar.
                                O curso que está revolucionando o mercado.
                            </p>


                        </div>
                    </div>

                    {/* Center Column (Col 4-9) - Cards List - Scrolls with page - REDUCED 30% - Centered with subtitle */}
                    <div className="lg:col-span-6 lg:col-start-4 flex flex-col gap-6 pointer-events-auto mt-20 lg:mt-0 scale-[0.7] origin-top">
                        {cardsData.map((card, index) => (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true, margin: "-100px" }}
                                whileHover={{ scale: 1.05, zIndex: 30 }}
                                className="group relative cursor-pointer w-full"
                            >
                                <GlowingShadow borderRadius="0.75rem" onClick={() => setSelectedCard(card)}>
                                    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-neutral-900 border border-white/5 shadow-xl transition-all duration-300">
                                        {/* Badge */}
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
                                                <h3 className="text-3xl font-bold text-white mb-0 uppercase tracking-wide leading-tight">
                                                    {card.title}
                                                </h3>

                                                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-out opacity-0 group-hover:opacity-100">
                                                    <div className="overflow-hidden">
                                                        <p className="text-2xl text-neutral-400 mt-2 border-t border-white/10 pt-2 transition-all">
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

                    {/* Right Column (Col 10-12) - Spacer for Robot */}
                    <div className="hidden lg:block lg:col-span-3 pointer-events-none">
                        {/* The robot is in the fixed background, visible here */}
                    </div>
                </div>


            </div>

            {/* Modal */}
            <AnimatePresence>
                {selectedCard && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md pointer-events-auto"
                        onClick={() => setSelectedCard(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-neutral-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedCard(null)}
                                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                            >
                                ✕
                            </button>
                            <div className="relative aspect-video">
                                <Image
                                    src={selectedCard.image}
                                    alt={selectedCard.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent"></div>
                            </div>
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
                                        target={selectedCard.url.startsWith("http") ? "_blank" : "_self"}
                                        rel="noopener noreferrer"
                                        className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${selectedCard.color} text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform`}
                                    >
                                        Acessar
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </a>
                                ) : (
                                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-800 text-neutral-500 font-semibold rounded-lg shadow-lg cursor-not-allowed opacity-50">
                                        Em breve
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
