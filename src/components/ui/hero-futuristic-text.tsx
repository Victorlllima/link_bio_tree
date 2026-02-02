"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface HeroFuturisticTextProps {
    title?: string;
    subtitle?: string;
    className?: string;
}

export function HeroFuturisticText({
    title = "RedPro AI Academy",
    subtitle = "Você imagina, a IA constrói.",
    className,
}: HeroFuturisticTextProps) {
    const titleWords = title.split(" ");
    const [visibleWords, setVisibleWords] = useState(0);
    const [subtitleVisible, setSubtitleVisible] = useState(false);
    const [delays, setDelays] = useState<number[]>([]);
    const [subtitleDelay, setSubtitleDelay] = useState(0);

    useEffect(() => {
        // Generate random delays for glitch effect on client side
        setDelays(titleWords.map(() => Math.random() * 0.07));
        setSubtitleDelay(Math.random() * 0.1);
    }, [title]);

    useEffect(() => {
        // Reset state when title changes
        setVisibleWords(0);
        setSubtitleVisible(false);
    }, [title]);

    useEffect(() => {
        if (visibleWords < titleWords.length) {
            const timeout = setTimeout(() => setVisibleWords((prev) => prev + 1), 600);
            return () => clearTimeout(timeout);
        } else {
            const timeout = setTimeout(() => setSubtitleVisible(true), 800);
            return () => clearTimeout(timeout);
        }
    }, [visibleWords, titleWords.length]);

    return (
        <div className={cn("flex flex-col items-center justify-center text-center uppercase", className)}>
            <div className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter">
                <div className="flex flex-wrapjustify-center gap-x-3 lg:gap-x-6 overflow-hidden text-white drop-shadow-2xl">
                    {titleWords.map((word, index) => (
                        <div
                            key={`${word}-${index}`}
                            className={index < visibleWords ? "fade-in" : ""}
                            style={{
                                animationDelay: `${index * 0.13 + (delays[index] || 0)}s`,
                                opacity: index < visibleWords ? undefined : 0,
                            }}
                        >
                            {word}
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-lg md:text-2xl xl:text-3xl mt-4 overflow-hidden font-bold">
                <div
                    className={cn(subtitleVisible ? "fade-in-subtitle" : "", "text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500")}
                    style={{
                        animationDelay: `${titleWords.length * 0.13 + 0.2 + subtitleDelay}s`,
                        opacity: subtitleVisible ? undefined : 0,
                    }}
                >
                    {subtitle}
                </div>
            </div>
        </div>
    );
}
