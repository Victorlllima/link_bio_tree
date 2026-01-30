"use client";

import { SplineScene } from "@/components/ui/spline";
import { Card } from "@/components/ui/card";
import { ParticleTextEffect } from "@/components/ui/particle-text-effect";
import { EtherealShadow } from "@/components/ui/ethereal-shadow";

export function HeroSection() {
    return (
        <section className="relative w-full min-h-screen overflow-hidden bg-black">
            {/* Background Ethereal Shadow */}
            <div className="absolute inset-0 z-0">
                <EtherealShadow
                    color="rgba(229, 9, 20, 0.4)"
                    animation={{ scale: 80, speed: 40 }}
                    noise={{ opacity: 0.2, scale: 1 }}
                    sizing="fill"
                    className="w-full h-full"
                />
            </div>

            {/* Main Hero Content */}
            <div className="relative z-10 w-full min-h-screen flex flex-col">

                {/* Particle Text Effect at the top */}
                <div className="w-full pt-4 md:pt-8 lg:pt-12 z-20">
                    <ParticleTextEffect words={["RedPro", "AI Academy", "RedPro AI Academy"]} />
                </div>

                <Card className="w-full flex-1 bg-transparent border-0 relative overflow-hidden mt-[-20px] md:mt-[-40px]">
                    {/* Removed Spotlight as requested */}

                    <div className="flex flex-col lg:flex-row h-full">
                        {/* Left content - Text */}
                        <div className="flex-1 p-8 lg:p-16 relative z-10 flex flex-col justify-center items-center lg:items-start text-center lg:text-left mt-4 lg:-mt-16">

                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-full mb-8">
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                <span className="text-red-400 text-sm font-medium tracking-wide">RedPro AI Academy</span>
                            </div>

                            {/* Main Title */}
                            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-8">
                                <span className="block text-white">Este é o seu catálogo.</span>
                                <span className="block text-neutral-500 mt-2">Não de opções.</span>
                                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-red-400 to-orange-500 mt-2">
                                    De decisões.
                                </span>
                            </h1>

                            <p className="text-neutral-400 text-lg md:text-xl max-w-lg mb-10 leading-relaxed">
                                Projetos prontos para faturar. Desenvolvedores certificados para contratar.
                                O curso que está revolucionando o mercado.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a
                                    href="#destaques"
                                    className="group px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-lg shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                                >
                                    Explorar
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                                <a
                                    href="https://vibecoding.redpro.com.br"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-4 border border-white/20 text-white font-semibold rounded-lg hover:border-red-500/50 hover:bg-red-500/10 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    Conhecer o Curso
                                </a>
                            </div>
                        </div>

                        {/* Right content - 3D Robot */}
                        <div className="flex-1 relative min-h-[400px] lg:min-h-0">
                            <SplineScene
                                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                                className="w-full h-full"
                            />

                            {/* Glow effect behind the robot */}
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/20 rounded-full blur-[120px]"></div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2">
                    <div className="w-1 h-3 bg-white/50 rounded-full animate-pulse"></div>
                </div>
            </div>
        </section>
    );
}
