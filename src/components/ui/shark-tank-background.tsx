"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const SharkTankBackground = () => {
    const [bubbles, setBubbles] = useState<{ id: number; size: number; left: number; duration: number; delay: number }[]>([]);

    useEffect(() => {
        // Gerar 60 bolhas aleatórias para garantir densidade
        const newBubbles = Array.from({ length: 60 }).map((_, i) => ({
            id: i,
            size: Math.random() * 4 + 2, // 2px a 6px
            left: Math.random() * 100, // 0% a 100% da largura
            duration: Math.random() * 10 + 10, // 10s a 20s (movimento lento e realista)
            delay: Math.random() * 20, // Distribuição inicial
        }));
        setBubbles(newBubbles);
    }, []);

    return (
        <div className="fixed inset-0 z-0 overflow-hidden bg-[#00101f]">
            {/* 1. Deep Ocean Gradient Base */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#00040a] via-[#001e3c] to-[#000510]" />

            {/* 2. Light Rays (Caustics Simulation) 
                Simula a luz do sol entrando na água usando gradientes rotativos e desfoque
            */}
            <motion.div
                className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] opacity-20 mix-blend-overlay pointer-events-none"
                animate={{ rotate: 360 }}
                transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            >
                <div className="w-full h-full bg-[conic-gradient(from_0deg_at_50%_50%,rgba(56,189,248,0)_0deg,rgba(56,189,248,0.2)_40deg,rgba(56,189,248,0)_80deg,rgba(56,189,248,0.2)_120deg,rgba(56,189,248,0)_160deg,rgba(56,189,248,0.2)_200deg,rgba(56,189,248,0)_240deg,rgba(56,189,248,0.2)_280deg,rgba(56,189,248,0)_360deg)] blur-[60px]" />
            </motion.div>

            <motion.div
                className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] opacity-15 mix-blend-color-dodge pointer-events-none"
                animate={{ rotate: -360 }}
                transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
            >
                <div className="w-full h-full bg-[conic-gradient(from_90deg_at_50%_50%,rgba(255,255,255,0)_0deg,rgba(255,255,255,0.1)_60deg,rgba(255,255,255,0)_120deg,rgba(255,255,255,0.1)_180deg,rgba(255,255,255,0)_240deg,rgba(255,255,255,0.1)_300deg,rgba(255,255,255,0)_360deg)] blur-[80px]" />
            </motion.div>


            {/* 3. Rising Bubbles with Physics 
                - Movimento vertical
                - Oscilação lateral (senoide simulada)
                - Expansão (Lei de Boyle: bolha cresce ao subir)
            */}
            {bubbles.map((bubble) => (
                <motion.div
                    key={bubble.id}
                    className="absolute rounded-full bg-blue-100/20 backdrop-blur-[1px] shadow-[inset_0_0_2px_rgba(255,255,255,0.4)] border border-white/10"
                    style={{
                        width: bubble.size,
                        height: bubble.size,
                        left: `${bubble.left}%`,
                        bottom: -50, // Começa fora da tela
                    }}
                    animate={{
                        y: ["0vh", "-120vh"], // Sobe até sair do topo
                        x: [0, Math.sin(bubble.id) * 30, 0, Math.cos(bubble.id) * -30, 0], // Oscilação orgânica
                        opacity: [0, 0.6, 0.4, 0], // Fade in/out
                        scale: [1, 1.5], // Leve expansão ao subir
                    }}
                    transition={{
                        y: {
                            duration: bubble.duration,
                            repeat: Infinity,
                            delay: bubble.delay,
                            ease: "linear",
                        },
                        x: {
                            duration: bubble.duration * 0.8, // Dessincronizado do Y para não parecer mecânico
                            repeat: Infinity,
                            delay: bubble.delay,
                            ease: "easeInOut",
                            repeatType: "mirror"
                        },
                        scale: {
                            duration: bubble.duration,
                            repeat: Infinity,
                            delay: bubble.delay,
                            ease: "linear"
                        },
                        opacity: {
                            duration: bubble.duration,
                            repeat: Infinity,
                            delay: bubble.delay,
                            times: [0, 0.1, 0.8, 1], // Fica visível a maior parte do tempo
                            ease: "linear"
                        }
                    }}
                />
            ))}

            {/* 4. Vignette & Atmosphere (Vibe Sombria RedPro) */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] z-10 pointer-events-none" />

            {/* 5. Micro-suspension (Poeira marinha) */}
            <div className="absolute inset-0 opacity-[0.15] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none" />
        </div>
    );
};
