import type { Metadata } from "next";
import { TrilhaModulos } from "./TrilhaModulos";
import { CardDaLive } from "./CardDaLive";

export const metadata: Metadata = {
    title: "De Um Agente a Um Squad · RedPro AI Academy",
    description:
        "Sete semanas montando o seu time de agentes, com uma live por semana. Um módulo novo toda semana, e gente do seu lado enquanto você constrói.",
};

/**
 * /squad — a apresentação do De Um Agente a Um Squad.
 *
 * 🔴 MUDANÇA DE PRODUTO (Red, 24/09/2026): os sete módulos deixaram de ser liberados de uma
 * vez. Agora é **um por semana**, com **uma live por semana** para quem está dentro. Isso
 * substitui a decisão de 08/09 ("gravado, tudo de uma vez, sem encontro ao vivo") e muda a
 * cara da coisa: é uma turma andando junta, não um catálogo de vídeo.
 *
 * Pendências marcadas com TODO-RED vivem em .claude/workspace/FILA-DE-PRODUCAO.md.
 */
export default function SquadPage() {
    return (
        <main className="squad-root min-h-screen bg-[#08080A] text-white antialiased">
            <div className="pointer-events-none fixed inset-0 z-0">
                <div className="absolute left-1/2 top-[-18rem] h-[36rem] w-[52rem] -translate-x-1/2 rounded-full bg-orange-500/[0.07] blur-[140px]" />
                <div className="absolute bottom-[-12rem] right-[-8rem] h-[30rem] w-[30rem] rounded-full bg-indigo-500/[0.07] blur-[130px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-6xl px-5 pb-28 pt-16 sm:pt-24">
                <header className="mb-16 text-center sm:mb-20">
                    <img
                        src="/logo-academy.png"
                        alt="RedPro AI Academy"
                        className="mx-auto mb-7 h-28 w-auto sm:h-36"
                    />
                    <h1 className="mx-auto max-w-3xl text-5xl leading-[1.02] tracking-tight sm:text-7xl">
                        De um agente
                        <br />
                        a um <span className="squad-serif italic text-[#F3D698]">squad</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/55">
                        Sete semanas montando o seu time de agentes. Um módulo novo por semana, uma
                        live por semana, e gente construindo junto com você do outro lado.
                    </p>
                </header>

                <section className="mb-16 grid gap-4 sm:mb-20 sm:grid-cols-3">
                    {[
                        {
                            k: "Um módulo por semana",
                            v: "Sete semanas, sete entregas. Você constrói uma coisa por vez, em vez de receber um catálogo e nunca abrir.",
                        },
                        {
                            k: "Módulo é roteiro fechado",
                            v: "Cada aula foi escrita, testada e gravada numa ordem que funciona. É o caminho, sem desvio e sem improviso.",
                        },
                        {
                            k: "Live é o que mudou essa semana",
                            v: "O Hermes muda toda semana. A live existe para o que é novo demais para estar em qualquer aula gravada.",
                        },
                    ].map((c) => (
                        <div
                            key={c.k}
                            className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6"
                        >
                            <p className="mb-2 text-[15px] font-semibold text-white">{c.k}</p>
                            <p className="text-[14px] leading-relaxed text-white/50">{c.v}</p>
                        </div>
                    ))}
                </section>

                <section>
                    <div className="mb-8 text-center">
                        <h2 className="squad-serif text-3xl italic tracking-tight text-[#F3D698] sm:text-4xl">
                            Sete módulos, um por semana
                        </h2>
                        <p className="mt-3 text-[15px] text-white/45">
                            Clique em um módulo para ver as aulas.
                        </p>
                    </div>

                    <TrilhaModulos />
                </section>

                <section className="mt-6">
                    <CardDaLive />
                </section>

                <footer className="mt-20 text-center text-[13px] text-white/30">
                    <p>RedPro AI Academy · suporte@redpro.com.br</p>
                </footer>
            </div>
        </main>
    );
}
