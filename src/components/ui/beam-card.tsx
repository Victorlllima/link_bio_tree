"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * BEAM CARD — a borda viva dos cards de módulo do /squad.
 *
 * 🟡 NOTA DE PROCEDÊNCIA (24/09/2026): o Red mandou o `border-beam.tsx` do Hyperiux Vault,
 * mas a mensagem foi cortada no limite de 50 mil caracteres e chegou só a metade do arquivo
 * (o driver de pulso e a tabela de gradientes; o componente React em si ficou de fora).
 * Este arquivo reproduz o MESMO efeito com CSS puro, sem dependência nova:
 *   1. um fio de 1px girando (conic-gradient + mask), que é o "beam"
 *   2. blooms radiais nas bordas, que é o que dá o brilho colorido
 *   3. respiração lenta de opacidade no hover
 * Se o arquivo original chegar inteiro, ele entra no lugar deste e o resto da página
 * continua funcionando: a interface é a mesma (children + className + variant).
 */

type Variant = "ouro" | "brasa" | "mono";

// 🔴 24/09: as paletas coloridas saíram. Sobre a arte dourada dos módulos, azul e
// ciano brigavam com o ouro e derrubavam a página inteira. Ouro e âmbar, só.
const PALETAS: Record<Variant, [string, string, string, string]> = {
    ouro: ["#D6A85A", "#F3D698", "#B8863C", "#EFC97A"],
    brasa: ["#F97316", "#D6A85A", "#B8863C", "#FBBF24"],
    mono: ["#A3A3A3", "#737373", "#D4D4D4", "#525252"],
};

export function BeamCard({
    children,
    className,
    variant = "ouro",
    ativo = false,
    duracao = 14,
}: {
    children: React.ReactNode;
    className?: string;
    variant?: Variant;
    /** quando o card está aberto, o feixe acelera e o brilho sobe */
    ativo?: boolean;
    duracao?: number;
}) {
    const id = useId().replace(/:/g, "");
    const [c1, c2, c3, c4] = PALETAS[variant];

    return (
        <div
            data-beam={id}
            data-ativo={ativo ? "" : undefined}
            className={cn(
                "group relative isolate overflow-hidden rounded-2xl",
                "bg-[#0B0B0C] transition-[transform,box-shadow] duration-500",
                "hover:-translate-y-[3px]",
                className,
            )}
        >
            <style>{`
        @property --beam-${id} { syntax: "<angle>"; initial-value: 0deg; inherits: false; }
        @keyframes girar-${id} { to { --beam-${id}: 360deg; } }
        [data-beam="${id}"]::before {
          content: ""; position: absolute; inset: 0; border-radius: inherit; padding: 1px;
          background: conic-gradient(from var(--beam-${id}),
            transparent 0deg, ${c1} 30deg, ${c2} 90deg, transparent 150deg,
            transparent 190deg, ${c3} 240deg, ${c4} 300deg, transparent 350deg);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          animation: girar-${id} ${duracao}s linear infinite;
          opacity: .3; transition: opacity .5s ease; pointer-events: none; z-index: 1;
        }
        [data-beam="${id}"]:hover::before, [data-beam="${id}"][data-ativo]::before { opacity: 1; }
        [data-beam="${id}"][data-ativo]::before { animation-duration: ${Math.max(6, duracao / 2)}s; }
        [data-beam="${id}"]::after {
          content: ""; position: absolute; inset: -1px; border-radius: inherit; pointer-events: none; z-index: 0;
          background:
            radial-gradient(ellipse 150px 60px at 18% 0%, ${c1}, transparent 70%),
            radial-gradient(ellipse 130px 55px at 72% 0%, ${c2}, transparent 70%),
            radial-gradient(ellipse 40px 120px at 100% 34%, ${c3}, transparent 70%),
            radial-gradient(ellipse 180px 50px at 64% 100%, ${c4}, transparent 70%),
            radial-gradient(ellipse 36px 110px at 0% 68%, ${c2}, transparent 70%);
          opacity: .1; filter: blur(16px) saturate(1.25); transition: opacity .6s ease;
        }
        [data-beam="${id}"]:hover::after { opacity: .26; }
        [data-beam="${id}"][data-ativo]::after { opacity: .4; }
        @media (prefers-reduced-motion: reduce) {
          [data-beam="${id}"]::before { animation-duration: ${duracao * 3}s; }
        }
      `}</style>
            <div className="relative z-[2] h-full rounded-2xl">{children}</div>
        </div>
    );
}
