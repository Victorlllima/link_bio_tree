"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

type FormData = {
  email: string;
  whatsapp: string;
  instagram: string;
  segmento: string;
  faturamento: string;
  maior_dor: string;
  nivel_ia: string;
  ja_usou: string;
  objetivo: string;
};

const SEGMENTOS = [
  "Consultoria / Mentoria",
  "Saúde e Bem-estar",
  "Educação / Cursos",
  "E-commerce / Loja",
  "Serviços B2B",
  "Agência / Marketing",
  "Imóveis",
  "Jurídico / Contabilidade",
  "Outro",
];

const FATURAMENTOS = [
  "Ainda não faturando",
  "Até R$5.000/mês",
  "R$5.001 a R$20.000/mês",
  "R$20.001 a R$50.000/mês",
  "Acima de R$50.000/mês",
];

const DORES = [
  "Falta de tempo para o operacional",
  "Dificuldade em atrair clientes",
  "Não consigo escalar sem contratar mais",
  "Atendimento lento ou inconsistente",
  "Conteúdo — não sei o que postar",
  "Processos bagunçados / sem automação",
];

const NIVEIS_IA = [
  "Nunca usei IA de forma consistente",
  "Uso ChatGPT às vezes, mas sem método",
  "Uso IA diariamente no negócio",
  "Já tenho automações rodando",
];

const JA_USOU = [
  "Não, é minha primeira vez",
  "Sim, já comprei outros cursos sobre IA",
  "Sim, já tenho agentes rodando",
];

