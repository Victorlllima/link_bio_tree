import { Footer } from "@/components/footer";
import { InCompanyForm } from "@/components/in-company/contact-form";
import Image from "next/image";

export default function InCompanyPage() {
    return (
        <main className="min-h-screen bg-black text-white relative">
            <div className="absolute top-6 left-6 z-50">
                <a href="/" className="text-neutral-400 hover:text-white flex items-center gap-2 transition-colors">
                    ← Voltar
                </a>
            </div>

            <div className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-12">
                {/* Lado Esquerdo: Copy e FOMO */}
                <div className="flex-1 space-y-8">
                    <div className="inline-block px-4 py-1 rounded-full bg-red-900/30 border border-red-500/30 text-red-400 text-sm font-bold uppercase tracking-wider mb-2">
                        Slots Limitados Q1/2026
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                        Instale uma mentalidade de <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Startup de IA</span> no seu time.
                    </h1>
                    <p className="text-xl text-neutral-300 leading-relaxed max-w-xl">
                        Não é apenas um workshop. É uma atualização de sistema operacional para sua equipe.
                        Transforme colaboradores em <span className="text-white font-bold">VibeCoders</span> capazes de prototipar e validar soluções em horas, não semanas.
                    </p>

                    <div className="p-6 bg-neutral-900/50 border-l-4 border-yellow-500 rounded-r-lg">
                        <p className="font-semibold text-yellow-500 mb-1">⚠️ Aviso de Disponibilidade</p>
                        <p className="text-neutral-400 text-sm">
                            Devido à agenda de projetos, abrimos apenas <strong>2 vagas</strong> para consultoria In Company neste trimestre.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-3xl font-bold text-white mb-1">10x</h4>
                            <span className="text-sm text-neutral-500">Mais velocidade de dev</span>
                        </div>
                        <div>
                            <h4 className="text-3xl font-bold text-white mb-1">-40%</h4>
                            <span className="text-sm text-neutral-500">Custo operacional</span>
                        </div>
                    </div>
                </div>

                {/* Lado Direito: Formulário */}
                <div className="flex-1 w-full max-w-md bg-neutral-950 p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 blur-[60px] rounded-full pointer-events-none"></div>
                    <h3 className="text-2xl font-bold mb-6 text-white relative z-10">Aplicação Corporativa</h3>
                    <InCompanyForm />
                </div>
            </div>

            <Footer />
        </main>
    );
}
