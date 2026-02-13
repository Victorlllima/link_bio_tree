"use client";

import { useState } from "react";
import { motion } from "framer-motion";

// Mock Data
const sharks = [
    { id: 1, name: "Ana Silva", role: "Fullstack AI Engineer", skills: ["React", "Python", "LangChain"], rate: "$$$", available: true },
    { id: 2, name: "Pedro Costa", role: "Automation Expert", skills: ["n8n", "Zapier", "OpenAI API"], rate: "$$", available: true },
    { id: 3, name: "Lucas Oliveira", role: "Frontend Creative", skills: ["Three.js", "Tailwind", "Framer"], rate: "$$$$", available: false },
    { id: 4, name: "Mariana Santos", role: "Prompt Engineer", skills: ["GPT-4", "Claude", "Fine-tuning"], rate: "$$", available: true },
    { id: 5, name: "Carlos Dev", role: "Backend Architect", skills: ["Supabase", "Node.js", "Redis"], rate: "$$$", available: true },
    { id: 6, name: "Julia Tech", role: "AI Product Manager", skills: ["Scrum", "Product Discovery", "Jira"], rate: "$$$", available: true },
];

export function SharkRadar() {
    const [filter, setFilter] = useState("Todos");

    const filteredSharks = filter === "Todos"
        ? sharks
        : sharks.filter(s => s.skills.some(skill => skill.includes(filter)) || s.role.includes(filter));

    return (
        <div className="w-full max-w-6xl mx-auto px-4">

            {/* Filter Bar */}
            <div className="flex flex-wrap gap-4 mb-12 justify-center">
                {["Todos", "AI", "Frontend", "Backend", "Automation"].map((tag) => (
                    <button
                        key={tag}
                        onClick={() => setFilter(tag)}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${filter === tag
                                ? "bg-blue-600 border-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)]"
                                : "bg-neutral-900 border-white/10 text-neutral-400 hover:text-white"
                            }`}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSharks.map((shark) => (
                    <motion.div
                        layout
                        key={shark.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="group relative bg-neutral-900/50 border border-white/5 rounded-2xl p-6 hover:bg-neutral-800/80 transition-colors"
                    >
                        {/* Status Dot */}
                        <div className={`absolute top-6 right-6 w-3 h-3 rounded-full ${shark.available ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} title={shark.available ? "Disponível" : "Indisponível"}></div>

                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 mb-4 flex items-center justify-center text-xl font-bold text-white">
                            {shark.name.charAt(0)}
                        </div>

                        <h3 className="text-xl font-bold text-white mb-1">{shark.name}</h3>
                        <p className="text-blue-400 text-sm mb-4">{shark.role}</p>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {shark.skills.map(skill => (
                                <span key={skill} className="bg-white/5 text-neutral-300 text-xs px-2 py-1 rounded">
                                    {skill}
                                </span>
                            ))}
                        </div>

                        <button className="w-full py-3 border border-blue-500/30 text-blue-400 font-bold rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                            Ver Perfil
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
