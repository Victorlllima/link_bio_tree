"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

/* ─── COUNTDOWN até 23/05/2026 08:00 BRT ─── */
const EVENT_DATE = new Date("2026-05-23T11:00:00Z"); // 08:00 BRT = 11:00 UTC

function useCountdown() {
    const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0, expired: false });
    useEffect(() => {
        function calc() {
            const diff = EVENT_DATE.getTime() - Date.now();
            if (diff <= 0) { setTimeLeft({ d: 0, h: 0, m: 0, s: 0, expired: true }); return; }
            const d = Math.floor(diff / 86_400_000);
            const h = Math.floor((diff % 86_400_000) / 3_600_000);
            const m = Math.floor((diff % 3_600_000) / 60_000);
            const s = Math.floor((diff % 60_000) / 1_000);
            setTimeLeft({ d, h, m, s, expired: false });
        }
        calc();
        const id = setInterval(calc, 1_000);
        return () => clearInterval(id);
    }, []);
    return timeLeft;
}

function CTAButton({ className = "" }: { className?: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleClick() {
        setLoading(true);
        try {
            const res = await fetch("/api/imersao/checkout", { method: "POST" });
            const data = await res.json();
            if (data.url) router.push(data.url);
        } catch {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className={`bg-[#f97316] hover:bg-[#ea6c10] disabled:opacity-60 text-black font-bold px-8 py-4 rounded-xl text-lg transition-all duration-200 active:scale-95 ${className}`}
        >
            {loading ? "Aguarde..." : "Garantir minha vaga — R$44"}
        </button>
    );
}

const AGENDA = [
    { hora: "08h00", item: "Abertura + apresentação dos participantes" },
    { hora: "08h30", item: "Mapeamento do negócio: onde a IA gera mais alavanca" },
    { hora: "09h30", item: "Configuração ao vivo do agente — passo a passo" },
    { hora: "11h00", item: "Integração com WhatsApp, Instagram ou e-mail" },
    { hora: "12h00", item: "Pausa" },
    { hora: "13h00", item: "Casos reais: alunos apresentam seus agentes" },
    { hora: "14h00", item: "Próximos passos + plano de 30 dias" },
    { hora: "15h00", item: "Encerramento" },
];

const FAQS = [
    {
        q: "Precisa saber programar?",
        a: "Não. A Imersão foi feita para empreendedores sem background técnico. Você vai construir com IA, não para IA.",
    },
    {
        q: "O evento é ao vivo ou gravado?",
        a: "Ao vivo, no dia 23/05, das 8h às 15h (horário de Brasília). A gravação fica disponível por 30 dias.",
    },
    {
        q: "Qual ferramenta vou usar?",
        a: "Claude (Anthropic) + integrações via ManyChat ou n8n, dependendo do seu caso de uso. Tudo explicado do zero.",
    },
    {
        q: "O que eu vou ter no final do dia?",
        a: "Um agente de IA configurado e respondendo pelo seu negócio — seja atendimento, captação ou triagem de leads.",
    },
    {
        q: "E se eu não puder ir ao vivo?",
        a: "A gravação completa fica disponível. Mas a parte de configuração ao vivo é o coração do evento — recomendo fortemente participar presencialmente.",
    },
];

function FaqItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border border-white/10 rounded-xl overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="w-full text-left px-6 py-4 flex justify-between items-center gap-4 hover:bg-white/5 transition-colors"
            >
                <span className="font-medium text-white">{q}</span>
                <span className="text-[#f97316] text-xl flex-shrink-0">{open ? "−" : "+"}</span>
            </button>
            {open && (
                <div className="px-6 pb-4 text-white/60 text-sm leading-relaxed">{a}</div>
            )}
        </div>
    );
}

