"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Step = "area" | "level" | "challenge" | "capture" | "finish";

interface QualificationFlowProps {
    onClose?: () => void;
}

export function QualificationFlow({ onClose }: QualificationFlowProps) {
    const [step, setStep] = useState<Step>("area");
    const [formData, setFormData] = useState({
        area: "",
        level: "",
        challenge: "",
        name: "",
        email: "",
        whatsapp: ""
    });

    const variants = {
        enter: { x: 60, opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: -60, opacity: 0 }
    };

    const steps: Step[] = ["area", "level", "challenge", "capture", "finish"];
    const currentIndex = steps.indexOf(step);
    const progress = ((currentIndex) / (steps.length - 1)) * 100;

    return (
        <div className="w-full max-w-xl mx-auto">
            {/* Progress bar */}
            {step !== "finish" && (
                <div className="mb-8">
                    <div className="h-px bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-orange-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.4 }}
                        />
                    </div>
                </div>
            )}

            <AnimatePresence mode="wait">

                {/* STEP 1: ÁREA */}
                {step === "area" && (
                    <motion.div key="area" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                        <p className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-3">01 / 04</p>
                        <h3 className="text-2xl font-bold text-white mb-8" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                            Qual sua principal área de foco hoje?
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {["Empreendedorismo", "Gestão / Produto", "Marketing / Growth", "Desenvolvimento", "Design / Criativo", "Dados / Analytics"].map((area) => (
                                <button
                                    key={area}
                                    onClick={() => { setFormData({ ...formData, area }); setStep("level"); }}
                                    className="p-4 rounded-xl border border-white/10 bg-[#111113] hover:border-orange-500/50 hover:bg-orange-500/5 text-left transition-all group"
                                >
                                    <span className="text-[#a1a1aa] group-hover:text-white font-medium text-sm transition-colors">{area}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* STEP 2: NÍVEL */}
                {step === "level" && (
                    <motion.div key="level" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                        <p className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-3">02 / 04</p>
                        <h3 className="text-2xl font-bold text-white mb-8" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                            Como você classifica seu domínio em IA hoje?
                        </h3>
                        <div className="space-y-3">
                            {[
                                { label: "Explorador", desc: "Uso ChatGPT às vezes, mas sem método." },
                                { label: "Praticante", desc: "Já uso ferramentas no dia a dia, mas quero automatizar mais." },
                                { label: "Construtor", desc: "Já crio automações. Quero escalar." },
                                { label: "Visionário", desc: "Quero liderar a transformação IA no meu setor." }
                            ].map((level) => (
                                <button
                                    key={level.label}
                                    onClick={() => { setFormData({ ...formData, level: level.label }); setStep("challenge"); }}
                                    className="w-full p-4 rounded-xl border border-white/10 bg-[#111113] hover:border-orange-500/50 hover:bg-orange-500/5 text-left transition-all group flex items-start gap-4"
                                >
                                    <div>
                                        <p className="text-white font-semibold group-hover:text-orange-400 transition-colors text-sm mb-0.5">{level.label}</p>
                                        <p className="text-[#71717a] text-xs">{level.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* STEP 3: DESAFIO */}
                {step === "challenge" && (
                    <motion.div key="challenge" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                        <p className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-3">03 / 04</p>
                        <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                            Qual o maior obstáculo no seu caminho?
                        </h3>
                        <p className="text-[#71717a] text-sm mb-6">Seja direto. A mentoria ataca exatamente aqui.</p>
                        <textarea
                            className="w-full h-32 bg-[#111113] border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors resize-none placeholder:text-[#71717a]"
                            placeholder="Ex: Tenho um negócio funcionando mas não consigo implementar IA sem depender de devs..."
                            value={formData.challenge}
                            onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                        />
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setStep("capture")}
                                disabled={!formData.challenge.trim()}
                                className="px-8 py-3 bg-orange-500 hover:bg-orange-400 text-black font-bold rounded-lg text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                Continuar →
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* STEP 4: CAPTURA */}
                {step === "capture" && (
                    <motion.div key="capture" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                        <p className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-3">04 / 04</p>
                        <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                            Último passo.
                        </h3>
                        <p className="text-[#71717a] text-sm mb-6">Analisamos seu perfil e entramos em contato em até 24h.</p>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-mono text-[#71717a] uppercase tracking-wider mb-1.5">Nome</label>
                                <input
                                    type="text"
                                    className="w-full bg-[#111113] border border-white/10 rounded-lg p-3 text-white text-sm focus:border-orange-500/50 outline-none transition-colors"
                                    placeholder="Seu nome completo"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-[#71717a] uppercase tracking-wider mb-1.5">Email</label>
                                <input
                                    type="email"
                                    className="w-full bg-[#111113] border border-white/10 rounded-lg p-3 text-white text-sm focus:border-orange-500/50 outline-none transition-colors"
                                    placeholder="seu@email.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-[#71717a] uppercase tracking-wider mb-1.5">WhatsApp <span className="normal-case tracking-normal">(opcional)</span></label>
                                <input
                                    type="tel"
                                    className="w-full bg-[#111113] border border-white/10 rounded-lg p-3 text-white text-sm focus:border-orange-500/50 outline-none transition-colors"
                                    placeholder="(11) 99999-9999"
                                    value={formData.whatsapp}
                                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                />
                            </div>
                        </div>
                        <button
                            onClick={async () => {
                                if (!formData.name.trim() || !formData.email.trim()) return;
                                await fetch("/api/mentoria", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify(formData)
                                });
                                setStep("finish");
                            }}
                            disabled={!formData.name.trim() || !formData.email.trim()}
                            className="w-full mt-6 py-4 bg-orange-500 hover:bg-orange-400 text-black font-bold rounded-xl text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            Solicitar Aplicação à Mentoria
                        </button>
                    </motion.div>
                )}

                {/* FINISH */}
                {step === "finish" && (
                    <motion.div key="finish" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="text-center py-8">
                        <div className="w-16 h-16 rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 flex items-center justify-center mx-auto mb-6">
                            <svg className="w-7 h-7 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                            Aplicação Recebida
                        </h3>
                        <p className="text-[#a1a1aa] text-sm max-w-xs mx-auto mb-8 leading-relaxed">
                            Analisaremos seu perfil, {formData.name}. Se houver fit, entraremos em contato em até 24 horas.
                        </p>
                        <button onClick={onClose} className="text-sm text-orange-500 hover:text-orange-400 transition-colors">
                            ← Voltar para a página
                        </button>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
}
