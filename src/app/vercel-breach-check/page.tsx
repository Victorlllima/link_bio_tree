import { Footer } from "@/components/footer";

export const metadata = {
    title: "Vercel Breach Check — RedPro AI Academy",
    description: "Ferramenta gratuita pro Claude Code que escaneia seu projeto e detecta tokens expostos no breach da Vercel de abril/2026.",
};

const steps = [
    {
        number: "01",
        title: "Baixe o arquivo",
        description: (
            <>
                Clique no botão abaixo para baixar o arquivo{" "}
                <code className="bg-neutral-800 text-orange-400 px-1.5 py-0.5 rounded text-sm font-mono">
                    vercel-breach-check.md
                </code>
            </>
        ),
        action: {
            label: "Baixar vercel-breach-check.md",
            href: "/vercel-breach-check.md",
            download: true,
        },
    },
    {
        number: "02",
        title: "Mova para a pasta do Claude Code",
        description: "Salve o arquivo no caminho correto do seu sistema:",
        code: {
            mac: "~/.claude/skills/vercel-breach-check.md",
            windows: "C:\\Users\\[seu-nome]\\.claude\\skills\\vercel-breach-check.md",
        },
    },
    {
        number: "03",
        title: "Abra o Claude Code no seu projeto",
        description: (
            <>
                Abra o terminal na raiz do seu projeto e inicie o Claude Code.
                Não precisa de MCP, não precisa de API da Vercel. Funciona com a instalação padrão.
            </>
        ),
        terminal: "claude",
    },
    {
        number: "04",
        title: "Execute o comando",
        description: (
            <>
                Digite o comando abaixo e pressione{" "}
                <kbd className="bg-neutral-800 border border-neutral-600 text-neutral-300 px-2 py-0.5 rounded text-xs font-mono">
                    Enter
                </kbd>
                . A skill vai escanear todos os seus arquivos{" "}
                <code className="bg-neutral-800 text-orange-400 px-1.5 py-0.5 rounded text-sm font-mono">
                    .env*
                </code>{" "}
                automaticamente.
            </>
        ),
        terminal: "/vercel-breach-check",
    },
    {
        number: "05",
        title: "Siga o checklist gerado",
        description: (
            <>
                A skill cria um arquivo{" "}
                <code className="bg-neutral-800 text-orange-400 px-1.5 py-0.5 rounded text-sm font-mono">
                    BREACH_CHECKLIST.md
                </code>{" "}
                na raiz do projeto com todos os tokens classificados por risco — com o link direto
                pra rotacionar em cada serviço. Comece pelos{" "}
                <span className="text-red-400 font-semibold">🔴 Crítico</span>.
            </>
        ),
    },
];

const riskLevels = [
    {
        color: "text-red-400",
        bg: "bg-red-500/10 border-red-500/20",
        dot: "bg-red-500",
        label: "Crítico",
        description: "service_role keys, Stripe live, DATABASE_URL",
    },
    {
        color: "text-orange-400",
        bg: "bg-orange-500/10 border-orange-500/20",
        dot: "bg-orange-500",
        label: "Alto",
        description: "API keys de IA, GitHub tokens, NPM tokens",
    },
    {
        color: "text-yellow-400",
        bg: "bg-yellow-500/10 border-yellow-500/20",
        dot: "bg-yellow-500",
        label: "Médio",
        description: "JWT secrets, signing keys, webhook secrets",
    },
];

