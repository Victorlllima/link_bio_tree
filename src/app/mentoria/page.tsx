import { Footer } from "@/components/footer";
import { QualificationFlow } from "@/components/mentoria/qualification-flow";

export default function MentoriaPage() {
    return (
        <main className="min-h-screen bg-black relative flex flex-col">

            <div className="flex-1 w-full flex flex-col items-center justify-center relative z-10 p-4 pt-20">
                <div className="absolute top-4 left-4 z-50">
                    <a href="/" className="text-neutral-400 hover:text-white flex items-center gap-2 transition-colors">
                        ← Voltar
                    </a>
                </div>

                <QualificationFlow />
            </div>

            <Footer />
        </main>
    );
}
