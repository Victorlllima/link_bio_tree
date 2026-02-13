"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlowingShadow } from "@/components/ui/glowing-shadow";

type Step = "welcome" | "area" | "level" | "challenge" | "capture" | "finish";

export function QualificationFlow() {
    const [step, setStep] = useState<Step>("welcome");
    const [formData, setFormData] = useState({
        area: "",
        level: "",
        challenge: "",
        name: "",
        email: "",
        whatsapp: ""
    });

    const nextStep = (target: Step) => setStep(target);

    // Variantes de animação
    const variants = {
        enter: { x: 100, opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: -100, opacity: 0 }
    };

    return (
        <div className="w-full max-w-2xl mx-auto min-h-[500px] flex flex-col justify-center">
            <AnimatePresence mode="wait">

                {/* STEP 1: WELCOME */}
                {step === "welcome" && (
                    <motion.div
                        key="welcome"
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.4 }}
                        className="text-center"
                    >
                        <h2 className="text-4xl font-bold text-white mb-6">Mentoria <span className="text-red-500">RedPro</span></h2>
                        <p className="text-xl text-neutral-300 mb-8 leading-relaxed">
                            Não é apenas sobre código. É sobre estratégia, carreira e visão de mercado.
                            Vamos entender seu momento para desenhar o plano perfeito.
                        </p>
                        <div className="inline-block">
                            <GlowingShadow borderRadius="9999px">
                                <button
                                    onClick={() => nextStep("area")}
                                    className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-colors text-lg"
                                >
                                    Iniciar Qualificação
                                </button>
                            </GlowingShadow>
                        </div>
                    </motion.div>
                )}

                {/* STEP 2: ÁREA DE ATUAÇÃO */}
                {step === "area" && (
                    <motion.div
                        key="area"
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="space-y-6"
                    >
                        <h3 className="text-2xl font-bold text-white mb-8">Qual sua área principal de foco hoje?</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {["Desenvolvimento de Software", "Gestão/Produto", "Marketing/Growth", "Empreendedorismo", "Design/Criativo", "Dados/Analytics"].map((area) => (
                                <button
                                    key={area}
                                    onClick={() => {
                                        setFormData({ ...formData, area });
                                        nextStep("level");
                                    }}
                                    className="p-4 rounded-xl border border-white/10 bg-neutral-900 hover:bg-neutral-800 hover:border-red-500/50 text-left transition-all group"
                                >
                                    <span className="text-neutral-200 group-hover:text-white font-medium">{area}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* STEP 3: NÍVEL DE EXPERIÊNCIA */}
                {step === "level" && (
                    <motion.div
                        key="level"
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="space-y-6"
                    >
                        <h3 className="text-2xl font-bold text-white mb-8">Como você classifica seu domínio em IA hoje?</h3>
                        <div className="space-y-4">
                            {[
                                { label: "Explorador", desc: "Uso ChatGPT às vezes, mas sem método." },
                                { label: "Praticante", desc: "Já uso ferramentas no dia a dia, mas quero automatizar." },
                                { label: "Construtor", desc: "Já crio automações ou apps simples." },
                                { label: "Visionário", desc: "Quero liderar a transformação no meu setor." }
                            ].map((level) => (
                                <button
                                    key={level.label}
                                    onClick={() => {
                                        setFormData({ ...formData, level: level.label });
                                        nextStep("challenge");
                                    }}
                                    className="w-full p-5 rounded-xl border border-white/10 bg-neutral-900 hover:bg-neutral-800 hover:border-red-500/50 text-left transition-all group flex flex-col"
                                >
                                    <span className="text-lg font-bold text-white group-hover:text-red-400 mb-1">{level.label}</span>
                                    <span className="text-sm text-neutral-400">{level.desc}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* STEP 4: MAIOR DESAFIO */}
                {step === "challenge" && (
                    <motion.div
                        key="challenge"
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="space-y-6"
                    >
                        <h3 className="text-2xl font-bold text-white mb-2">Qual o maior obstáculo no seu caminho?</h3>
                        <p className="text-neutral-400 mb-6">Seja sincero. A mentoria ataca exatamente aqui.</p>
                        <textarea
                            className="w-full h-32 bg-neutral-900 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-red-500 transition-colors resize-none"
                            placeholder="Ex: Sinto que estou ficando para trás..."
                            value={formData.challenge}
                            onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={() => nextStep("capture")}
                                disabled={!formData.challenge}
                                className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continuar
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* STEP 5: CAPTURA */}
                {step === "capture" && (
                    <motion.div
                        key="capture"
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="space-y-6"
                    >
                        <h3 className="text-2xl font-bold text-white mb-6">Último passo para sua evolução.</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Seu Nome</label>
                                <input
                                    type="text"
                                    className="w-full bg-neutral-900 border border-white/10 rounded-lg p-3 text-white focus:border-red-500 outline-none"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Seu Melhor Email</label>
                                <input
                                    type="email"
                                    className="w-full bg-neutral-900 border border-white/10 rounded-lg p-3 text-white focus:border-red-500 outline-none"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">WhatsApp (Opcional)</label>
                                <input
                                    type="tel"
                                    className="w-full bg-neutral-900 border border-white/10 rounded-lg p-3 text-white focus:border-red-500 outline-none"
                                    value={formData.whatsapp}
                                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                />
                            </div>
                        </div>
                        <button
                            onClick={() => nextStep("finish")}
                            className="w-full py-4 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold rounded-xl mt-4 hover:shadow-lg hover:shadow-red-900/20 transition-all"
                        >
                            Solicitar Aplicação à Mentoria
                        </button>
                    </motion.div>
                )}

                {/* STEP 6: FINISH */}
                {step === "finish" && (
                    <motion.div
                        key="finish"
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="text-center py-10"
                    >
                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                            <span className="text-4xl">🚀</span>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-4">Aplicação Recebida!</h3>
                        <p className="text-neutral-400 max-w-md mx-auto mb-8">
                            Nossa equipe vai analisar seu perfil, {formData.name}.
                            Se houver fit para a mentoria, entraremos em contato em até 24 horas.
                        </p>
                        <a href="/" className="text-red-400 hover:text-red-300 underline">Voltar para Home</a>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
}
