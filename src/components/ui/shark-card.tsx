"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Quote, X, Users, BadgeCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { iShark } from "./shark-carousel";

// Use useOutsideClick from a hook file or define here for isolation
const useOutsideClick = (
    ref: React.RefObject<HTMLDivElement | null>,
    onOutsideClick: () => void
) => {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }
            onOutsideClick();
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [ref, onOutsideClick]);
};


export function SharkCard({
    shark,
    index,
    layout = false,
    onCardClose = () => { },
}: {
    shark: iShark;
    index: number;
    layout?: boolean;
    onCardClose?: () => void;
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleExpand = () => setIsExpanded(true);
    const handleCollapse = () => {
        setIsExpanded(false);
        onCardClose();
    };

    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                handleCollapse();
            }
        };

        if (isExpanded) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        window.addEventListener("keydown", handleEscapeKey);
        return () => window.removeEventListener("keydown", handleEscapeKey);
    }, [isExpanded]);

    useOutsideClick(containerRef, handleCollapse);

    // Background for the expanded modal (Underwater effect)
    const modalBgImage = "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop";

    // Card background (Shark specific or generic tech)
    const cardBgImage = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop";

    return (
        <>
            <AnimatePresence>
                {isExpanded && (
                    <div className="fixed inset-0 h-screen w-full z-[100] flex items-center justify-center p-4 md:p-10">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[90]"
                            onClick={handleCollapse}
                        />

                        {/* Expanded Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            ref={containerRef}
                            layoutId={layout ? `card-${shark.id}` : undefined}
                            className="w-full max-w-4xl h-[90vh] md:h-auto max-h-[90vh] bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden relative z-[100] flex flex-col md:flex-row shadow-[0_0_50px_rgba(59,130,246,0.3)]"
                        >
                            {/* Close Button */}
                            <button
                                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                                onClick={handleCollapse}
                            >
                                <X className="h-6 w-6" />
                            </button>

                            {/* Left Column: Image & Basic Info */}
                            <div className="w-full md:w-2/5 relative h-64 md:h-auto group">
                                <Image
                                    src={modalBgImage}
                                    alt="Background"
                                    fill
                                    className="object-cover opacity-60 mix-blend-overlay"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent md:bg-gradient-to-r" />

                                <div className="absolute bottom-0 left-0 p-6 w-full">
                                    <motion.div
                                        layoutId={layout ? `image-${shark.id}` : undefined}
                                        className="w-24 h-24 rounded-full border-4 border-blue-500/30 overflow-hidden mb-4 shadow-lg shadow-blue-500/20"
                                    >
                                        <Image
                                            src={shark.profileImage}
                                            alt={shark.name}
                                            width={96}
                                            height={96}
                                            className="object-cover w-full h-full"
                                        />
                                    </motion.div>

                                    <motion.h2
                                        layoutId={layout ? `title-${shark.id}` : undefined}
                                        className="text-3xl font-bold text-white mb-1 tracking-tight"
                                    >
                                        {shark.name}
                                    </motion.h2>

                                    <motion.p
                                        layoutId={layout ? `role-${shark.id}` : undefined}
                                        className="text-blue-400 font-medium text-lg flex items-center gap-2"
                                    >
                                        <BadgeCheck className="w-5 h-5" />
                                        {shark.role}
                                    </motion.p>
                                </div>
                            </div>

                            {/* Right Column: Details */}
                            <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-neutral-900/50 backdrop-blur-sm">
                                <div className="space-y-8">
                                    {/* Status */}
                                    <div className="flex items-center gap-3">
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
                                            shark.available
                                                ? "bg-green-500/10 border-green-500/30 text-green-400"
                                                : "bg-red-500/10 border-red-500/30 text-red-400"
                                        )}>
                                            {shark.available ? "Disponível para Projetos" : "Indisponível"}
                                        </span>
                                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-purple-500/10 border-purple-500/30 text-purple-400 flex items-center gap-1">
                                            <Zap className="w-3 h-3" /> Red Pro Certified
                                        </span>
                                    </div>

                                    {/* Last Project Showcase (Modal) */}
                                    {shark.lastProject && (
                                        <div className="w-full">
                                            <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-3">Destaque de Portfólio</h3>
                                            <div className="group/project relative aspect-[21/9] w-full overflow-hidden rounded-xl border border-white/10 bg-black/50">
                                                <Image
                                                    src={shark.lastProject.image}
                                                    alt={shark.lastProject.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover/project:scale-105 opacity-80 group-hover/project:opacity-100"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                                                <div className="absolute bottom-0 left-0 p-4 w-full flex justify-between items-end">
                                                    <div>
                                                        <p className="text-white font-bold text-lg leading-tight">{shark.lastProject.title}</p>
                                                        <p className="text-blue-400 text-xs font-mono mt-1">S.H.A.R.K. Methodology Applied</p>
                                                    </div>
                                                    <div className="bg-white/10 p-2 rounded-full backdrop-blur-md group-hover/project:bg-white/20 transition-colors">
                                                        <ArrowRight className="w-4 h-4 text-white" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Bio/Description */}
                                    <div>
                                        <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-3">Sobre o Shark</h3>
                                        <p className="text-lg text-neutral-300 leading-relaxed font-light">
                                            <Quote className="inline-block w-4 h-4 text-blue-500 mr-2 -mt-2 opacity-50" />
                                            {shark.description}
                                        </p>
                                    </div>

                                    {/* Skills Grid */}
                                    <div>
                                        <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-3">Arsenal Técnico</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {shark.skills.map((skill) => (
                                                <span
                                                    key={skill}
                                                    className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-neutral-300 text-sm hover:bg-white/10 hover:border-blue-500/30 hover:text-white transition-all cursor-default"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* CTA */}
                                    <div className="pt-6 border-t border-white/10">
                                        <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center justify-center gap-3 active:scale-[0.98]">
                                            Contratar {shark.name.split(' ')[0]}
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                        <p className="text-center text-white/30 text-xs mt-3">
                                            Garantia de entrega Red Pro • Pagamento seguro
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Card Carousel Item */}
            <motion.button
                layoutId={layout ? `card-${shark.id}` : undefined}
                onClick={handleExpand}
                className="group relative flex flex-col items-center justify-end w-[280px] md:w-[340px] h-[450px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                whileHover={{ y: -10 }}
            >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={cardBgImage}
                        alt="Card Background"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                    <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay group-hover:bg-blue-900/10 transition-colors" />
                </div>

                {/* Content */}
                <div className="relative z-10 w-full p-6 pb-8 flex flex-col items-center text-center">

                    {/* Avatar */}
                    <motion.div
                        layoutId={layout ? `image-${shark.id}` : undefined}
                        className="w-24 h-24 rounded-full border-2 border-white/20 overflow-hidden mb-6 shadow-xl relative group-hover:border-blue-500 transition-colors"
                    >
                        <Image
                            src={shark.profileImage}
                            alt={shark.name}
                            width={96}
                            height={96}
                            className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                    </motion.div>

                    {/* Texts */}
                    <motion.h3
                        layoutId={layout ? `title-${shark.id}` : undefined}
                        className="text-2xl font-bold text-white mb-2 drop-shadow-lg"
                    >
                        {shark.name}
                    </motion.h3>

                    <motion.p
                        layoutId={layout ? `role-${shark.id}` : undefined}
                        className="text-blue-400 font-medium text-sm mb-4 uppercase tracking-wider bg-blue-500/10 px-3 py-1 rounded border border-blue-500/20"
                    >
                        {shark.role}
                    </motion.p>

                    {/* Footer Info */}
                    <div className="flex items-center justify-center gap-4 text-white/50 text-xs font-mono mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" /> Red Pro
                        </span>
                        <span>•</span>
                        <span className="text-green-400">
                            {shark.available ? "Open to Work" : "Busy"}
                        </span>
                    </div>

                    {/* Last Project Showcase */}
                    {shark.lastProject && (
                        <div className="mt-6 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0 delay-75">
                            <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-2 flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                                    <Image
                                        src={shark.lastProject.image}
                                        alt={shark.lastProject.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="text-left overflow-hidden">
                                    <p className="text-[10px] text-white/40 uppercase tracking-wider">Último Projeto</p>
                                    <p className="text-xs font-medium text-white truncate">{shark.lastProject.title}</p>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Golden Badge (Top Right) */}
                <div className="absolute top-4 right-4 z-20">
                    <div className="relative group/badge">
                        <div className="absolute inset-0 bg-yellow-400 blur-md opacity-20 group-hover/badge:opacity-40 transition-opacity" />
                        <div className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 text-amber-950 text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-yellow-200/50">
                            <BadgeCheck className="w-3 h-3" />
                            RedPro Certified
                        </div>
                    </div>
                </div>



                {/* Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transform transition-transform duration-1000 z-20" />
            </motion.button >
        </>
    );
}
