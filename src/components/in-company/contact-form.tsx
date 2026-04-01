"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

interface FormData {
    company: string;
    name: string;
    role: string;
    email: string;
    size: string;
    context: string;
}

export function InCompanyForm() {
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        setError("");
        const res = await fetch("/api/in-company", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            setSubmitted(true);
        } else {
            setError("Erro ao enviar. Tente novamente.");
        }
    };

    if (submitted) {
        return (
            <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-5 h-5 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Solicitação recebida</h3>
                <p className="text-[#71717a] text-sm">Entraremos em contato em até 48 horas com uma proposta personalizada.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block font-mono text-xs text-[#71717a] uppercase tracking-widest mb-1.5">Empresa</label>
                <input
                    {...register("company", { required: true })}
                    className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-3 text-white text-sm focus:border-orange-500/50 outline-none transition-colors placeholder:text-[#71717a]"
                    placeholder="Nome da empresa"
                />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block font-mono text-xs text-[#71717a] uppercase tracking-widest mb-1.5">Responsável</label>
                    <input
                        {...register("name", { required: true })}
                        className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-3 text-white text-sm focus:border-orange-500/50 outline-none transition-colors placeholder:text-[#71717a]"
                        placeholder="Nome completo"
                    />
                </div>
                <div>
                    <label className="block font-mono text-xs text-[#71717a] uppercase tracking-widest mb-1.5">Cargo</label>
                    <input
                        {...register("role", { required: true })}
                        className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-3 text-white text-sm focus:border-orange-500/50 outline-none transition-colors placeholder:text-[#71717a]"
                        placeholder="CEO, CTO..."
                    />
                </div>
            </div>
            <div>
                <label className="block font-mono text-xs text-[#71717a] uppercase tracking-widest mb-1.5">Email corporativo</label>
                <input
                    {...register("email", { required: true })}
                    type="email"
                    className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-3 text-white text-sm focus:border-orange-500/50 outline-none transition-colors placeholder:text-[#71717a]"
                    placeholder="nome@empresa.com"
                />
            </div>
            <div>
                <label className="block font-mono text-xs text-[#71717a] uppercase tracking-widest mb-1.5">Tamanho do time</label>
                <select
                    {...register("size", { required: true })}
                    className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-3 text-white text-sm focus:border-orange-500/50 outline-none transition-colors appearance-none"
                >
                    <option value="">Selecione...</option>
                    <option value="5-15">5 a 15 colaboradores</option>
                    <option value="16-50">16 a 50 colaboradores</option>
                    <option value="50+">Mais de 50 colaboradores</option>
                </select>
            </div>
            <div>
                <label className="block font-mono text-xs text-[#71717a] uppercase tracking-widest mb-1.5">Contexto <span className="normal-case tracking-normal">(opcional)</span></label>
                <textarea
                    {...register("context")}
                    className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-3 text-white text-sm focus:border-orange-500/50 outline-none transition-colors resize-none placeholder:text-[#71717a] h-20"
                    placeholder="Qual o maior desafio do seu time hoje com IA?"
                />
            </div>
            {error && <p className="text-xs text-red-400 text-center">{error}</p>}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-orange-500 hover:bg-orange-400 text-black font-bold rounded-xl text-sm transition-colors disabled:opacity-50"
            >
                {isSubmitting ? "Enviando..." : "Solicitar proposta"}
            </button>
            <p className="text-xs text-center text-[#71717a]">Resposta em até 48 horas · Sem compromisso</p>
        </form>
    );
}
