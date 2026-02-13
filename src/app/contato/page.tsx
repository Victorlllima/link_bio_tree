import { Footer } from "@/components/footer";
import { AiTerminal } from "@/components/contato/ai-terminal";

export default function ContatoPage() {
    return (
        <main className="min-h-screen bg-neutral-950 text-white flex flex-col relative">
            <div className="absolute top-6 left-6 z-50">
                <a href="/" className="text-neutral-400 hover:text-white flex items-center gap-2 transition-colors">
                    ← Voltar
                </a>
            </div>

            <div className="flex-1 container mx-auto px-4 py-20 flex flex-col items-center justify-center">
                <h1 className="text-4xl font-mono font-bold mb-2 text-green-500">
                    /root/contact_system
                </h1>
                <p className="text-neutral-500 mb-10 font-mono text-sm">
                    Secure Channel Established. Encriptografia E2E ativa.
                </p>

                <AiTerminal />
            </div>

            <Footer />
        </main>
    );
}
