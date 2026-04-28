"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

export default function MentoriaObrigadoPage() {
    useEffect(() => {
        (window as any).fbq?.('track', 'Purchase', { currency: 'BRL', value: 0 });
    }, []);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200;12..96,800;12..96,900&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;700&display=swap');
                body { font-family: 'DM Sans', sans-serif; }
            `}</style>

            <main className="min-h-screen bg-[#09090b] text-white relative overflow-x-hidden flex flex-col">

                <div className="fixed inset-0 pointer-events-none z-0">
                    <div style={{ background: "radial-gradient(ellipse 60% 35% at 50% -5%, rgba(249,115,22,0.14) 0%, transparent 60%)" }} className="absolute inset-0" />
                </div>

                <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55 }}
                        className="max-w-xl"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="w-16 h-16 rounded-full bg-orange-500/15 border border-orange-500/30 flex items-center justify-center mx-auto mb-8"
                        >
                            <svg className="w-7 h-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </motion.div>

                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
                            style={{ background: "rgba(249,115,22,0.15)", color: "#f97316", fontFamily: "'JetBrains Mono', monospace" }}>
                            Compra confirmada
                        </span>

                        <h1
                            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.03em", fontSize: "clamp(36px, 5vw, 60px)" }}
                            className="text-white mb-6"
                        >
                            Sua vaga está<br />
                            <span style={{ color: "#f97316" }}>garantida.</span>
                        </h1>

                        <p className="text-[#a1a1aa] text-base leading-relaxed mb-4" style={{ fontWeight: 300 }}>
                            Red vai entrar em contato em breve para agendar os encontros e alinhar o diagnóstico do seu negócio.
                        </p>
                        <p className="text-[#71717a] text-sm mb-10">
                            Enquanto isso, preencha a ficha de onboarding — leva menos de 5 minutos e ajuda Red a preparar a sessão especificamente para você.
                        </p>

                        {/* CTA principal */}
                        <motion.a
                            href="/mentoria/ficha"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-block px-10 py-4 bg-orange-500 hover:bg-orange-400 text-black font-bold rounded-xl text-sm uppercase tracking-wide transition-colors mb-4"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                            Preencher ficha de onboarding
                        </motion.a>

                        <p className="text-xs text-[#52525b]">
                            Dúvidas? WhatsApp (61) 99297-8796
                        </p>
                    </motion.div>
                </div>
            </main>
        </>
    );
}
