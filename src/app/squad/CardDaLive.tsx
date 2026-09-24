import { BeamCard } from "@/components/ui/beam-card";

/**
 * O card da live semanal (Red, 24/09/2026).
 *
 * Ele existe para marcar um contraste que a página não estava fazendo: o módulo é
 * roteiro fechado, gravado e testado; a live é o que é novo demais para caber em
 * qualquer aula gravada.
 *
 * 🔴 SEM DATA NOS EXEMPLOS (Red, 24/09/2026). A live é semanal e recorrente: data no
 * exemplo envelhece a página toda semana e deixa o argumento velho justamente onde ele
 * deveria estar mais novo. O que fica é o TIPO de coisa que entra na live.
 *
 * Fontes dos exemplos, lidas em 24/09/2026: o post do @tonbistudio sobre o Modo Simples
 * do Desktop e o anúncio da Nous no mesmo dia, mais as notas de versão do
 * NousResearch/hermes-agent (v0.21.4 e v0.21.5). Trocar o conteúdo a cada ciclo, sem
 * nunca colocar data de volta.
 */
const NOVIDADES = [
    {
        t: "O Desktop ganhou um Modo Simples",
        d: "Uma tela limpa, só a conversa e a lista de sessões, sem os instrumentos de desenvolvedor. Você volta para o Avançado quando quiser e o seu espaço de trabalho reaparece exatamente como você deixou.",
    },
    {
        t: "A aba de MCP virou Connectors",
        d: "Plugin recém-instalado oferece ligar os servidores dele na hora, e as ferramentas dele entram nos chats que já estavam abertos, sem reiniciar nada.",
    },
    {
        t: "Uma onda de SDK de plugin no Desktop",
        d: "Rascunho no campo de escrever, fatias próprias na lista de sessões, preferência de navegação e uma ponte de eventos para o backend do plugin.",
    },
    {
        t: "Skill fixada em toda sessão nova",
        d: "Dá para pendurar uma skill no prompt de toda conversa que nascer, em vez de lembrar de chamar ela na mão.",
    },
];

export function CardDaLive() {
    return (
        <BeamCard variant="brasa" ativo className="w-full">
            <div className="grid gap-10 p-8 sm:p-10 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                    <p className="squad-mono text-[10px] uppercase tracking-[0.3em] text-[#D6A85A]">
                        Toda semana · ao vivo
                    </p>
                    <h3 className="squad-serif mt-4 text-[38px] italic leading-[1.05] text-[#F3D698]">
                        A live da semana
                    </h3>
                    <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-white/60">
                        Os sete módulos são roteiro fechado: cada aula foi escrita, testada e gravada
                        numa ordem que funciona. A live é o contrário disso, e de propósito.
                    </p>
                    <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-white/60">
                        O Hermes muda toda semana. Sai versão nova, botão troca de lugar, aparece
                        recurso que não existia quando a aula foi gravada. É disso que a live trata,
                        junto com o que travou no seu módulo daquela semana.
                    </p>
                    {/* TODO-RED: dia, horário e se a live fica gravada para quem faltar. */}
                </div>

                <div>
                    <p className="squad-mono mb-5 text-[10px] uppercase tracking-[0.24em] text-white/30">
                        O tipo de coisa que entra na live
                    </p>
                    <ul className="space-y-0">
                        {NOVIDADES.map((n) => (
                            <li
                                key={n.t}
                                className="flex gap-4 border-b border-white/[0.06] py-4 last:border-0"
                            >
                                <span
                                    aria-hidden
                                    className="mt-[9px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#D6A85A]/70"
                                />
                                <span>
                                    <span className="block text-[15px] font-medium leading-snug text-white/85">
                                        {n.t}
                                    </span>
                                    <span className="mt-1 block text-[13.5px] leading-snug text-white/45">
                                        {n.d}
                                    </span>
                                </span>
                            </li>
                        ))}
                    </ul>
                    <p className="squad-mono mt-5 text-[10.5px] leading-relaxed text-white/25">
                        Nada disso cabe numa aula gravada. Por isso a live existe.
                    </p>
                </div>
            </div>
        </BeamCard>
    );
}
