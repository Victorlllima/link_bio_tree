"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "@/components/footer";

/* ─── COUNTDOWN — expira 28/04/2026 23:59:59 (horário de Brasília) ─── */
const DEADLINE = new Date("2026-04-29T02:59:59Z"); // 23:59:59 BRT = 02:59:59 UTC próximo dia

function useCountdown() {
    const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0, expired: false });
    useEffect(() => {
        function calc() {
            const diff = DEADLINE.getTime() - Date.now();
            if (diff <= 0) { setTimeLeft({ h: 0, m: 0, s: 0, expired: true }); return; }
            const h = Math.floor(diff / 3_600_000);
            const m = Math.floor((diff % 3_600_000) / 60_000);
            const s = Math.floor((diff % 60_000) / 1_000);
            setTimeLeft({ h, m, s, expired: false });
        }
        calc();
        const id = setInterval(calc, 1_000);
        return () => clearInterval(id);
    }, []);
    return timeLeft;
}

/* ─── HOTMART LINKS (placeholder — Red substitui) ─── */
const HOTMART = {
    grupo: "https://buy.stripe.com/cNibJ1eAZ1x174M6dhgbm00",
    individual: "https://buy.stripe.com/6oU14n9gFejNfBifNRgbm01",
    intensiva: "https://buy.stripe.com/bJe4gz0K93F974MgRVgbm02",
};

/* ─── DADOS ─── */
const BENEFITS = [
    { icon: "01", title: "Diagnóstico real do seu negócio", desc: "Mapeamos onde a IA pode gerar mais impacto imediato — sem teoria, sem hype." },
    { icon: "02", title: "Implementação assistida", desc: "Você não aprende sobre IA. Você constrói com IA, ao vivo, com Red do seu lado." },
    { icon: "03", title: "Primeiro agente no ar em 30 dias", desc: "Entrega concreta: um processo automatizado rodando no seu negócio." },
    { icon: "04", title: "Mentalidade AI First", desc: "Você sai sabendo como identificar, priorizar e implementar IA continuamente." }
];

const PROFILES = [
    { tag: "Para você se...", headline: "Paga caro para terceiros fazerem o que a IA poderia fazer", sub: "Dev, agência, freelancer. O custo cresce, a dependência também. Existe uma saída." },
    { tag: "Para você se...", headline: "Quer IA no negócio mas não sabe por onde começar", sub: "Você vê os concorrentes evoluindo. Tentou algumas ferramentas mas nada virou sistema." },
    { tag: "Para você se...", headline: "Já usa IA mas quer escalar para o negócio inteiro", sub: "Sabe que o potencial é maior. Precisa de método para não ficar só no básico." }
];

const TIMELINE = [
    {
        encontro: "Encontro 1 — Todos os planos",
        title: "Mentalidade AI First",
        desc: "Vamos resetar a sua forma de pensar IA. Mapeamos o seu negócio, identificamos onde a IA gera mais alavanca e você sai com clareza de onde atacar primeiro. Introdução prática a todas as ferramentas disponíveis hoje para negócios reais.",
        tracks: []
    },
    {
        encontro: "Encontro 2 — Todos os planos",
        title: "Mão na Massa",
        desc: "Vamos usar as ferramentas do encontro anterior e aplicá-las diretamente no seu negócio.",
        tracks: [
            { label: "Grupo", color: "#71717a", detail: "Entrega: primeiro processo automatizado funcionando, construído coletivamente." },
            { label: "Individual", color: "#f97316", detail: "Entrega: agente 100% customizado para o seu negócio, construído ao vivo com Red." },
            { label: "Intensiva", color: "#fb923c", detail: "Entrega: agente customizado + mapeamento completo de stack para os próximos encontros." },
        ]
    },
    {
        encontro: "Encontro 3 — Todos os planos",
        title: "Vibecoding & Criação sem Código",
        desc: "Lovable, Vibecoding, Método S.H.A.R.K. e Claude Code. Você cria aplicações, interfaces e ferramentas reais sem escrever uma linha de código.",
        tracks: []
    },
    {
        encontro: "Encontro 4 — Todos os planos",
        title: "Método S.H.A.R.K. Completo",
        desc: "Da ideia ao produto pronto. Como usar o S.H.A.R.K. para criar qualquer automação ou app de forma estruturada, escalável e sem depender de desenvolvedor.",
        tracks: [
            { label: "Grupo", color: "#71717a", detail: "Encerramento: entrega do plano de expansão para os próximos 30 dias." },
            { label: "Individual", color: "#f97316", detail: "Continua → Encontros 5 e 6: aprofundamento exclusivo no seu negócio + plano 90 dias." },
            { label: "Intensiva", color: "#fb923c", detail: "Continua → Encontros 5 a 8: implementação de agentes avançados + revisão em 90 dias." },
        ]
    }
];

