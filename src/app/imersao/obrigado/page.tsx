export default function ImersaoObrigadoPage() {
    return (
        <main className="min-h-screen bg-[#080808] text-white font-sans flex items-center justify-center px-6">
            <div className="max-w-lg w-full text-center space-y-6">

                <div className="w-16 h-16 rounded-full bg-[#f97316]/20 border border-[#f97316]/30 flex items-center justify-center text-3xl mx-auto">
                    🎉
                </div>

                <div>
                    <h1 className="text-3xl font-extrabold mb-3">Vaga garantida.</h1>
                    <p className="text-white/60 leading-relaxed">
                        Você vai receber a confirmação no e-mail em instantes.
                        Fique de olho — lá vai estar o link para entrar na sala no dia 23/05.
                    </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left space-y-3">
                    <p className="text-[#f97316] text-xs font-semibold uppercase tracking-wider">Próximos passos</p>
                    {[
                        "Verifique seu e-mail (incluindo spam) — você vai receber o link de acesso",
                        "Salve a data: 23/05/2026 das 8h às 15h",
                        "Me segue no Instagram @redpro.ia — vou mandar lembretes por lá",
                    ].map((step, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <span className="text-[#f97316] font-bold flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                            <p className="text-white/70 text-sm leading-relaxed">{step}</p>
                        </div>
                    ))}
                </div>

                <a
                    href="https://instagram.com/redpro.ia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-[#f97316] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#ea6c10] transition-colors"
                >
                    Seguir @redpro.ia
                </a>

                <p className="text-white/20 text-xs">
                    Dúvidas? Me chama no direct do Instagram.
                </p>
            </div>
        </main>
    );
}
