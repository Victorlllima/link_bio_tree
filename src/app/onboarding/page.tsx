"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

type FormData = {
  // Bloco 1 — Sobre você
  email: string;
  whatsapp: string;
  instagram: string;
  // Bloco 2 — Seu Negócio
  segmento: string;
  produto_servico: string;
  faturamento: string;
  tempo_mercado: string;
  // Bloco 3 — Sua Experiência
  maior_obstaculo: string[];
  ja_tentou_ia: string;
  objetivo: string;
};

const SEGMENTOS = [
  "Consultoria / Mentoria",
  "Saúde e Bem-estar",
  "Educação / Cursos online",
  "E-commerce / Produtos físicos",
  "Serviços B2B",
  "Agência / Marketing digital",
  "Imóveis",
  "Jurídico / Contabilidade",
  "Profissional liberal (médico, dentista, arquiteto...)",
  "Ainda não tenho negócio",
  "Outro",
];

const FATURAMENTOS = [
  "Ainda não estou faturando",
  "Até R$5.000/mês",
  "R$5.001 a R$15.000/mês",
  "R$15.001 a R$50.000/mês",
  "Acima de R$50.000/mês",
];

const TEMPO_MERCADO = [
  "Menos de 6 meses",
  "6 meses a 2 anos",
  "2 a 5 anos",
  "Mais de 5 anos",
];

const OBSTACULOS = [
  "Falta de tempo — faço tudo sozinho e não consigo parar",
  "Não consigo escalar sem contratar mais gente",
  "Atendimento lento — perco clientes por demora",
  "Processos bagunçados — cada dia faço de um jeito",
  "Não sei o que postar — conteúdo é um caos",
  "Dificuldade em converter leads em clientes",
  "Custo operacional alto — muita gente para pouca entrega",
];

const JA_TENTOU = [
  "Sou iniciante em IA",
  "Já usei ChatGPT mas sem método",
  "Já tentei outras ferramentas de IA mas não consegui extrair muito delas",
  "Já tenho algumas automações rodando mas quero ir mais fundo",
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
        : (["segmento", "produto_servico", "faturamento", "tempo_mercado"] as const);
    const valid = await trigger(fields);
    if (valid) setBloc(bloc + 1);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const payload = {
      ...data,
      maior_obstaculo: Array.isArray(data.maior_obstaculo)
        ? data.maior_obstaculo.join(" | ")
        : data.maior_obstaculo,
    };
    // Disparo em background — não bloqueia o redirect
    fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      // falha silenciosa — o submit não trava
    });
    // Redirect imediato
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
        {/* Logo — 4x maior */}
        <div className="flex justify-center mb-8">
          <Image
            src="/logo-academy.png"
            alt="RedPro AI Academy"
            width={640}
            height={192}
            className="h-48 w-auto object-contain"
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

              {/* BLOCO 1 — Sobre você */}
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

              {/* BLOCO 2 — Seu Negócio */}
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
                    <p className="text-zinc-600 text-xs">Conta o que você faz para personalizarmos sua jornada.</p>
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
                    <label className="block text-zinc-400 text-xs font-medium mb-2 uppercase tracking-wide">O que você vende ou entrega? *</label>
                    <input
                      {...register("produto_servico", { required: "Descreva o que você vende" })}
                      placeholder="Ex: mentoria de vendas, clínica de estética, loja de roupas..."
                      className={inputCls(!!errors.produto_servico)}
                    />
                    {errors.produto_servico && <p className="text-red-400 text-xs mt-1.5">{errors.produto_servico.message}</p>}
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-xs font-medium mb-2 uppercase tracking-wide">Faturamento mensal atual *</label>
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
                    <label className="block text-zinc-400 text-xs font-medium mb-2 uppercase tracking-wide">Há quanto tempo está no mercado? *</label>
                    <div className="relative">
                      <select
                        {...register("tempo_mercado", { required: "Selecione uma opção" })}
                        defaultValue=""
                        className={selectCls(!!errors.tempo_mercado)}
                      >
                        <option value="" disabled>Selecione</option>
                        {TEMPO_MERCADO.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">▾</span>
                    </div>
                    {errors.tempo_mercado && <p className="text-red-400 text-xs mt-1.5">{errors.tempo_mercado.message}</p>}
                  </div>
                </motion.div>
              )}

              {/* BLOCO 3 — Sua Experiência */}
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
                    <p className="text-zinc-600 text-xs">Onde você está agora com IA.</p>
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-xs font-medium mb-2 uppercase tracking-wide">Quais são seus maiores obstáculos hoje? * <span className="text-zinc-600 normal-case">(marque todos que se aplicam)</span></label>
                    <div className="space-y-2">
                      {OBSTACULOS.map((o) => (
                        <label
                          key={o}
                          className="flex items-start gap-3 p-3 rounded-xl border border-zinc-800 cursor-pointer hover:border-orange-500/40 hover:bg-orange-500/5 transition-all"
                        >
                          <input
                            {...register("maior_obstaculo", {
                              validate: (v) =>
                                (Array.isArray(v) && v.length > 0) || "Selecione pelo menos um obstáculo",
                            })}
                            type="checkbox"
                            value={o}
                            className="accent-orange-500 w-4 h-4 flex-shrink-0 mt-0.5"
                          />
                          <span className="text-sm text-zinc-300 leading-snug">{o}</span>
                        </label>
                      ))}
                    </div>
                    {errors.maior_obstaculo && <p className="text-red-400 text-xs mt-1.5">{(errors.maior_obstaculo as { message?: string }).message}</p>}
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-xs font-medium mb-2 uppercase tracking-wide">Qual é a sua relação com IA hoje? *</label>
                    <div className="relative">
                      <select
                        {...register("ja_tentou_ia", { required: "Selecione uma opção" })}
                        defaultValue=""
                        className={selectCls(!!errors.ja_tentou_ia)}
                      >
                        <option value="" disabled>Selecione</option>
                        {JA_TENTOU.map((j) => <option key={j} value={j}>{j}</option>)}
                      </select>
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">▾</span>
                    </div>
                    {errors.ja_tentou_ia && <p className="text-red-400 text-xs mt-1.5">{errors.ja_tentou_ia.message}</p>}
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-xs font-medium mb-2 uppercase tracking-wide">O que você quer conquistar aqui? *</label>
                    <textarea
                      {...register("objetivo", {
                        required: "Descreva seu objetivo",
                      })}
                      rows={3}
                      placeholder="Ex: quero automatizar meu atendimento e liberar 3h por dia..."
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