const BLOCS = [
  { id: 1, label: "Sobre você" },
  { id: 2, label: "Seu Negócio" },
  { id: 3, label: "Sua Experiência" },
];

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function OnboardingPage() {
  const [bloc, setBloc] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormData>({ mode: "onBlur" });

  const handleNext = async () => {
    const fields =
      bloc === 1
        ? (["email", "whatsapp", "instagram"] as const)
        : (["segmento", "faturamento", "maior_dor"] as const);
    const valid = await trigger(fields);
    if (valid) setBloc(bloc + 1);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch {
      // falha silenciosa — não bloqueia o lead
    }
    router.push("/onboarding/obrigado");
  };

  const inputCls = (hasError: boolean) =>
    cn(
      "w-full bg-zinc-900/60 border rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-zinc-600",
      "focus:outline-none focus:ring-1 transition-all duration-200",
      hasError
        ? "border-red-500/50 focus:ring-red-500/30"
        : "border-zinc-800 focus:border-orange-500/50 focus:ring-orange-500/20"
    );

  const selectCls = (hasError: boolean) =>
    cn(inputCls(hasError), "appearance-none cursor-pointer");

  return (
    <main className="min-h-screen bg-[#080808] flex flex-col items-center justify-center px-4 py-12">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(249,115,22,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative w-full max-w-lg">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/logo-academy.png"
            alt="RedPro AI Academy"
            width={160}
            height={48}
            className="h-12 w-auto object-contain"
            priority
          />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-orange-500 text-xs font-semibold tracking-widest uppercase mb-3">
            Ficha de Matrícula
          </p>
          <h1 className="text-white font-bold text-2xl sm:text-3xl leading-tight">
            Bem-vindo à Academy
          </h1>
          <p className="text-zinc-500 text-sm mt-2">
            Leva menos de 2 minutos. Seus dados ficam seguros.
          </p>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {BLOCS.map((b, i) => (
            <div key={b.id} className="flex items-center gap-2 flex-1">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                    bloc > b.id
                      ? "bg-orange-500 text-black"
                      : bloc === b.id
                      ? "bg-orange-500/20 border border-orange-500 text-orange-500"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-600"
                  )}
                >
                  {bloc > b.id ? "✓" : b.id}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium hidden sm:block transition-colors",
                    bloc >= b.id ? "text-zinc-300" : "text-zinc-700"
                  )}
                >
                  {b.label}
                </span>
              </div>
              {i < BLOCS.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-px transition-all duration-300",
                    bloc > b.id ? "bg-orange-500/50" : "bg-zinc-800"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {/* BLOCO 1 */}
              {bloc === 1 && (
                <motion.div
                  key="b1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div>
                    <h2 className="text-white font-semibold text-lg mb-1">Sobre você</h2>
                    <p className="text-zinc-600 text-xs">Como entramos em contato e te encontramos nas redes.</p>
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-xs font-medium mb-2 uppercase tracking-wide">E-mail *</label>
                    <input
                      {...register("email", {
                        required: "E-mail obrigatório",
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "E-mail inválido" },
                      })}
                      type="email"
                      placeholder="seu@email.com"
                      className={inputCls(!!errors.email)}
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-xs font-medium mb-2 uppercase tracking-wide">WhatsApp *</label>
                    <input
                      {...register("whatsapp", {
                        required: "WhatsApp obrigatório",
                        minLength: { value: 10, message: "Inclua o DDD" },
                      })}
                      type="tel"
                      placeholder="(61) 99999-9999"
                      className={inputCls(!!errors.whatsapp)}
                    />
                    {errors.whatsapp && <p className="text-red-400 text-xs mt-1.5">{errors.whatsapp.message}</p>}
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-xs font-medium mb-2 uppercase tracking-wide">@ do Instagram *</label>
                    <input
                      {...register("instagram", { required: "Instagram obrigatório" })}
                      placeholder="@seuperfil"
                      className={inputCls(!!errors.instagram)}
                    />
                    {errors.instagram && <p className="text-red-400 text-xs mt-1.5">{errors.instagram.message}</p>}
                  </div>
                </motion.div>
              )}

              {/* BLOCO 2 */}
              {bloc === 2 && (
                <motion.div
                  key="b2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div>
                    <h2 className="text-white font-semibold text-lg mb-1">Seu Negócio</h2>
                    <p className="text-zinc-600 text-xs">Conta sobre o que você faz para personalizarmos sua jornada.</p>
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-xs font-medium mb-2 uppercase tracking-wide">Segmento *</label>
                    <div className="relative">
                      <select
                        {...register("segmento", { required: "Selecione seu segmento" })}
                        defaultValue=""
                        className={selectCls(!!errors.segmento)}
                      >
                        <option value="" disabled>Selecione seu segmento</option>
                        {SEGMENTOS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">▾</span>
                    </div>
                    {errors.segmento && <p className="text-red-400 text-xs mt-1.5">{errors.segmento.message}</p>}
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-xs font-medium mb-2 uppercase tracking-wide">Faturamento mensal *</label>
                    <div className="relative">
                      <select
                        {...register("faturamento", { required: "Selecione sua faixa" })}
                        defaultValue=""
                        className={selectCls(!!errors.faturamento)}
                      >
                        <option value="" disabled>Selecione sua faixa</option>
                        {FATURAMENTOS.map((f) => <option key={f} value={f}>{f}</option>)}
                      </select>
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">▾</span>
                    </div>
                    {errors.faturamento && <p className="text-red-400 text-xs mt-1.5">{errors.faturamento.message}</p>}
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-xs font-medium mb-2 uppercase tracking-wide">Maior dor hoje *</label>
                    <div className="relative">
                      <select
                        {...register("maior_dor", { required: "Selecione uma opção" })}
                        defaultValue=""
                        className={selectCls(!!errors.maior_dor)}
                      >
                        <option value="" disabled>A que mais te incomoda</option>
                        {DORES.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">▾</span>
                    </div>
                    {errors.maior_dor && <p className="text-red-400 text-xs mt-1.5">{errors.maior_dor.message}</p>}
                  </div>
                </motion.div>
              )}

              {/* BLOCO 3 */}
              {bloc === 3 && (
                <motion.div
                  key="b3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div>
                    <h2 className="text-white font-semibold text-lg mb-1">Sua Experiência</h2>
                    <p className="text-zinc-600 text-xs">Onde você está com IA agora para personalizarmos o início.</p>
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-xs font-medium mb-2 uppercase tracking-wide">Nível atual com IA *</label>
                    <div className="space-y-2">
                      {NIVEIS_IA.map((n) => (
                        <label
                          key={n}
                          className="flex items-center gap-3 p-3 rounded-xl border border-zinc-800 cursor-pointer hover:border-orange-500/40 hover:bg-orange-500/5 transition-all"
                        >
                          <input
                            {...register("nivel_ia", { required: "Selecione seu nível" })}
                            type="radio"
                            value={n}
                            className="accent-orange-500 w-4 h-4 flex-shrink-0"
                          />
                          <span className="text-sm text-zinc-300">{n}</span>
                        </label>
                      ))}
                    </div>
                    {errors.nivel_ia && <p className="text-red-400 text-xs mt-1.5">{errors.nivel_ia.message}</p>}
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-xs font-medium mb-2 uppercase tracking-wide">Já fez curso de IA antes? *</label>
                    <div className="relative">
                      <select
                        {...register("ja_usou", { required: "Selecione uma opção" })}
                        defaultValue=""
                        className={selectCls(!!errors.ja_usou)}
                      >
                        <option value="" disabled>Selecione uma opção</option>
                        {JA_USOU.map((j) => <option key={j} value={j}>{j}</option>)}
                      </select>
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">▾</span>
                    </div>
                    {errors.ja_usou && <p className="text-red-400 text-xs mt-1.5">{errors.ja_usou.message}</p>}
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-xs font-medium mb-2 uppercase tracking-wide">O que quer conquistar aqui? *</label>
                    <textarea
                      {...register("objetivo", {
                        required: "Descreva seu objetivo",
                        minLength: { value: 10, message: "Seja mais específico" },
                      })}
                      rows={3}
                      placeholder="Ex: automatizar meu atendimento e liberar 3h por dia..."
                      className={cn(inputCls(!!errors.objetivo), "resize-none leading-relaxed")}
                    />
                    {errors.objetivo && <p className="text-red-400 text-xs mt-1.5">{errors.objetivo.message}</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Botões */}
            <div className={cn("flex mt-8", bloc > 1 ? "gap-3" : "")}>
              {bloc > 1 && (
                <button
                  type="button"
                  onClick={() => setBloc(bloc - 1)}
                  className="flex-1 py-3.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm font-medium hover:border-zinc-500 hover:text-zinc-200 transition-all"
                >
                  ← Voltar
                </button>
              )}

              {bloc < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 py-3.5 rounded-xl bg-orange-500 text-black text-sm font-bold hover:bg-orange-400 active:scale-[0.98] transition-all shadow-lg shadow-orange-500/20"
                >
                  Continuar →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3.5 rounded-xl bg-orange-500 text-black text-sm font-bold hover:bg-orange-400 active:scale-[0.98] transition-all shadow-lg shadow-orange-500/25 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Enviando..." : "Confirmar Matrícula →"}
                </button>
              )}
            </div>
          </form>
        </div>

        <p className="text-center text-zinc-700 text-xs mt-6">
          Seus dados são protegidos. Não compartilhamos com terceiros.
        </p>
      </div>
    </main>
  );
}
