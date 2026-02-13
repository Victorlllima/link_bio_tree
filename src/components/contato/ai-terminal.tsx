"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export function AiTerminal() {
    const [output, setOutput] = useState<string[]>([
        "> SYSTEM_READY",
        "> CONNECTING_TO_REDPRO_CORE...",
        "> CONNECTION_ESTABLISHED",
        "> Olá. Como posso ajudar seu projeto hoje?"
    ]);
    const [input, setInput] = useState("");
    const endRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [output]);

    const handleCommand = (cmd: string) => {
        setOutput(prev => [...prev, `> ${cmd}`]);

        // Simples lógica de resposta
        setTimeout(() => {
            let response = "";
            const lowerCmd = cmd.toLowerCase();

            if (lowerCmd.includes("preço") || lowerCmd.includes("valor")) {
                response = "> Os valores dependem do escopo do projeto. Posso conectar você a um consultor humano para um orçamento.";
            } else if (lowerCmd.includes("projeto") || lowerCmd.includes("ideia")) {
                response = "> Interessante. Projetos com IA têm alto potencial de escala. Conte-me mais.";
            } else if (lowerCmd.includes("contato") || lowerCmd.includes("falar")) {
                response = "> Enviando seus dados para o canal prioritário do Victor...";
            } else {
                response = "> Comando recebido. Nossa inteligência está processando sua mensagem e um humano entrará em contato em breve.";
            }

            setOutput(prev => [...prev, response]);
        }, 800);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        handleCommand(input);
        setInput("");
    };

    return (
        <div className="w-full max-w-3xl mx-auto bg-black border border-green-500/30 rounded-lg p-6 font-mono text-green-500 shadow-[0_0_30px_rgba(34,197,94,0.15)] min-h-[500px] flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-2 mb-4 scrollbar-thin scrollbar-thumb-green-900 scrollbar-track-black" style={{ maxHeight: '400px' }}>
                {output.map((line, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="break-words"
                    >
                        {line}
                    </motion.div>
                ))}
                <div ref={endRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2 border-t border-green-500/30 pt-4">
                <span className="animate-pulse">{">"}</span>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-green-400 placeholder-green-800"
                    placeholder="Digite sua mensagem (ou 'ajuda')..."
                    autoFocus
                />
            </form>

            {/* Quick Actions */}
            <div className="flex gap-2 mt-4 text-xs">
                <button onClick={() => handleCommand("Quero orçar um projeto")} className="px-3 py-1 border border-green-800 hover:bg-green-900 rounded transition-colors">
                    Orçar Projeto
                </button>
                <button onClick={() => handleCommand("Tenho dúvidas técnicas")} className="px-3 py-1 border border-green-800 hover:bg-green-900 rounded transition-colors">
                    Dúvidas
                </button>
                <button onClick={() => handleCommand("Parceria comercial")} className="px-3 py-1 border border-green-800 hover:bg-green-900 rounded transition-colors">
                    Parceria
                </button>
            </div>
        </div>
    );
}