export default function VercelBreachCheckPage() {
    return (
        <main className="min-h-screen bg-black text-white relative flex flex-col">

            {/* Nav */}
            <div className="absolute top-4 left-4 z-50">
                <a
                    href="/"
                    className="text-neutral-400 hover:text-white flex items-center gap-2 transition-colors text-sm"
                >
                    ← Voltar
                </a>
            </div>

            {/* Background gradient */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-orange-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-red-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="flex-1 relative z-10 container mx-auto px-4 max-w-2xl py-24">

                {/* Header */}
                <div className="mb-14 text-center">
                    <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                        Ferramenta gratuita — Incidente Vercel Abril 2026
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
                        Vercel foi hackeada.{" "}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">
                            Seus tokens também?
                        </span>
                    </h1>

                    <p className="text-neutral-400 text-lg leading-relaxed max-w-xl mx-auto">
                        Um funcionário deu mole com uma ferramenta de IA. O atacante entrou nos
                        sistemas internos e leu todas as env vars não protegidas. Verifique agora
                        em menos de 2 minutos.
                    </p>
                </div>

                {/* Risk levels */}
                <div className="grid grid-cols-3 gap-3 mb-12">
                    {riskLevels.map((r) => (
                        <div
                            key={r.label}
                            className={`${r.bg} border rounded-xl p-4 text-center`}
                        >
                            <div className={`w-2 h-2 ${r.dot} rounded-full mx-auto mb-2`} />
                            <div className={`${r.color} font-bold text-sm mb-1`}>{r.label}</div>
                            <div className="text-neutral-500 text-xs leading-snug">{r.description}</div>
                        </div>
                    ))}
                </div>

                {/* Steps */}
                <div className="space-y-6 mb-14">
                    {steps.map((step, i) => (
                        <div
                            key={step.number}
                            className="relative bg-neutral-900/60 border border-white/5 rounded-2xl p-6 backdrop-blur-sm"
                        >
                            {/* Connector line */}
                            {i < steps.length - 1 && (
                                <div className="absolute left-[2.35rem] top-full w-px h-6 bg-neutral-800" />
                            )}

                            <div className="flex items-start gap-4">
                                {/* Number */}
                                <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-xs font-black text-white">
                                    {step.number}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-white mb-2 text-base">
                                        {step.title}
                                    </h3>
                                    <p className="text-neutral-400 text-sm leading-relaxed mb-3">
                                        {step.description}
                                    </p>

                                    {/* Code blocks for paths */}
                                    {step.code && (
                                        <div className="space-y-2">
                                            <div className="bg-black/60 border border-white/5 rounded-lg px-4 py-3">
                                                <div className="text-neutral-500 text-xs mb-1 font-mono">Mac / Linux</div>
                                                <code className="text-orange-400 text-sm font-mono break-all">
                                                    {step.code.mac}
                                                </code>
                                            </div>
                                            <div className="bg-black/60 border border-white/5 rounded-lg px-4 py-3">
                                                <div className="text-neutral-500 text-xs mb-1 font-mono">Windows</div>
                                                <code className="text-orange-400 text-sm font-mono break-all">
                                                    {step.code.windows}
                                                </code>
                                            </div>
                                        </div>
                                    )}

                                    {/* Terminal command */}
                                    {step.terminal && (
                                        <div className="bg-black/80 border border-white/5 rounded-lg px-4 py-3 font-mono flex items-center gap-3">
                                            <span className="text-green-500 text-sm select-none">$</span>
                                            <code className="text-green-400 text-sm">{step.terminal}</code>
                                        </div>
                                    )}

                                    {/* Download button */}
                                    {step.action && (
                                        <a
                                            href={step.action.href}
                                            download={step.action.download}
                                            className="inline-flex items-center gap-2 mt-1 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            {step.action.label}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer note */}
                <div className="bg-neutral-900/40 border border-white/5 rounded-xl p-5 text-center">
                    <p className="text-neutral-500 text-sm leading-relaxed">
                        A ferramenta não rotaciona nada automaticamente — só escaneia e orienta.
                        Nenhum valor de token é exibido completo.{" "}
                        <a
                            href="https://vercel.com/kb/bulletin/vercel-april-2026-security-incident"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-400 hover:text-orange-300 transition-colors underline underline-offset-2"
                        >
                            Comunicado oficial da Vercel →
                        </a>
                    </p>
                </div>
            </div>

            <Footer />
        </main>
    );
}
