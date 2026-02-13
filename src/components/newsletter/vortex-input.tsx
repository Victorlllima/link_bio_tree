"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function VortexForm() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "sucking" | "subscribed">("idle");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sucking");

        // Simular tempo de animação e envio
        setTimeout(() => {
            setStatus("subscribed");
            setEmail("");
        }, 2000);
    };

    return (
        <div className="relative w-full max-w-md mx-auto h-[300px] flex items-center justify-center">
            <AnimatePresence>
                {status === "idle" && (
                    <motion.form
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0, rotate: 720, transition: { duration: 1 } }}
                        onSubmit={handleSubmit}
                        className="w-full relative z-20"
                    >
                        <div className="flex flex-col gap-4">
                            <input
                                type="email"
                                placeholder="digite.seu@melhor.email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black border border-green-500/50 rounded-full py-4 px-6 text-center text-green-400 placeholder-green-800 focus:outline-none focus:shadow-[0_0_30px_rgba(34,197,94,0.3)] text-xl font-mono transition-shadow"
                                required
                            />
                            <button
                                type="submit"
                                className="text-neutral-500 hover:text-white text-sm uppercase tracking-widest transition-colors"
                            >
                                [ Inicializar Download de Conhecimento ]
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* Vortex Implementation Visual */}
            {status === "sucking" && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [1, 5, 0], opacity: [0, 1, 0], rotate: 360 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-800 blur-xl"
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-green-500 font-mono text-xs animate-pulse">
                        PROCESSANDO...
                    </div>
                </div>
            )}

            {status === "subscribed" && (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                >
                    <h3 className="text-2xl font-bold text-white mb-2">Protocolo Aceito.</h3>
                    <p className="text-green-500 font-mono">Bem-vindo à singularidade.</p>
                    <button
                        onClick={() => setStatus("idle")}
                        className="mt-6 text-neutral-600 text-xs hover:text-white underline"
                    >
                        Cadastrar outro agente
                    </button>
                </motion.div>
            )}
        </div>
    );
}
