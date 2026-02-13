import { Footer } from "@/components/footer";
import { VortexForm } from "@/components/newsletter/vortex-input";

export default function NewsletterPage() {
    return (
        <main className="min-h-screen bg-black text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-6 left-6 z-50">
                <a href="/" className="text-neutral-400 hover:text-white flex items-center gap-2 transition-colors">
                    ← Voltar
                </a>
            </div>

            {/* Background Particles (Simulated with simple CSS or similar) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-black to-black z-0"></div>

            <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4">
                <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-800 mb-8 tracking-tighter">
                    SINGULARIDADE
                </h1>
                <p className="text-xl text-center text-neutral-400 max-w-lg mb-12">
                    Conteúdos sobre IA que não parecem ter sido escritos por uma IA.
                    Curadoria humana. Profundidade técnica.
                </p>

                <VortexForm />
            </div>

            <Footer />
        </main>
    );
}