const PLANS = [
    {
        name: "Mentoria em Grupo",
        label: "ATÉ 6 PESSOAS",
        originalPrice: "2.997",
        price: "1.498",
        perPerson: true,
        sessions: "4 encontros",
        duration: "30 dias",
        features: ["4 sessões ao vivo em grupo", "Diagnóstico individual pré-sessão", "Acesso à comunidade S.H.A.R.K.", "Gravações das sessões"],
        highlight: false,
        link: HOTMART.grupo
    },
    {
        name: "Mentoria Individual",
        label: "1:1 COM RED",
        originalPrice: "4.997",
        price: "2.498",
        perPerson: false,
        sessions: "6 encontros",
        duration: "30 dias",
        features: ["6 sessões individuais com Red", "Diagnóstico completo do negócio", "Implementação assistida ao vivo", "Suporte por WhatsApp 30 dias"],
        highlight: true,
        link: HOTMART.individual
    },
    {
        name: "Intensiva",
        label: "TRANSFORMAÇÃO TOTAL",
        originalPrice: "9.997",
        price: "4.998",
        perPerson: false,
        sessions: "8 encontros",
        duration: "60 dias",
        features: ["8 sessões individuais", "Dedicação exclusiva de Red", "3 agentes implementados garantidos", "Suporte 60 dias + revisão 90 dias"],
        highlight: false,
        link: HOTMART.intensiva
    }
];

const FAQ = [
    {
        q: "Para quem é a mentoria?",
        a: "Para empreendedores, gestores e profissionais que querem implementar IA no próprio negócio — com ou sem experiência técnica. O foco é resultado prático, não teoria."
    },
    {
        q: "Preciso saber programar?",
        a: "Não. A proposta inteira da mentoria é justamente te mostrar como construir automações e agentes sem escrever uma linha de código. Se você sabe usar um celular, consegue acompanhar."
    },
    {
        q: "Como funcionam os encontros?",
        a: "São sessões ao vivo por videoconferência, com hora marcada. Cada encontro tem objetivo específico e entrega ao final. Tudo é gravado para você rever quando quiser."
    },
    {
        q: "Qual a diferença entre Individual e Intensiva?",
        a: "Individual tem 6 encontros em 30 dias — foco em diagnóstico + implementação do primeiro agente. Intensiva tem 8 encontros em 60 dias, com dedicação exclusiva de Red e entrega garantida de 3 agentes implementados e funcionando no seu negócio."
    },
    {
        q: "O que acontece depois que eu clico em 'Garantir minha vaga agora'?",
        a: "Você vai direto para o checkout seguro via Stripe. Depois de confirmado o pagamento, você recebe uma ficha de onboarding para Red entender o seu negócio antes do primeiro encontro."
    },
    {
        q: "Quando começam os encontros?",
        a: "A agenda é definida em conjunto após o onboarding. Red organiza as turmas em ciclos mensais — a próxima abertura é em maio de 2026."
    },
    {
        q: "Tem garantia?",
        a: "Sim. 7 dias de garantia legal pelo Código de Defesa do Consumidor. Além disso, se você participar do primeiro encontro e não enxergar valor — antes do segundo encontro —, Red devolve 100% sem perguntas."
    },
    {
        q: "Posso parcelar?",
        a: "Sim. O checkout aceita parcelamento em até 12x no cartão de crédito."
    }
];

