"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── ETAPAS DO FORMULÁRIO ─── */
const STEPS = [
    {
        id: "perfil",
        label: "01 — Seu perfil",
        title: "Quem é você?",
        sub: "Contexto básico para Red entender com quem vai trabalhar."
    },
    {
        id: "negocio",
        label: "02 — Seu negócio",
        title: "Como é sua operação hoje?",
        sub: "Sem julgamento. Red precisa do estado real para ajudar de verdade."
    },
    {
        id: "ia",
        label: "03 — Sua relação com IA",
        title: "O que você já tentou?",
        sub: "Historico de tentativas revela onde estão os bloqueios reais."
    },
    {
        id: "objetivo",
        label: "04 — O que você quer",
        title: "Qual é o resultado que importa?",
        sub: "Seja específico. Respostas vagas geram sessões genéricas."
    },
    {
        id: "agenda",
        label: "05 — Disponibilidade",
        title: "Quando você pode?",
        sub: "Red vai propor horários compatíveis com a sua rotina."
    }
];

type FormData = {
    nome: string;
    email: string;
    whatsapp: string;
    cargo: string;
    segmento: string;
    receita: string;
    equipe: string;
    processos: string;
    maior_dor: string;
    tentou_ia: string;
    ferramentas: string;
    trava: string;
    resultado_ideal: string;
    prazo: string;
    urgencia: string;
    disponibilidade: string[];
    horario: string;
    calendly: string;
    obs: string;
};

const INITIAL: FormData = {
    nome: "", email: "", whatsapp: "", cargo: "", segmento: "",
    receita: "", equipe: "", processos: "", maior_dor: "",
    tentou_ia: "", ferramentas: "", trava: "", resultado_ideal: "",
    prazo: "", urgencia: "", disponibilidade: [], horario: "", calendly: "", obs: ""
};

function Label({ children }: { children: React.ReactNode }) {
    return <label className="block text-sm font-semibold text-white mb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{children}</label>;
}

function Hint({ children }: { children: React.ReactNode }) {
    return <p className="text-xs text-[#52525b] mt-1.5">{children}</p>;
}

const inputClass = "w-full bg-[#111113] border border-[#2a2a2e] rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#3f3f46] focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-colors";
const textareaClass = `${inputClass} resize-none`;
const selectClass = `${inputClass} appearance-none cursor-pointer`;

