import { Footer } from "@/components/footer";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function EventosPage() {
    return (
        <main className="min-h-screen bg-black text-white relative">
            <div className="absolute top-6 left-6 z-50">
                <a href="/" className="text-neutral-500 hover:text-white flex items-center gap-2 transition-colors font-mono text-sm uppercase tracking-widest">
             // Voltar ao Sistema
                </a>
            </div>

            {/* Hero Speaker - Authority Focus */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <BackgroundBeams className="opacity-30" />
                </div>

                <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">

                    <div className="mb-12 relative">
                        <div className="absolute -inset-4 bg-red-600/20 blur-xl rounded-full animate-pulse"></div>
                        <h1 className="text-6xl md:text-9xl font-black leading-none tracking-tighter text-white relative z-10 text-center">
                            RED<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-black">PRO</span>
                        </h1>
                    </div>

                    <p className="text-2xl md:text-3xl text-neutral-400 max-w-4xl mx-auto mb-16 leading-relaxed text-center font-light">
                        A autoridade máxima em <strong className="text-white font-bold">VibeCoding</strong> e desenvolvimento assistido por IA no Brasil.
                        Eleve o nível técnico e estratégico do seu evento com quem está definindo as regras do jogo.
                    </p>

                    <a href="https://wa.me/5511999999999?text=Ol%C3%A1%2C%20gostaria%20de%20verificar%20a%20agenda%20do%20Victor%20para%20um%20evento." target="_blank" className="group relative px-12 py-5 bg-neutral-900 overflow-hidden rounded-none border border-white/20 hover:border-red-500 transition-colors">
                        <div className="absolute inset-0 w-3 bg-red-600 transition-all duration-[250ms] ease-out group-hover:w-full opacity-10 group-hover:opacity-100"></div>
                        <span className="relative text-white font-mono font-bold text-lg tracking-widest uppercase flex items-center gap-4">
                            Verificar Disponibilidade de Agenda <span className="text-red-500 group-hover:text-white transition-colors">→</span>
                        </span>
                    </a>
                </div>
            </section>

            {/* Authority Metrics */}
            <section className="py-24 border-y border-white/5 bg-neutral-950">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
                        <div className="space-y-4">
                            <span className="block text-5xl md:text-7xl font-black text-white tracking-tighter custom-stroke">FOUNDER</span>
                            <p className="text-neutral-500 text-lg uppercase tracking-widest font-mono">RedPro AI Academy & Método S.H.A.R.K.</p>
                        </div>
                        <div className="space-y-4">
                            <span className="block text-5xl md:text-7xl font-black text-white tracking-tighter custom-stroke">PIONEIRO</span>
                            <p className="text-neutral-500 text-lg uppercase tracking-widest font-mono">VibeCoding no Brasil</p>
                        </div>
                        <div className="space-y-4">
                            <span className="block text-5xl md:text-7xl font-black text-white tracking-tighter custom-stroke">MENTOR</span>
                            <p className="text-neutral-500 text-lg uppercase tracking-widest font-mono">De IA de Executivos</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Temas ABERTOS - Conceito de High Stakes */}
            <section className="py-32 bg-black">
                <div className="container mx-auto px-4 max-w-5xl">
                    <h2 className="text-sm font-bold text-red-600 uppercase tracking-[0.5em] mb-12 text-center">Formatos de Atuação</h2>

                    <div className="space-y-24">
                        {/* Item 1 */}
                        <div className="flex flex-col md:flex-row gap-12 items-center">
                            <div className="flex-1 text-right md:text-right">
                                <h3 className="text-4xl font-bold text-white mb-4">Keynote Speaker</h3>
                                <p className="text-neutral-400 text-lg leading-relaxed">
                                    Palestras de alto impacto visual e intelectual. Uma narrativa construída para chocar, inspirar e provocar mudança imediata de mindset na audiência. Não é uma aula, é um manifesto.
                                </p>
                            </div>
                            <div className="w-full md:w-[200px] h-[1px] md:h-[100px] bg-gradient-to-r md:bg-gradient-to-b from-transparent via-red-900 to-transparent"></div>
                        </div>

                        {/* Item 2 */}
                        <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
                            <div className="flex-1 text-left">
                                <h3 className="text-4xl font-bold text-white mb-4">Live Coding Experience</h3>
                                <p className="text-neutral-400 text-lg leading-relaxed">
                                    A demonstração definitiva de poder. Construção de software complexo ao vivo, em tempo real, sem redes de segurança. A prova cabal de que o jogo mudou.
                                </p>
                            </div>
                            <div className="w-full md:w-[200px] h-[1px] md:h-[100px] bg-gradient-to-r md:bg-gradient-to-b from-transparent via-red-900 to-transparent"></div>
                        </div>

                        {/* Item 3 */}
                        <div className="flex flex-col md:flex-row gap-12 items-center">
                            <div className="flex-1 text-right md:text-right">
                                <h3 className="text-4xl font-bold text-white mb-4">Strategic Advisory</h3>
                                <p className="text-neutral-400 text-lg leading-relaxed">
                                    Participação em painéis executivos e conselhos consultivos para traçar o futuro tecnológico de grandes corporações na era da IA Generativa.
                                </p>
                            </div>
                            <div className="w-full md:w-[200px] h-[1px] md:h-[100px] bg-gradient-to-r md:bg-gradient-to-b from-transparent via-red-900 to-transparent"></div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