/* ─── COMPONENTE FAQ ─── */
function FaqItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div
            className="border border-[#1f1f23] rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => setOpen(!open)}
        >
            <div className="flex items-center justify-between p-5 bg-[#111113] hover:bg-[#161618] transition-colors">
                <span className="text-white text-sm font-semibold pr-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{q}</span>
                <motion.div
                    animate={{ rotate: open ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-orange-500 shrink-0"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </motion.div>
            </div>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                    >
                        <p className="px-5 py-4 text-[#71717a] text-sm leading-relaxed bg-[#0d0d0f] border-t border-[#1f1f23]">{a}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ─── COMPONENTE TIMER BADGE ─── */
function TimerBadge({ h, m, s }: { h: number; m: number; s: number }) {
    const pad = (n: number) => String(n).padStart(2, "0");
    return (
        <span className="font-mono text-orange-400 font-bold tabular-nums">
            {pad(h)}:{pad(m)}:{pad(s)}
        </span>
    );
}

export default function MentoriaPage() {
    const { h, m, s, expired } = useCountdown();

    return (
        <>
            {/* FONTS */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200;12..96,400;12..96,800;12..96,900&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;700&display=swap');
                body { font-family: 'DM Sans', sans-serif; }
            `}</style>

            <main className="min-h-screen bg-[#09090b] text-white relative overflow-x-hidden">

                {/* Background glow */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div style={{ background: "radial-gradient(ellipse 70% 40% at 50% -5%, rgba(249,115,22,0.12) 0%, transparent 60%)" }} className="absolute inset-0" />
                    <div style={{ background: "radial-gradient(ellipse 40% 30% at 85% 85%, rgba(59,130,246,0.06) 0%, transparent 50%)" }} className="absolute inset-0" />
                </div>

                {/* ── BANNER CRONÔMETRO ── */}
                {!expired && (
                    <div
                        className="relative z-20 w-full py-3 px-4 text-center text-sm"
                        style={{ background: "linear-gradient(90deg, #c2410c 0%, #ea580c 50%, #c2410c 100%)" }}
                    >
                        <span className="text-white font-semibold">
                            🔥 Oferta de lançamento — 50% OFF somente hoje até 23h59
                        </span>
                        <span className="mx-3 text-orange-200 opacity-60">|</span>
                        <TimerBadge h={h} m={m} s={s} />
                    </div>
                )}

                {/* NAV */}
                <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
                    <a href="/" className="flex items-center gap-2 text-[#71717a] hover:text-white transition-colors text-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Voltar
                    </a>
                    <span className="font-mono text-xs tracking-widest text-[#71717a] uppercase">RedPro AI Academy</span>
                </nav>

                {/* ── HERO ── */}
                <section className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-24">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">

                        {/* LEFT */}
                        <motion.div
                            initial={{ opacity: 0, x: -24 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.55 }}
                            className="flex-1 lg:max-w-[54%]"
                        >
                            <span
                                className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
                                style={{ background: "rgba(249,115,22,0.15)", color: "#f97316", fontFamily: "'JetBrains Mono', monospace" }}
                            >
                                Mentoria RedPro
                            </span>

                            <h1
                                style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 900, lineHeight: 0.93, letterSpacing: "-0.03em", fontSize: "clamp(40px, 6vw, 80px)" }}
                                className="text-white mb-6"
                            >
                                você tem o<br />
                                negócio.<br />
                                <span style={{ color: "#f97316" }}>falta a ia</span><br />
                                trabalhando nele.
                            </h1>

                            <p className="text-[#a1a1aa] text-base mb-2 leading-relaxed" style={{ fontWeight: 300, maxWidth: 420 }}>
                                Descubra como implementar{" "}
                                <strong className="text-white font-semibold">IA no seu negócio</strong>{" "}
                                e automatizar processos que hoje custam caro — com Red do seu lado.
                            </p>

                            {/* Ancoragem B — frase acima do preço */}
                            <p className="text-[#71717a] text-sm mb-8">
                                Consultoria avulsa de IA custa <span className="line-through text-[#52525b]">R$ 5.000–15.000</span>{" "}
                                — na mentoria você sai com implementação real por muito menos.
                            </p>

                            <motion.a
                                href={HOTMART.individual}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => (window as any).fbq?.('track', 'InitiateCheckout')}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-block w-full sm:w-auto px-10 py-4 bg-orange-500 hover:bg-orange-400 text-black font-bold rounded-xl text-sm uppercase tracking-wide transition-colors text-center"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                            >
                                Garantir minha vaga agora
                            </motion.a>
                            <p className="text-xs text-[#52525b] mt-3">Vagas limitadas por ciclo · Parcele em até 12x no cartão</p>
                        </motion.div>

                        {/* RIGHT — foto */}
                        <motion.div
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="flex-1 relative flex justify-center lg:justify-end"
                        >
                            <div className="absolute pointer-events-none" style={{ inset: "-40px", background: "radial-gradient(ellipse 55% 50% at 55% 55%, rgba(249,115,22,0.22) 0%, transparent 68%)", zIndex: 0 }} />

                            <div className="relative z-10" style={{ width: "clamp(300px, 40vw, 500px)" }}>
                                <img
                                    src="/images/red-mentoria-hero.jpg"
                                    alt="Red — fundador RedPro AI Academy"
                                    className="w-full object-cover object-top"
                                    style={{ display: "block", borderRadius: 0 }}
                                />
                                <div className="absolute top-0 left-0 right-0 pointer-events-none z-20" style={{ height: "22%", background: "linear-gradient(to bottom, #09090b 0%, transparent 100%)" }} />
                                <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-20" style={{ height: "35%", background: "linear-gradient(to top, #09090b 0%, transparent 100%)" }} />
                                <div className="absolute top-0 left-0 bottom-0 pointer-events-none z-20" style={{ width: "22%", background: "linear-gradient(to right, #09090b 0%, transparent 100%)" }} />
                                <div className="absolute top-0 right-0 bottom-0 pointer-events-none z-20" style={{ width: "18%", background: "linear-gradient(to left, #09090b 0%, transparent 100%)" }} />

                                {/* Notificação 1 */}
                                <motion.div
                                    initial={{ opacity: 0, x: -16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.8 }}
                                    className="absolute -left-8 top-[-2%] z-30"
                                    style={{ background: "rgba(13,13,15,0.92)", backdropFilter: "blur(12px)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: 12, padding: "10px 14px", minWidth: 215, boxShadow: "0 8px 32px rgba(0,0,0,0.7), 0 0 0 1px rgba(249,115,22,0.08)" }}
                                >
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                        <span className="text-[#52525b] text-[10px] font-mono tracking-wide">agora mesmo</span>
                                    </div>
                                    <p className="text-white text-xs font-bold leading-snug mb-0.5">Diagnóstico ao vivo com Red 🎯</p>
                                    <p className="text-[#71717a] text-[11px]">Mapeamos suas maiores alavancas de IA juntos</p>
                                </motion.div>

                                {/* Notificação 2 */}
                                <motion.div
                                    initial={{ opacity: 0, x: 16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 1.1 }}
                                    className="absolute -right-6 top-[52%] z-30"
                                    style={{ background: "rgba(13,13,15,0.92)", backdropFilter: "blur(12px)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: 12, padding: "10px 14px", minWidth: 205, boxShadow: "0 8px 32px rgba(0,0,0,0.7), 0 0 0 1px rgba(249,115,22,0.08)" }}
                                >
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                        <span className="text-[#52525b] text-[10px] font-mono tracking-wide">semana 2 da mentoria</span>
                                    </div>
                                    <p className="text-white text-xs font-bold leading-snug mb-0.5">+R$ 100k economizados 💸</p>
                                    <p className="text-[#71717a] text-[11px]">Empresas cortaram custos com IA na mentoria</p>
                                </motion.div>

                                {/* Notificação 3 */}
                                <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 1.35 }}
                                    className="absolute left-1/2 -translate-x-1/2 -bottom-4 z-30"
                                    style={{ background: "rgba(249,115,22,0.12)", backdropFilter: "blur(12px)", border: "1px solid rgba(249,115,22,0.35)", borderRadius: 999, padding: "7px 18px", whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(249,115,22,0.15)" }}
                                >
                                    <span className="text-orange-400 text-[11px] font-mono font-bold tracking-widest uppercase">● Vagas abertas — ciclo maio</span>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ── ANCORAGEM A — tabela de comparação visual ── */}
                <section className="relative z-10 max-w-5xl mx-auto px-6 py-16 border-t border-white/5">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                        <p className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-4">Antes × Depois</p>
                        <h2
                            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, letterSpacing: "-0.02em", fontSize: "clamp(24px, 3.5vw, 40px)" }}
                            className="text-white mb-10"
                        >
                            O que você paga hoje<br />comparado com o que a mentoria entrega.
                        </h2>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { label: "Consultoria avulsa de IA", price: "R$ 5.000–15.000", detail: "1 a 3 reuniões. Diagnóstico genérico. Você sai com um deck, sem nada implementado.", bad: true },
                            { label: "Agência de automação", price: "R$ 3.000–8.000/mês", detail: "Você terceiriza, cria dependência. Qualquer mudança custa mais. Você não aprende nada.", bad: true },
                            { label: "Mentoria Individual RedPro", price: "de R$ 4.997 por R$ 2.498", detail: "6 sessões 1:1. Agente implementado ao vivo. Você sai autônomo, sabendo fazer sozinho.", bad: false },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                className={`p-6 rounded-2xl border flex flex-col gap-3 ${item.bad
                                    ? "border-[#1f1f23] bg-[#111113] opacity-70"
                                    : "border-orange-500/40 bg-gradient-to-b from-orange-500/8 to-[#111113]"
                                    }`}
                            >
                                <p className={`font-mono text-xs uppercase tracking-widest ${item.bad ? "text-[#52525b]" : "text-orange-500"}`}>{item.label}</p>
                                <p className={`font-bold text-lg leading-tight ${item.bad ? "text-[#3f3f46] line-through" : "text-white"}`} style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{item.price}</p>
                                <p className="text-[#71717a] text-sm leading-relaxed">{item.detail}</p>
                                {!item.bad && (
                                    <span className="inline-flex items-center gap-1.5 mt-auto text-xs text-green-400 font-mono">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                        Melhor escolha
                                    </span>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ── PARA QUEM ── */}
                <section className="relative z-10 max-w-5xl mx-auto px-6 py-20 border-t border-white/5">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                        <p className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-4">Para quem é</p>
                        <h2
                            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, letterSpacing: "-0.02em", fontSize: "clamp(24px, 3.5vw, 40px)" }}
                            className="text-white mb-12"
                        >
                            Reconhece alguma dessas situações?
                        </h2>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {PROFILES.map((p, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                className="p-6 rounded-2xl border border-[#1f1f23] bg-[#111113]"
                            >
                                <p className="font-mono text-xs text-orange-500 uppercase tracking-widest mb-3">{p.tag}</p>
                                <h3 className="text-white font-semibold text-base mb-3 leading-snug" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800 }}>{p.headline}</h3>
                                <p className="text-[#71717a] text-sm leading-relaxed">{p.sub}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ── O QUE VOCÊ CONSTRÓI ── */}
                <section className="relative z-10 max-w-5xl mx-auto px-6 py-20 border-t border-white/5">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                        <p className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-4">O que você constrói</p>
                        <h2
                            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, letterSpacing: "-0.02em", fontSize: "clamp(24px, 3.5vw, 40px)" }}
                            className="text-white mb-12"
                        >
                            Não é curso. É construção.
                        </h2>
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {BENEFITS.map((b, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.08 }}
                                className="p-6 rounded-2xl border border-[#1f1f23] bg-[#111113] flex gap-5"
                            >
                                <span className="font-mono text-orange-500 text-xs font-bold mt-1 shrink-0">{b.icon}</span>
                                <div>
                                    <h3 className="text-white font-semibold text-sm mb-1.5">{b.title}</h3>
                                    <p className="text-[#71717a] text-sm leading-relaxed">{b.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ── COMO FUNCIONA ── */}
                <section className="relative z-10 max-w-5xl mx-auto px-6 py-20 border-t border-white/5">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                        <p className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-4">O que acontece em cada encontro</p>
                        <h2
                            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, letterSpacing: "-0.02em", fontSize: "clamp(24px, 3.5vw, 40px)" }}
                            className="text-white mb-12"
                        >
                            Do primeiro encontro<br />ao primeiro resultado.
                        </h2>
                    </motion.div>
                    <div className="relative">
                        <div className="absolute left-[11px] top-0 bottom-0 w-px bg-gradient-to-b from-orange-500/40 via-orange-500/20 to-transparent hidden sm:block" />
                        <div className="space-y-10">
                            {TIMELINE.map((t, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: i * 0.1 }}
                                    className="flex gap-6 items-start"
                                >
                                    <div className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center shrink-0 mt-0.5">
                                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-mono text-xs text-orange-500 uppercase tracking-widest mb-1">{t.encontro}</p>
                                        <h3 className="text-white font-semibold text-base mb-1" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800 }}>{t.title}</h3>
                                        <p className="text-[#71717a] text-sm leading-relaxed mb-3">{t.desc}</p>
                                        {t.tracks.length > 0 && (
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                                                {t.tracks.map((track, j) => (
                                                    <div key={j} className="p-3 rounded-xl border bg-[#111113]" style={{ borderColor: `${track.color}30` }}>
                                                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest mb-1 block" style={{ color: track.color }}>{track.label}</span>
                                                        <p className="text-[#71717a] text-xs leading-relaxed">{track.detail}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── O QUE VOCÊ VAI APRENDER ── */}
                <section className="relative z-10 max-w-5xl mx-auto px-6 py-20 border-t border-white/5">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                        <p className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-4">O que você vai aprender</p>
                        <h2
                            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, letterSpacing: "-0.02em", fontSize: "clamp(24px, 3.5vw, 40px)" }}
                            className="text-white mb-12"
                        >
                            Conteúdo de cada encontro.
                        </h2>
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { num: "01", title: "Mentalidade AI First", desc: "Vamos resetar a sua forma de pensar IA. Mapeamos o seu negócio, identificamos onde a IA gera mais alavanca e você sai com clareza de onde atacar primeiro. Introdução prática a todas as ferramentas disponíveis hoje para negócios reais." },
                            { num: "02", title: "Mão na Massa", desc: "Vamos usar as ferramentas do encontro anterior e aplicá-las diretamente no seu negócio. Entrega: primeiro processo automatizado ou agente funcionando." },
                            { num: "03", title: "Vibecoding & Criação sem Código", desc: "Lovable, Vibecoding, Método S.H.A.R.K. Você cria aplicações, interfaces e ferramentas reais sem escrever uma linha de código." },
                            { num: "04", title: "Método S.H.A.R.K. Completo", desc: "Da ideia ao produto pronto. Como usar o S.H.A.R.K. para criar qualquer automação ou app de forma estruturada, escalável e sem depender de desenvolvedor." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.08 }}
                                className="p-6 rounded-2xl border border-[#1f1f23] bg-[#111113] flex gap-5"
                            >
                                <span className="font-mono text-orange-500 text-xs font-bold mt-1 shrink-0">{item.num}</span>
                                <div>
                                    <h3 className="text-white font-semibold text-sm mb-1.5" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800 }}>{item.title}</h3>
                                    <p className="text-[#71717a] text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ── BÔNUS ── */}
                <section className="relative z-10 max-w-5xl mx-auto px-6 py-20 border-t border-white/5">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                        <p className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-4">Bônus inclusos</p>
                        <h2
                            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, letterSpacing: "-0.02em", fontSize: "clamp(24px, 3.5vw, 40px)" }}
                            className="text-white mb-4"
                        >
                            Você não sai de mãos vazias.
                        </h2>
                        {/* Ancoragem C — valor total dos bônus */}
                        <p className="text-[#71717a] text-sm mb-12">
                            Valor somado dos bônus:{" "}
                            <span className="text-white font-semibold">R$ 2.470</span>
                            {" "}— inclusos sem custo adicional.
                        </p>
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { icon: "🎓", title: "RedPro Academy por 1 ano", valor: "R$ 997", desc: "Acesso completo a todo o conteúdo da RedPro Academy — cursos, atualizações e novos materiais por 12 meses." },
                            { icon: "⚡", title: "Prompts para Negócios", valor: "R$ 297", desc: "Biblioteca exclusiva de prompts testados e otimizados para aplicar em situações reais do seu negócio." },
                            { icon: "🛠️", title: "Skills para Negócios", valor: "R$ 297", desc: "Skills prontas para instalação que automatizam processos recorrentes — do atendimento à gestão." },
                            { icon: "🦈", title: "Comunidade S.H.A.R.K.", valor: "R$ 479", desc: "Acesso à comunidade de mentorados e alunos — troca de experiências, dúvidas e novidades do ecossistema." },
                            { icon: "📹", title: "Gravações dos Encontros", valor: "R$ 197", desc: "Todas as sessões gravadas e disponíveis para você rever quando quiser, no seu ritmo." },
                            { icon: "🔍", title: "Sessão de Revisão (30 dias depois)", valor: "R$ 203", desc: "Um mês após o encerramento da mentoria, fazemos um check-in para avaliar o que evoluiu, ajustar rota e garantir que os resultados estejam consolidados." }
                        ].map((bonus, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.07 }}
                                className="p-6 rounded-2xl border border-[#1f1f23] bg-[#111113]"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <span className="text-2xl">{bonus.icon}</span>
                                    <span className="font-mono text-xs text-orange-500 font-bold">{bonus.valor}</span>
                                </div>
                                <h3 className="text-white font-bold text-sm mb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800 }}>{bonus.title}</h3>
                                <p className="text-[#71717a] text-sm leading-relaxed">{bonus.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ── PLANOS (com preços cortados) ── */}
                <section className="relative z-10 max-w-5xl mx-auto px-6 py-20 border-t border-white/5">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                        <p className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-4">Modalidades</p>
                        <h2
                            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, letterSpacing: "-0.02em", fontSize: "clamp(24px, 3.5vw, 40px)" }}
                            className="text-white mb-4"
                        >
                            Escolha sua intensidade.
                        </h2>
                        {/* Banner urgência */}
                        {!expired && (
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-10 text-xs font-mono font-bold"
                                style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.3)", color: "#f97316" }}>
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse inline-block" />
                                Oferta de lançamento — 50% OFF válido até 23h59 de hoje
                            </div>
                        )}
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {PLANS.map((plan, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                className={`p-6 rounded-2xl border flex flex-col ${plan.highlight
                                    ? "border-orange-500/40 bg-gradient-to-b from-orange-500/8 to-[#111113]"
                                    : "border-[#1f1f23] bg-[#111113]"
                                    }`}
                            >
                                {plan.highlight && (
                                    <p className="font-mono text-xs text-orange-500 uppercase tracking-widest mb-4">Mais escolhido</p>
                                )}
                                {plan.label !== "1:1 COM RED" && (
                                    <p className="font-mono text-xs text-[#71717a] uppercase tracking-widest mb-2">{plan.label}</p>
                                )}
                                <h3 className="text-white font-bold text-lg mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800 }}>{plan.name}</h3>
                                <div className="mb-6">
                                    {/* badge 50% OFF + preço original riscado */}
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold uppercase tracking-wide"
                                            style={{ background: "rgba(249,115,22,0.18)", color: "#f97316" }}>
                                            50% OFF
                                        </span>
                                        <span className="text-[#71717a] text-sm line-through">R$ {plan.originalPrice}</span>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-[#a1a1aa] text-base">R$</span>
                                        <span className="font-black text-white" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "clamp(36px, 4vw, 48px)", letterSpacing: "-0.02em", lineHeight: 1 }}>{plan.price}</span>
                                        {plan.perPerson && <span className="text-[#71717a] text-xs ml-1">/ por pessoa</span>}
                                    </div>
                                    <p className="text-[#71717a] text-xs mt-1">{plan.sessions} · {plan.duration}</p>
                                    {plan.label === "1:1 COM RED" && (
                                        <p className="text-orange-500 text-xs font-mono font-bold uppercase tracking-widest mt-1">{plan.label}</p>
                                    )}
                                </div>
                                <ul className="space-y-2.5 mb-8 flex-1">
                                    {plan.features.map((f, j) => (
                                        <li key={j} className="flex items-start gap-2.5 text-sm text-[#a1a1aa]">
                                            <svg className="w-4 h-4 text-[#22c55e] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <a
                                    href={plan.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => (window as any).fbq?.('track', 'InitiateCheckout', { content_name: plan.name, value: plan.price, currency: 'BRL' })}
                                    className={`w-full py-3 rounded-xl text-sm font-bold transition-colors text-center block ${plan.highlight
                                        ? "bg-orange-500 hover:bg-orange-400 text-black"
                                        : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                                        }`}
                                >
                                    Garantir minha vaga agora
                                </a>
                                <p className="text-center text-[11px] text-[#52525b] mt-2">Parcele em até 12x no cartão</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ── GARANTIA ── */}
                <section className="relative z-10 max-w-5xl mx-auto px-6 py-16 border-t border-white/5">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col sm:flex-row items-center gap-8 p-8 rounded-2xl border border-[#1f1f23] bg-[#111113]"
                    >
                        <div className="text-5xl shrink-0">🛡️</div>
                        <div>
                            <h3 className="text-white font-bold text-xl mb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800 }}>Risco zero. Garantia real.</h3>
                            <p className="text-[#a1a1aa] text-sm leading-relaxed">
                                7 dias de garantia legal pelo Código de Defesa do Consumidor — sem perguntas. Mas se você participar do{" "}
                                <strong className="text-white">primeiro encontro</strong> e não enxergar valor, Red devolve 100% antes do segundo. Você não tem nada a perder.
                            </p>
                        </div>
                    </motion.div>
                </section>

                {/* ── CREDENCIAIS ── */}
                <section className="relative z-10 max-w-5xl mx-auto px-6 py-20 border-t border-white/5">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <p className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-6">Quem é RedPro?</p>
                        <h2
                            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, letterSpacing: "-0.02em", fontSize: "clamp(20px, 3vw, 36px)" }}
                            className="text-white mb-4"
                        >
                            Empresário, Engenheiro,<br />especialista em IA para negócios.
                        </h2>
                        <p className="text-[#71717a] text-sm max-w-2xl mx-auto leading-relaxed mb-4">
                            Engenheiro de Telecomunicações com mais de 10 anos de experiência em gestão de TI para o setor público.
                            MBA em Inteligência Artificial para Negócios. Especialista em Segurança da Informação.
                        </p>
                        <p className="text-[#71717a] text-sm max-w-2xl mx-auto leading-relaxed mb-10">
                            Criador do <strong className="text-white font-semibold">Método S.H.A.R.K.</strong> — framework para criar automações e apps com IA sem escrever uma linha de código.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            {["Engenheiro", "Empresário", "Founder", "Marido", "Pai"].map((stat, i) => (
                                <div key={i} className="px-4 py-2 rounded-full border border-[#1f1f23] bg-[#111113]">
                                    <span className="font-mono text-xs text-[#a1a1aa] tracking-wide">{stat}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* ── FAQ ── */}
                <section className="relative z-10 max-w-3xl mx-auto px-6 py-20 border-t border-white/5">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                        <p className="font-mono text-xs tracking-widest text-orange-500 uppercase mb-4">Dúvidas frequentes</p>
                        <h2
                            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, letterSpacing: "-0.02em", fontSize: "clamp(24px, 3.5vw, 40px)" }}
                            className="text-white mb-10"
                        >
                            Perguntas e respostas.
                        </h2>
                    </motion.div>
                    <div className="space-y-3">
                        {FAQ.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.35, delay: i * 0.05 }}
                            >
                                <FaqItem q={item.q} a={item.a} />
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ── CTA FINAL ── */}
                <section className="relative z-10 max-w-3xl mx-auto px-6 py-20 text-center border-t border-white/5">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                        <h2
                            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 900, letterSpacing: "-0.03em", fontSize: "clamp(32px, 5vw, 56px)" }}
                            className="text-white mb-4"
                        >
                            Pronto para a IA trabalhar<br />
                            <span style={{ color: "#f97316" }}>pelo seu negócio?</span>
                        </h2>

                        {!expired && (
                            <div
                                className="inline-flex flex-col sm:flex-row items-center gap-3 px-6 py-4 rounded-2xl mb-8"
                                style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.35)" }}
                            >
                                <span className="text-orange-400 text-sm font-semibold">🔥 Oferta de 50% OFF expira em</span>
                                <span
                                    className="font-mono font-black tabular-nums text-white"
                                    style={{ fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "0.04em" }}
                                >
                                    {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
                                </span>
                            </div>
                        )}

                        <p className="text-[#a1a1aa] text-sm mb-8">Vagas limitadas por ciclo · Parcele em até 12x no cartão.</p>
                        <motion.a
                            href={HOTMART.individual}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => (window as any).fbq?.('track', 'InitiateCheckout')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-block px-12 py-4 bg-orange-500 hover:bg-orange-400 text-black font-bold rounded-xl text-sm transition-colors"
                        >
                            Garantir minha vaga agora
                        </motion.a>
                        <p className="text-xs text-[#52525b] mt-3">Dúvidas? WhatsApp (61) 99297-8796</p>
                    </motion.div>
                </section>

                <Footer />

            </main>
        </>
    );
}