export default function FichaPage() {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState<FormData>(INITIAL);
    const [submitted, setSubmitted] = useState(false);
    const [sending, setSending] = useState(false);

    const set = (key: keyof FormData, val: string | string[]) =>
        setForm(prev => ({ ...prev, [key]: val }));

    const toggleDisp = (val: string) => {
        const arr = form.disponibilidade.includes(val)
            ? form.disponibilidade.filter(v => v !== val)
            : [...form.disponibilidade, val];
        set("disponibilidade", arr);
    };

    const isLast = step === STEPS.length - 1;

    async function handleSubmit() {
        setSending(true);
        try {
            await fetch("/api/mentoria-ficha", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
        } catch (_) {
            // silencia erro de rede — exibe tela de sucesso mesmo assim
        }
        setSending(false);
        setSubmitted(true);
    }

    if (submitted) {
        return (
            <>
                <Style />
                <main className="min-h-screen bg-[#09090b] text-white flex items-center justify-center px-6">
                    <Glow />
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center max-w-md"
                    >
                        <div className="w-16 h-16 rounded-full bg-orange-500/15 border border-orange-500/30 flex items-center justify-center mx-auto mb-6">
                            <svg className="w-7 h-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 900, fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-0.03em" }} className="text-white mb-4">
                            Ficha recebida!
                        </h2>
                        <p className="text-[#a1a1aa] text-sm leading-relaxed mb-3">
                            Red vai revisar antes do primeiro encontro e vai chegar no seu WhatsApp para confirmar o agendamento.
                        </p>
                        <p className="text-[#71717a] text-sm mb-8">
                            Se quiser agendar diretamente, acesse o Calendly pelo botão abaixo.
                        </p>
                        <a
                            href="https://calendly.com/redproai"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-10 py-4 bg-orange-500 hover:bg-orange-400 text-black font-bold rounded-xl text-sm uppercase tracking-wide transition-colors"
                        >
                            Agendar no Calendly
                        </a>
                        <p className="text-xs text-[#52525b] mt-6">Dúvidas? (61) 99297-8796</p>
                    </motion.div>
                </main>
            </>
        );
    }

    return (
        <>
            <Style />
            <main className="min-h-screen bg-[#09090b] text-white">
                <Glow />

                {/* NAV */}
                <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-3xl mx-auto">
                    <a href="/mentoria" className="flex items-center gap-2 text-[#71717a] hover:text-white transition-colors text-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Voltar
                    </a>
                    <span className="font-mono text-xs tracking-widest text-[#71717a] uppercase">Ficha de onboarding</span>
                </nav>

                <div className="relative z-10 max-w-3xl mx-auto px-6 pb-24">

                    {/* Progress */}
                    <div className="flex gap-1.5 mb-10">
                        {STEPS.map((_, i) => (
                            <div
                                key={i}
                                className="flex-1 h-1 rounded-full transition-all duration-300"
                                style={{ background: i <= step ? "#f97316" : "#1f1f23" }}
                            />
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.25 }}
                        >
                            {/* Step header */}
                            <p className="font-mono text-xs text-orange-500 uppercase tracking-widest mb-3">{STEPS[step].label}</p>
                            <h1
                                style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 900, letterSpacing: "-0.03em", fontSize: "clamp(28px, 4vw, 44px)" }}
                                className="text-white mb-2"
                            >
                                {STEPS[step].title}
                            </h1>
                            <p className="text-[#71717a] text-sm mb-10">{STEPS[step].sub}</p>

                            {/* ─ STEP 0: Perfil ─ */}
                            {step === 0 && (
                                <div className="space-y-6">
                                    <div>
                                        <Label>Nome completo *</Label>
                                        <input className={inputClass} placeholder="Victor Lima" value={form.nome} onChange={e => set("nome", e.target.value)} />
                                    </div>
                                    <div>
                                        <Label>E-mail *</Label>
                                        <input className={inputClass} type="email" placeholder="voce@email.com" value={form.email} onChange={e => set("email", e.target.value)} />
                                    </div>
                                    <div>
                                        <Label>WhatsApp *</Label>
                                        <input className={inputClass} placeholder="(61) 99999-9999" value={form.whatsapp} onChange={e => set("whatsapp", e.target.value)} />
                                        <Hint>Red vai usar para agendar os encontros.</Hint>
                                    </div>
                                    <div>
                                        <Label>Qual é seu papel?</Label>
                                        <select className={selectClass} value={form.cargo} onChange={e => set("cargo", e.target.value)}>
                                            <option value="">Selecione...</option>
                                            <option>Sou dono do negócio / empreendedor</option>
                                            <option>Sou gestor / diretor</option>
                                            <option>Sou profissional liberal / autônomo</option>
                                            <option>Sou consultor / especialista</option>
                                            <option>Outro</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label>Segmento / setor</Label>
                                        <input className={inputClass} placeholder="Ex: consultoria jurídica, e-commerce, saúde..." value={form.segmento} onChange={e => set("segmento", e.target.value)} />
                                    </div>
                                </div>
                            )}

                            {/* ─ STEP 1: Negócio ─ */}
                            {step === 1 && (
                                <div className="space-y-6">
                                    <div>
                                        <Label>Faturamento mensal aproximado</Label>
                                        <select className={selectClass} value={form.receita} onChange={e => set("receita", e.target.value)}>
                                            <option value="">Selecione...</option>
                                            <option>Ainda não fatura (pré-receita)</option>
                                            <option>Até R$ 10k/mês</option>
                                            <option>R$ 10k – 50k/mês</option>
                                            <option>R$ 50k – 200k/mês</option>
                                            <option>Acima de R$ 200k/mês</option>
                                        </select>
                                        <Hint>Informação sigilosa. Ajuda Red a calibrar o nível das sessões.</Hint>
                                    </div>
                                    <div>
                                        <Label>Quantas pessoas trabalham no seu negócio?</Label>
                                        <select className={selectClass} value={form.equipe} onChange={e => set("equipe", e.target.value)}>
                                            <option value="">Selecione...</option>
                                            <option>Só eu (solopreneur)</option>
                                            <option>2 a 5 pessoas</option>
                                            <option>6 a 20 pessoas</option>
                                            <option>Mais de 20 pessoas</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label>Quais processos hoje mais te sugam tempo ou dinheiro?</Label>
                                        <textarea
                                            className={textareaClass}
                                            rows={4}
                                            placeholder="Ex: atendimento repetitivo, geração de proposta, relatórios manuais, follow-up de clientes..."
                                            value={form.processos}
                                            onChange={e => set("processos", e.target.value)}
                                        />
                                        <Hint>Seja específico — esse será o ponto de partida do primeiro encontro.</Hint>
                                    </div>
                                    <div>
                                        <Label>Qual é a maior dor do seu negócio hoje?</Label>
                                        <textarea
                                            className={textareaClass}
                                            rows={3}
                                            placeholder="O que te impede de crescer ou te gera mais stress operacional?"
                                            value={form.maior_dor}
                                            onChange={e => set("maior_dor", e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* ─ STEP 2: Relação com IA ─ */}
                            {step === 2 && (
                                <div className="space-y-6">
                                    <div>
                                        <Label>Você já tentou usar IA no seu negócio?</Label>
                                        <select className={selectClass} value={form.tentou_ia} onChange={e => set("tentou_ia", e.target.value)}>
                                            <option value="">Selecione...</option>
                                            <option>Nunca tentei — não sei nem por onde começar</option>
                                            <option>Já usei um pouco, mas de forma dispersa</option>
                                            <option>Uso algumas ferramentas, mas nada virou sistema</option>
                                            <option>Tenho automações rodando, quero ir além</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label>Quais ferramentas você já usou ou tenta usar?</Label>
                                        <input
                                            className={inputClass}
                                            placeholder="Ex: ChatGPT, Claude, Zapier, Make, N8N, Notion AI..."
                                            value={form.ferramentas}
                                            onChange={e => set("ferramentas", e.target.value)}
                                        />
                                        <Hint>Pode deixar em branco se nunca usou nada.</Hint>
                                    </div>
                                    <div>
                                        <Label>Quando tentou usar IA, onde travou?</Label>
                                        <textarea
                                            className={textareaClass}
                                            rows={4}
                                            placeholder="Ex: não sabia o que pedir, resultado era genérico, não consegui integrar com meu processo, não tive tempo para configurar..."
                                            value={form.trava}
                                            onChange={e => set("trava", e.target.value)}
                                        />
                                        <Hint>Esse ponto de travamento é o que Red vai destravar primeiro.</Hint>
                                    </div>
                                </div>
                            )}

                            {/* ─ STEP 3: Objetivo ─ */}
                            {step === 3 && (
                                <div className="space-y-6">
                                    <div>
                                        <Label>Se a mentoria der 100% certo, o que muda no seu negócio?</Label>
                                        <textarea
                                            className={textareaClass}
                                            rows={4}
                                            placeholder="Seja específico: qual processo some, qual custo cai, qual resultado aparece?"
                                            value={form.resultado_ideal}
                                            onChange={e => set("resultado_ideal", e.target.value)}
                                        />
                                        <Hint>Essa resposta define o critério de sucesso que Red vai perseguir com você.</Hint>
                                    </div>
                                    <div>
                                        <Label>Em quanto tempo você precisa ver esse resultado?</Label>
                                        <select className={selectClass} value={form.prazo} onChange={e => set("prazo", e.target.value)}>
                                            <option value="">Selecione...</option>
                                            <option>Imediatamente — já está crítico</option>
                                            <option>Nos próximos 30 dias</option>
                                            <option>Nos próximos 90 dias</option>
                                            <option>Não tenho pressa — quero fazer direito</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label>Por que agora? O que mudou?</Label>
                                        <textarea
                                            className={textareaClass}
                                            rows={3}
                                            placeholder="O que te fez tomar essa decisão hoje e não mês passado?"
                                            value={form.urgencia}
                                            onChange={e => set("urgencia", e.target.value)}
                                        />
                                        <Hint>Entender o gatilho ajuda Red a priorizar o que é realmente urgente para você.</Hint>
                                    </div>
                                </div>
                            )}

                            {/* ─ STEP 4: Disponibilidade ─ */}
                            {step === 4 && (
                                <div className="space-y-6">
                                    <div>
                                        <Label>Quais dias funcionam para você?</Label>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                                            {["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"].map(dia => (
                                                <button
                                                    key={dia}
                                                    type="button"
                                                    onClick={() => toggleDisp(dia)}
                                                    className={`py-2.5 px-3 rounded-xl border text-sm font-mono font-bold transition-all ${form.disponibilidade.includes(dia)
                                                        ? "border-orange-500 bg-orange-500/10 text-orange-400"
                                                        : "border-[#2a2a2e] bg-[#111113] text-[#71717a] hover:border-[#3f3f46]"
                                                        }`}
                                                >
                                                    {dia}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Qual horário preferido?</Label>
                                        <select className={selectClass} value={form.horario} onChange={e => set("horario", e.target.value)}>
                                            <option value="">Selecione...</option>
                                            <option>Manhã (8h–12h)</option>
                                            <option>Tarde (13h–18h)</option>
                                            <option>Noite (19h–22h)</option>
                                            <option>Flexível — qualquer horário</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label>Quer já agendar o primeiro encontro agora?</Label>
                                        <div className="flex flex-col sm:flex-row gap-3 mt-2">
                                            {["Sim, quero agendar pelo Calendly", "Prefiro que Red entre em contato pelo WhatsApp"].map(opt => (
                                                <button
                                                    key={opt}
                                                    type="button"
                                                    onClick={() => set("calendly", opt)}
                                                    className={`flex-1 py-3 px-4 rounded-xl border text-sm font-semibold transition-all text-left ${form.calendly === opt
                                                        ? "border-orange-500 bg-orange-500/10 text-white"
                                                        : "border-[#2a2a2e] bg-[#111113] text-[#71717a] hover:border-[#3f3f46]"
                                                        }`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Algo mais que Red precisa saber antes do primeiro encontro?</Label>
                                        <textarea
                                            className={textareaClass}
                                            rows={3}
                                            placeholder="Contexto extra, restrições, expectativas específicas..."
                                            value={form.obs}
                                            onChange={e => set("obs", e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navegação */}
                    <div className="flex items-center justify-between mt-12">
                        <button
                            type="button"
                            onClick={() => setStep(s => Math.max(0, s - 1))}
                            disabled={step === 0}
                            className="px-6 py-3 rounded-xl border border-[#2a2a2e] bg-[#111113] text-[#71717a] text-sm font-semibold hover:text-white hover:border-[#3f3f46] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            ← Voltar
                        </button>

                        {!isLast ? (
                            <button
                                type="button"
                                onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}
                                className="px-8 py-3 bg-orange-500 hover:bg-orange-400 text-black font-bold rounded-xl text-sm transition-colors"
                            >
                                Continuar →
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={sending}
                                className="px-8 py-3 bg-orange-500 hover:bg-orange-400 text-black font-bold rounded-xl text-sm transition-colors disabled:opacity-50"
                            >
                                {sending ? "Enviando..." : "Enviar ficha ✓"}
                            </button>
                        )}
                    </div>

                    <p className="text-xs text-[#52525b] text-center mt-6">
                        Etapa {step + 1} de {STEPS.length} · Suas informações são confidenciais
                    </p>
                </div>
            </main>
        </>
    );
}

function Style() {
    return (
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200;12..96,800;12..96,900&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;700&display=swap');
            body { font-family: 'DM Sans', sans-serif; }
        `}</style>
    );
}

function Glow() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0">
            <div style={{ background: "radial-gradient(ellipse 60% 35% at 50% -5%, rgba(249,115,22,0.10) 0%, transparent 60%)" }} className="absolute inset-0" />
        </div>
    );
}
