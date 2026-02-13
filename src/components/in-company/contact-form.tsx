"use client";

import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

export function InCompanyForm() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

    const onSubmit = (data: any) => {
        // Simular envio
        console.log(data);
        alert("Solicitação enviada com prioridade!");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
            <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Nome da Empresa</label>
                <input
                    {...register("company", { required: true })}
                    className="w-full bg-neutral-900/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-500 outline-none focus:ring-1 focus:ring-red-500 transition-all"
                    placeholder="Ex: Tech Solutions Ltda"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">Responsável</label>
                    <input
                        {...register("name", { required: true })}
                        className="w-full bg-neutral-900/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-500 outline-none focus:ring-1 focus:ring-red-500 transition-all"
                        placeholder="Nome completo"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">Cargo</label>
                    <input
                        {...register("role", { required: true })}
                        className="w-full bg-neutral-900/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-500 outline-none focus:ring-1 focus:ring-red-500 transition-all"
                        placeholder="Ex: CTO, HR Manager"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Email Corporativo</label>
                <input
                    {...register("email", { required: true })}
                    type="email"
                    className="w-full bg-neutral-900/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-500 outline-none focus:ring-1 focus:ring-red-500 transition-all"
                    placeholder="nome@empresa.com"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Tamanho do Time para Treinamento</label>
                <select
                    {...register("size", { required: true })}
                    className="w-full bg-neutral-900/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-500 outline-none focus:ring-1 focus:ring-red-500 transition-all appearance-none"
                >
                    <option value="" className="text-neutral-500">Selecione...</option>
                    <option value="5-10">5 a 10 colaboradores</option>
                    <option value="11-50">11 a 50 colaboradores</option>
                    <option value="50+">Mais de 50 colaboradores</option>
                </select>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-red-900/30 transition-all transform hover:-translate-y-1"
            >
                {isSubmitting ? "Enviando..." : "Solicitar Proposta In Company"}
            </button>

            <p className="text-xs text-center text-neutral-500 mt-4">
                * Devido à alta demanda, estamos priorizando empresas de tecnologia e startups em fase de growth.
            </p>
        </form>
    );
}