export default function ImersaoPage() {
    const { d, h, m, s, expired } = useCountdown();

    return (
        <main className="min-h-screen bg-[#080808] text-white font-sans">

            {/* ─── BANNER TOPO ─── */}
            <div className="bg-[#f97316] text-black text-center py-3 px-4 text-sm font-semibold">
                🔥 Imersão RedPro — 23/05/2026 · Ao vivo das 8h às 15h · Vagas limitadas
            </div>

            {/* ─── HERO ─── */}
            <section className="max-w-3xl mx-auto px-6 pt-16 pb-12 text-center">
                <p className="text-[#f97316] text-sm font-semibold tracking-widest uppercase mb-4">
                    Imersão ao vivo · 23 de maio de 2026
                </p>
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
                    Em um dia você sai com um agente de IA
                    <span className="text-[#f97316]"> respondendo pelo seu negócio.</span>
                </h1>
                <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
                    Das 8h às 15h, ao vivo. Você não aprende sobre IA — você constrói com IA, ao vivo, com Red do seu lado.
                </p>

                <CTAButton className="w-full max-w-sm mx-auto block" />
                <p className="text-white/30 text-xs mt-3">Pagamento seguro via Stripe · Acesso imediato à confirmação</p>

                {/* Countdown */}
                {!expired && (
                    <div className="mt-10 flex justify-center gap-4">
                        {[{ label: "dias", val: d }, { label: "horas", val: h }, { label: "min", val: m }, { label: "seg", val: s }].map(({ label, val }) => (
                            <div key={label} className="flex flex-col items-center bg-white/5 border border-white/10 rounded-xl px-5 py-3 min-w-[72px]">
                                <span className="text-3xl font-bold text-[#f97316]">{String(val).padStart(2, "0")}</span>
                                <span className="text-white/40 text-xs mt-1">{label}</span>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* ─── PARA QUEM É ─── */}
            <section className="max-w-3xl mx-auto px-6 py-12 border-t border-white/10">
                <h2 className="text-2xl font-bold mb-8 text-center">Para quem é a Imersão</h2>
                <div className="grid md:grid-cols-3 gap-4">
                    {[
                        { tag: "Você ainda...", text: "Paga caro para terceiros fazerem o que a IA poderia fazer em minutos." },
                        { tag: "Você tentou...", text: "Usar IA mas nunca transformou em sistema real rodando no negócio." },
                        { tag: "Você quer...", text: "Escalar sem contratar — ter um atendente 24/7 que não tira férias nem fica doente." },
                    ].map(({ tag, text }) => (
                        <div key={tag} className="bg-white/5 border border-white/10 rounded-xl p-5">
                            <p className="text-[#f97316] text-xs font-semibold uppercase tracking-wider mb-2">{tag}</p>
                            <p className="text-white/70 text-sm leading-relaxed">{text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── AGENDA ─── */}
            <section className="max-w-3xl mx-auto px-6 py-12 border-t border-white/10">
                <h2 className="text-2xl font-bold mb-8 text-center">O que acontece no dia</h2>
                <div className="space-y-3">
                    {AGENDA.map(({ hora, item }) => (
                        <div key={hora} className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-xl px-5 py-4">
                            <span className="text-[#f97316] font-mono text-sm font-bold flex-shrink-0 mt-0.5">{hora}</span>
                            <span className="text-white/80 text-sm">{item}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── O QUE VOCÊ VAI CONSTRUIR ─── */}
            <section className="max-w-3xl mx-auto px-6 py-12 border-t border-white/10">
                <h2 className="text-2xl font-bold mb-8 text-center">O que você vai construir</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {[
                        { n: "01", title: "Agente de atendimento", desc: "Responde dúvidas, qualifica leads e agenda reuniões automaticamente pelo Instagram ou WhatsApp." },
                        { n: "02", title: "Integração real", desc: "Conectado ao seu Instagram, WhatsApp ou e-mail — não é demo, é produção." },
                        { n: "03", title: "Plano de 30 dias", desc: "Você sai com as próximas ações claras para expandir o agente para outras partes do negócio." },
                        { n: "04", title: "Acesso à comunidade", desc: "Grupo com todos os participantes da Imersão + suporte direto por 30 dias." },
                    ].map(({ n, title, desc }) => (
                        <div key={n} className="bg-white/5 border border-white/10 rounded-xl p-5">
                            <span className="text-[#f97316] font-bold text-2xl">{n}</span>
                            <h3 className="font-semibold text-white mt-2 mb-1">{title}</h3>
                            <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── SOBRE O RED ─── */}
            <section className="max-w-3xl mx-auto px-6 py-12 border-t border-white/10">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#f97316]/20 border border-[#f97316]/30 flex items-center justify-center text-2xl font-bold text-[#f97316]">R</div>
                    <div>
                        <p className="text-[#f97316] text-xs font-semibold uppercase tracking-wider mb-2">Quem vai conduzir</p>
                        <h3 className="font-bold text-lg mb-2">Victor Lima — Red</h3>
                        <p className="text-white/60 text-sm leading-relaxed">
                            Engenheiro de telecomunicações que não sabe programar e construiu um sistema de 10 agentes de IA rodando 24/7 no próprio negócio.
                            Fundador da RedPro AI Academy, ensina empreendedores a construir com IA usando o Método S.H.A.R.K. — sem código, sem jargão técnico.
                        </p>
                    </div>
                </div>
            </section>

            {/* ─── CTA FINAL ─── */}
            <section className="max-w-3xl mx-auto px-6 py-12 border-t border-white/10 text-center">
                <h2 className="text-3xl font-extrabold mb-3">
                    R$44. Uma vez. Um dia inteiro.
                </h2>
                <p className="text-white/50 mb-8 max-w-md mx-auto">
                    Menos que uma consulta. Mais que qualquer curso gravado.
                    Você sai com o agente no ar.
                </p>
                <CTAButton className="mx-auto" />
                <p className="text-white/30 text-xs mt-3">Pagamento seguro via Stripe · Garantia de 7 dias (CDC)</p>
            </section>

            {/* ─── FAQ ─── */}
            <section className="max-w-3xl mx-auto px-6 py-12 border-t border-white/10">
                <h2 className="text-2xl font-bold mb-6 text-center">Dúvidas frequentes</h2>
                <div className="space-y-3">
                    {FAQS.map((faq) => <FaqItem key={faq.q} {...faq} />)}
                </div>
            </section>

            {/* ─── FOOTER ─── */}
            <footer className="border-t border-white/10 py-8 text-center text-white/30 text-xs">
                <p>@redpro.ia · RedPro AI Academy</p>
                <p className="mt-1">Dúvidas? Me chama no Instagram: <a href="https://instagram.com/redpro.ia" className="text-[#f97316] hover:underline" target="_blank" rel="noopener noreferrer">@redpro.ia</a></p>
            </footer>
        </main>
    );
}
