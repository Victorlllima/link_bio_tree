"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ===== Types and Interfaces =====
export interface iShark {
    id: string;
    name: string;
    role: string;
    skills: string[];
    description: string;
    profileImage: string;
    available: boolean;
    tags: string[]; // Tags para filtro de dor (ex: "vendas", "automacao", "custos")
    lastProject: {
        title: string;
        image: string;
    };
}

interface iCarouselProps {
    items: React.ReactNode[]; // Mudando para ReactNode para flexibilidade
    initialScroll?: number;
}

// ===== Components =====
export function SharkCarousel({ items, initialScroll = 0 }: iCarouselProps) {
    const carouselRef = React.useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = React.useState(false);
    const [canScrollRight, setCanScrollRight] = React.useState(true);

    const checkScrollability = () => {
        if (carouselRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
        }
    };

    const handleScrollLeft = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
        }
    };

    const handleScrollRight = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
    };

    // Função auxiliar para scrollar até um card específico (pode ser passada para os filhos se necessário, mas simplificando aqui)
    const scrollToCard = (index: number) => {
        if (carouselRef.current) {
            const cardWidth = isMobile() ? 230 : 384;
            const gap = isMobile() ? 4 : 8;
            const scrollPosition = (cardWidth + gap) * (index);
            carouselRef.current.scrollTo({
                left: scrollPosition,
                behavior: "smooth",
            });
        }
    };

    const isMobile = () => {
        if (typeof window === "undefined") return false;
        return window.innerWidth < 768;
    };

    useEffect(() => {
        if (carouselRef.current) {
            carouselRef.current.scrollLeft = initialScroll;
            checkScrollability();
        }
    }, [initialScroll]);

    return (
        <div className="relative w-full z-10">
            <div
                className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth [scrollbar-width:none] py-10 px-4 md:px-0"
                ref={carouselRef}
                onScroll={checkScrollability}
            >
                <div
                    className={cn(
                        "flex flex-row gap-6 md:gap-8 min-w-max mx-auto md:pl-8 lg:pl-12 pb-10",
                    )}
                >
                    {items.map((item, index) => (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                                transition: {
                                    duration: 0.5,
                                    delay: 0.1 * index,
                                    ease: "easeOut",
                                },
                            }}
                            key={`card-wrapper-${index}`}
                            className="last:pr-12 md:last:pr-32"
                        >
                            {/* Clonamos o elemento para injetar props de controle se necessário, ou apenas renderizamos */}
                            {React.isValidElement(item)
                                ? React.cloneElement(item as React.ReactElement<any>, {
                                    onCardClose: () => scrollToCard(index)
                                })
                                : item}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-center md:justify-end gap-4 mt-4 md:pr-12">
                <button
                    className="relative z-40 h-12 w-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 hover:border-blue-500/50 transition-all duration-300 group"
                    onClick={handleScrollLeft}
                    disabled={!canScrollLeft}
                >
                    <ArrowLeft className="h-5 w-5 text-neutral-300 group-hover:text-blue-400" />
                </button>
                <button
                    className="relative z-40 h-12 w-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 hover:border-blue-500/50 transition-all duration-300 group"
                    onClick={handleScrollRight}
                    disabled={!canScrollRight}
                >
                    <ArrowRight className="h-5 w-5 text-neutral-300 group-hover:text-blue-400" />
                </button>
            </div>
        </div>
    );
};


