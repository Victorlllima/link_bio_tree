import { BeamCard } from "@/components/ui/beam-card";

/**
 * O card da live semanal (Red, 24/09/2026).
 *
 * Ele existe para marcar um contraste que a página não estava fazendo: o módulo é
 * roteiro fechado, gravado e testado; a live é o que é novo demais para caber em
 * qualquer aula gravada.
 *
 * Os exemplos abaixo são reais e datados, tirados das notas de versão do
 * NousResearch/hermes-agent lidas em 24/09/2026. Trocar quando envelhecerem: a graça
 * do bloco é ele ser deste mês, não de sempre.
 */
const NOVIDADES = [
    {
        data: "24 set",
        t: "A aba de MCP virou Connectors",
        d: "Plugin instalado agora oferece ligar os servidores dele na hora, e as ferramentas entram em todo chat que já estava aberto.",
    },
    {
        data: "24 set",
        t: "Modo Simples e Avançado no Desktop",
        d: "A mesma instalação passa a ter duas caras. Muda o que aparece na tela de quem está começando.",
    },
    {
        data: "24 set",
        t: "Onda de SDK de plugin do Desktop",
        d: "Rascunho no composer, fatias na lista de sessões, preferência de navegação e uma ponte de eventos para o backend do plugin.",
    },
    {
        data: "21 set",
        t: "O Desktop para de subir um segundo motor",
        d: "Ele passa a se conectar no que já está rodando na máquina. Quem tinha dois processos brigando pelo mesmo banco sentiu.",
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
                        Só nos últimos dias, por exemplo
                    </p>
                    <ul className="space-y-0">
                        {NOVIDADES.map((n) => (
                            <li
                                key={n.t}
                                className="flex gap-5 border-b border-white/[0.06] py-4 last:border-0"
                            >
                                <span className="squad-mono w-12 shrink-0 pt-[3px] text-[10px] tracking-wider text-[#D6A85A]/55">
                                    {n.data}
                                </span>
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
                        Quatro coisas em quatro dias. Nenhuma delas cabe numa aula gravada no mês passado.
                    </p>
                </div>
            </div>
        </BeamCard>
    );
}
